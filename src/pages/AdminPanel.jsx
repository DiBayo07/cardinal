import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AdminPanel.css';

const REPO_OWNER = 'DiBayo07';
const REPO_NAME = 'cardinal';
const FILE_PATH = 'public/data/reviews.json';

const AdminPanel = () => {
  const { t } = useLanguage();
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('gh_token'));
  
  const [reviews, setReviews] = useState([]);
  const [fileSha, setFileSha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [newReview, setNewReview] = useState({ name: '', university: '', videoUrl: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (token.trim().length > 10) {
      localStorage.setItem('gh_token', token.trim());
      setIsAuthenticated(true);
    } else {
      setError('Неверный токен');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gh_token');
    setToken('');
    setIsAuthenticated(false);
    setReviews([]);
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка доступа. Проверьте токен GitHub.');
      }
      
      const data = await response.json();
      setFileSha(data.sha);
      
      // Decode base64 content
      const content = decodeURIComponent(escape(window.atob(data.content)));
      setReviews(JSON.parse(content));
    } catch (err) {
      setError(err.message);
      if (err.message.includes('401') || err.message.includes('404')) {
        handleLogout();
      }
    }
    setLoading(false);
  };

  const handleSave = async (updatedReviews) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const contentStr = JSON.stringify(updatedReviews, null, 2);
      const encodedContent = window.btoa(unescape(encodeURIComponent(contentStr)));
      
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update reviews via Admin Panel',
          content: encodedContent,
          sha: fileSha
        })
      });
      
      if (!response.ok) throw new Error('Ошибка сохранения на GitHub');
      
      const data = await response.json();
      setFileSha(data.content.sha);
      setReviews(updatedReviews);
      setSuccessMsg('Отзывы успешно обновлены!');
      setNewReview({ name: '', university: '', videoUrl: '' });
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.university || !newReview.videoUrl) return;
    
    // Transform simple YouTube links to embed links if needed
    let embedUrl = newReview.videoUrl;
    if (embedUrl.includes('youtube.com/shorts/')) {
      embedUrl = embedUrl.replace('youtube.com/shorts/', 'youtube.com/embed/');
    }
    
    const newId = Date.now().toString();
    const updated = [...reviews, { ...newReview, id: newId, videoUrl: embedUrl }];
    handleSave(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Точно удалить этот отзыв?')) {
      const updated = reviews.filter(r => r.id !== id);
      handleSave(updated);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-box glass">
          <h2 className="text-center">{t('admin.loginTitle')}</h2>
          <p className="text-center mb-4" style={{fontSize: '0.9rem', color: 'var(--color-text-light)'}}>
            Для безопасности используется GitHub Personal Access Token (PAT).
          </p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="password" 
                className="form-control" 
                placeholder={t('admin.tokenPlaceholder')}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
              {t('admin.loginBtn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>{t('admin.dashboardTitle')}</h2>
        <div style={{display:'flex', gap: '10px', alignItems: 'center'}}>
          <a href="/" className="btn btn-outline" style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
            На сайт
          </a>
          <button onClick={handleLogout} className="btn btn-outline" style={{borderColor: '#dc3545', color: '#dc3545'}}>
            Выйти
          </button>
        </div>
      </div>
      
      <div className="container mt-4">
        {error && <div className="alert alert-error">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        
        <div className="admin-grid">
          <div className="admin-card glass">
            <h3>{t('admin.addBtn')}</h3>
            <form onSubmit={handleAdd} className="mt-4">
              <div className="form-group">
                <input type="text" className="form-control" placeholder={t('admin.name')}
                  value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder={t('admin.university')}
                  value={newReview.university} onChange={e => setNewReview({...newReview, university: e.target.value})} required />
              </div>
              <div className="form-group">
                <input type="url" className="form-control" placeholder="https://www.youtube.com/shorts/..."
                  value={newReview.videoUrl} onChange={e => setNewReview({...newReview, videoUrl: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Сохранение...' : t('admin.addBtn')}
              </button>
            </form>
          </div>
          
          <div className="admin-card glass">
            <h3>Текущие отзывы ({reviews.length})</h3>
            <div className="reviews-list mt-4">
              {loading && reviews.length === 0 ? <p>Загрузка...</p> : null}
              {reviews.map(review => (
                <div key={review.id} className="admin-review-item">
                  <div>
                    <strong>{review.name}</strong> - {review.university}
                  </div>
                  <button onClick={() => handleDelete(review.id)} className="btn-delete" disabled={loading}>
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
