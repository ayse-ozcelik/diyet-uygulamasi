import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, saveUser, saveCurrentUser, getCurrentUser } from '../api/api';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Güvenlik: Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.email) {
      // replace kullanarak history'yi değiştir, geri butonuyla buraya dönemez
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

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

    const users = getAllUsers();

    if (users.find(u => u.email === formData.email)) {
      setMessage({ type: 'error', text: 'Bu e-posta zaten kullanımda!' });
      return;
    }

    const newUser = { ...formData, role: 'user' };
    saveUser(newUser);
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
    const users = getAllUsers();
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      setMessage({ type: 'success', text: `Hoş geldin ${user.name}! Yönlendiriliyorsunuz...` });
      saveCurrentUser(user);
      // replace kullanarak history'yi değiştir, geri butonuyla giriş sayfasına dönemez
      setTimeout(() => { navigate('/dashboard', { replace: true }); }, 1500);
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
            <p className="toggle-form">Hesabın yok mu? <span className="toggle-link" onClick={() => setIsLogin(false)}>Kayıt Ol</span></p>
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
            <p className="toggle-form">Zaten üye misin? <span className="toggle-link" onClick={() => setIsLogin(true)}>Giriş Yap</span></p>
          </div>
        )}
        <div className="auth-admin-section">
          <button className="auth-admin-link" onClick={() => navigate('/admin-login')}>Yönetici (Admin) Girişi</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;