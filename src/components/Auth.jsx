import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için eklendi
import './Auth.css';

function Auth() {
  // --- DURUMLAR (STATE) ---
  const navigate = useNavigate(); // Yönlendirme anahtarı
  const [isLogin, setIsLogin] = useState(true); // Giriş mi yoksa Kayıt mı?
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form verilerini tutan state'ler
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // --- FONKSİYONLAR ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('myAppUsers')) || [];

    if (users.find(u => u.email === formData.email)) {
      setMessage({ type: 'error', text: 'Bu e-posta zaten kullanımda!' });
      return;
    }

    users.push(formData);
    localStorage.setItem('myAppUsers', JSON.stringify(users));
    setMessage({ type: 'success', text: 'Kayıt başarılı! Girişe yönlendiriliyorsunuz...' });

    setTimeout(() => {
      setIsLogin(true);
      setMessage({ type: '', text: '' });
    }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('myAppUsers')) || [];
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      setMessage({ type: 'success', text: `Hoş geldin ${user.name}! Yönlendiriliyorsunuz...` });
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // ARTIK ÇALIŞIYOR: 1.5 saniye sonra Dashboard'a atar
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } else {
      setMessage({ type: 'error', text: 'E-posta veya şifre hatalı!' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="app-logo">🥗</div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {isLogin ? (
          <div id="login-area">
            <h2>Hoş Geldin</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>E-posta</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="E-postanızı girin" 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Şifre</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Şifrenizi girin" 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary">Giriş Yap</button>
            </form>
            <p className="toggle-form">
              Hesabın yok mu? <span onClick={() => setIsLogin(false)} style={{cursor: 'pointer', color: '#43a047', fontWeight: 'bold'}}>Kayıt Ol</span>
            </p>
          </div>
        ) : (
          <div id="register-area">
            <h2>Yeni Hesap Oluştur</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Adınız Soyadınız" 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>E-posta</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="E-posta adresiniz" 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Şifre</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="En az 6 karakter" 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary">Kayıt Ol</button>
            </form>
            <p className="toggle-form">
              Zaten üye misin? <span onClick={() => setIsLogin(true)} style={{cursor: 'pointer', color: '#43a047', fontWeight: 'bold'}}>Giriş Yap</span>
            </p>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* <--- BURASI ADMIN GİRİŞ BUTONU (EN ALTA EKLENDİ) --->  */}
        {/* ------------------------------------------------------- */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/admin-login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#95a5a6',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Yönetici (Admin) Girişi
          </button>
        </div>

      </div>
    </div>
  );
}

export default Auth;