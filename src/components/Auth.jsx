import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- KAYIT OLMA ---
  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Şifreniz en az 6 karakter olmalıdır!' });
      return;
    }

    let users = JSON.parse(localStorage.getItem('myAppUsers')) || [];

    if (users.find(u => u.email === formData.email)) {
      setMessage({ type: 'error', text: 'Bu e-posta zaten kullanımda!' });
      return;
    }

    const newUser = { ...formData, role: 'user' };
    users.push(newUser);
    localStorage.setItem('myAppUsers', JSON.stringify(users));
    setMessage({ type: 'success', text: 'Kayıt başarılı! Girişe yönlendiriliyorsunuz...' });

    setTimeout(() => { setIsLogin(true); setMessage({ type: '', text: '' }); }, 2000);
  };

  // --- GİRİŞ YAPMA ---
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. GÜNCELLENDİ: Yeni admin bilgilerini burada da engelliyoruz
    if (formData.email === "admin@gmail.com" && formData.password === "123456") {
        setMessage({ type: 'error', text: 'Yöneticiler buradan giremez! Yönetici girişini kullanın.' });
        return;
    }

    // 2. LocalStorage kontrolü
    const users = JSON.parse(localStorage.getItem('myAppUsers')) || [];
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      setMessage({ type: 'success', text: `Hoş geldin ${user.name}! Yönlendiriliyorsunuz...` });
      localStorage.setItem('currentUser', JSON.stringify(user));
      setTimeout(() => { navigate('/dashboard'); }, 1500);
    } else {
      setMessage({ type: 'error', text: 'E-posta veya şifre hatalı!' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="app-logo">🥗</div>
        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        {isLogin ? (
          <div id="login-area">
            <h2>Hoş Geldin</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group"><label>E-posta</label><input type="email" name="email" onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Şifre</label><input type="password" name="password" onChange={handleInputChange} required /></div>
              <button type="submit" className="btn-primary">Giriş Yap</button>
            </form>
            <p className="toggle-form">Hesabın yok mu? <span onClick={() => setIsLogin(false)} style={{cursor: 'pointer', color: '#43a047'}}>Kayıt Ol</span></p>
          </div>
        ) : (
          <div id="register-area">
            <h2>Yeni Hesap Oluştur</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Ad Soyad</label><input type="text" name="name" onChange={handleInputChange} required /></div>
              <div className="form-group"><label>E-posta</label><input type="email" name="email" onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Şifre</label><input type="password" name="password" minLength="6" onChange={handleInputChange} required /></div>
              <button type="submit" className="btn-primary">Kayıt Ol</button>
            </form>
            <p className="toggle-form">Zaten üye misin? <span onClick={() => setIsLogin(true)} style={{cursor: 'pointer', color: '#43a047'}}>Giriş Yap</span></p>
          </div>
        )}
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}>
          <button onClick={() => navigate('/admin-login')} style={{ background: 'none', border: 'none', color: '#95a5a6', textDecoration: 'underline', cursor: 'pointer' }}>Yönetici (Admin) Girişi</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;