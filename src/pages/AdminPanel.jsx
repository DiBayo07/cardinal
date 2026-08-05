import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaEdit, FaEyeSlash, FaEye, FaArrowUp, FaArrowDown, FaTrash, FaCheck } from 'react-icons/fa';
import './AdminPanel.css';

const REPO_OWNER = 'DiBayo07';
const REPO_NAME = 'cardinal';

const AdminPanel = () => {
  const { language } = useLanguage();
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('gh_token'));
  
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'content'

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsSha, setReviewsSha] = useState('');
  const [newReview, setNewReview] = useState({ name: '', university: '', videoUrl: '' });
  const [editingId, setEditingId] = useState(null);

  // Content State
  const [content, setContent] = useState(null);
  const [contentSha, setContentSha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'reviews') fetchReviews();
      if (activeTab === 'content') fetchContent();
    }
  }, [isAuthenticated, activeTab, language]); // re-fetch content if language changes

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
  };

  const apiFetch = async (path, method = 'GET', body = null) => {
    const opts = {
      method,
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, opts);
    if (!res.ok) throw new Error(`Ошибка доступа к ${path}`);
    return res.json();
  };

  // --- REVIEWS LOGIC ---
  const fetchReviews = async () => {
    setLoading(true); setError('');
    try {
      const data = await apiFetch('public/data/reviews.json');
      setReviewsSha(data.sha);
      setReviews(JSON.parse(decodeURIComponent(escape(window.atob(data.content)))));
    } catch (err) { setError(err.message); if(err.message.includes('401')) handleLogout(); }
    setLoading(false);
  };

  const handleSaveReviews = async (updated) => {
    setLoading(true); setError(''); setSuccessMsg('');
    try {
      const contentStr = JSON.stringify(updated, null, 2);
      const encodedContent = window.btoa(unescape(encodeURIComponent(contentStr)));
      
      const data = await apiFetch('public/data/reviews.json', 'PUT', {
        message: 'Update reviews',
        content: encodedContent,
        sha: reviewsSha
      });
      setReviewsSha(data.content.sha);
      setReviews(updated);
      setSuccessMsg('Отзывы сохранены!');
      setEditingId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.university || !newReview.videoUrl) return;
    let embedUrl = newReview.videoUrl.replace('youtube.com/shorts/', 'youtube.com/embed/');
    const updated = [...reviews, { ...newReview, id: Date.now().toString(), videoUrl: embedUrl, order: reviews.length }];
    setNewReview({ name: '', university: '', videoUrl: '' });
    handleSaveReviews(updated);
  };

  const handleUpdateReview = (id, field, value) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const moveReview = (index, dir) => {
    const updated = [...reviews];
    if (dir === -1 && index > 0) {
      [updated[index-1], updated[index]] = [updated[index], updated[index-1]];
    } else if (dir === 1 && index < updated.length - 1) {
      [updated[index+1], updated[index]] = [updated[index], updated[index+1]];
    }
    // update order field
    updated.forEach((r, i) => r.order = i);
    handleSaveReviews(updated);
  };

  const deleteReview = (id) => {
    if (window.confirm('Точно удалить?')) handleSaveReviews(reviews.filter(r => r.id !== id));
  };

  // --- CONTENT LOGIC ---
  const fetchContent = async () => {
    setLoading(true); setError('');
    try {
      const data = await apiFetch(`public/data/i18n/${language}.json`);
      setContentSha(data.sha);
      setContent(JSON.parse(decodeURIComponent(escape(window.atob(data.content)))));
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleSaveContent = async () => {
    setLoading(true); setError(''); setSuccessMsg('');
    try {
      const contentStr = JSON.stringify(content, null, 2);
      const encodedContent = window.btoa(unescape(encodeURIComponent(contentStr)));
      
      const data = await apiFetch(`public/data/i18n/${language}.json`, 'PUT', {
        message: `Update ${language} translation`,
        content: encodedContent,
        sha: contentSha
      });
      setContentSha(data.content.sha);
      setSuccessMsg(`Тексты (${language.toUpperCase()}) сохранены!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleContentChange = (section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-box glass">
          <h2 className="text-center gold-text">Вход в Админку</h2>
          <form onSubmit={handleLogin} className="mt-4">
            <div className="form-group">
              <input type="password" className="form-control" placeholder="GitHub Personal Access Token"
                value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Войти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header glass">
        <h2 className="gold-text">Управление сайтом</h2>
        <div style={{display:'flex', gap: '15px'}}>
          <a href="#/" className="btn btn-outline" style={{padding: '10px 20px', fontSize: '0.9rem'}}>На сайт</a>
          <button onClick={handleLogout} className="btn" style={{backgroundColor: '#8C1C21', color: 'white', padding: '10px 20px', fontSize: '0.9rem'}}>Выйти</button>
        </div>
      </div>
      
      <div className="container mt-4">
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Отзывы</button>
          <button className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Тексты (Контент)</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        
        {activeTab === 'reviews' && (
          <div className="admin-grid">
            <div className="admin-card glass">
              <h3 className="gold-text">Добавить отзыв</h3>
              <form onSubmit={handleAddReview} className="mt-4">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Имя студента"
                    value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Страна/Вуз"
                    value={newReview.university} onChange={e => setNewReview({...newReview, university: e.target.value})} required />
                </div>
                <div className="form-group">
                  <input type="url" className="form-control" placeholder="Ссылка на YouTube"
                    value={newReview.videoUrl} onChange={e => setNewReview({...newReview, videoUrl: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Загрузка...' : 'Добавить'}
                </button>
              </form>
            </div>
            
            <div className="admin-card glass">
              <h3 className="gold-text">Текущие отзывы</h3>
              <div className="reviews-list mt-4">
                {reviews.map((r, i) => (
                  <div key={r.id} className={`admin-review-item ${r.isHidden ? 'hidden-item' : ''}`}>
                    {editingId === r.id ? (
                      <div className="edit-form">
                        <input className="form-control mb-2" value={r.name} onChange={e => handleUpdateReview(r.id, 'name', e.target.value)} />
                        <input className="form-control mb-2" value={r.university} onChange={e => handleUpdateReview(r.id, 'university', e.target.value)} />
                        <input className="form-control mb-2" value={r.videoUrl} onChange={e => handleUpdateReview(r.id, 'videoUrl', e.target.value)} />
                        <button className="btn btn-primary btn-sm" onClick={() => handleSaveReviews(reviews)}><FaCheck /> Сохранить</button>
                      </div>
                    ) : (
                      <>
                        <div className="review-info-sm">
                          <strong>{r.name}</strong> <span style={{fontSize: '0.85rem', color: '#ccc'}}>{r.university}</span>
                        </div>
                        <div className="review-actions">
                          <button title="Вверх" onClick={() => moveReview(i, -1)}><FaArrowUp/></button>
                          <button title="Вниз" onClick={() => moveReview(i, 1)}><FaArrowDown/></button>
                          <button title={r.isHidden ? 'Показать' : 'Скрыть'} onClick={() => {
                            r.isHidden = !r.isHidden;
                            handleSaveReviews([...reviews]);
                          }}>
                            {r.isHidden ? <FaEyeSlash color="#8C1C21"/> : <FaEye />}
                          </button>
                          <button title="Редактировать" onClick={() => setEditingId(r.id)}><FaEdit/></button>
                          <button title="Удалить" onClick={() => deleteReview(r.id)}><FaTrash color="#8C1C21"/></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && content && (
          <div className="admin-card glass content-editor">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 className="gold-text">Редактор текстов ({language.toUpperCase()})</h3>
              <button className="btn btn-primary" onClick={handleSaveContent} disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
            
            <p style={{marginBottom: '20px', color: '#aaa'}}>Измените язык сайта в шапке (справа вверху), чтобы редактировать другие языки.</p>
            
            {['hero', 'about', 'cta'].map(section => (
              <div key={section} className="content-section">
                <h4 style={{textTransform: 'uppercase', marginBottom: '15px'}} className="gold-text">{section}</h4>
                {Object.keys(content[section]).map(key => (
                  <div key={key} className="form-group">
                    <label>{key}</label>
                    {key === 'text' || key === 'subtitle' ? (
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={content[section][key]} 
                        onChange={e => handleContentChange(section, key, e.target.value)}
                      />
                    ) : (
                      <input 
                        type="text" 
                        className="form-control" 
                        value={content[section][key]} 
                        onChange={e => handleContentChange(section, key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
