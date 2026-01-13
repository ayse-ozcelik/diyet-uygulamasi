import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Güvenlik: Eğer admin zaten giriş yapmışsa admin paneline yönlendir
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isAdmin && currentUser && currentUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    // GÜNCELLENDİ: Yeni admin bilgileri
    const adminEmail = "admin@gmail.com";
    const adminPass = "123456";

    if (email === adminEmail && password === adminPass) {
      // Giriş Başarılı
      localStorage.setItem('isAdmin', 'true');
      
      const adminUser = { name: "Yönetici", email: adminEmail, role: "admin" };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      
      // replace kullanarak history'yi değiştir, geri butonuyla giriş sayfasına dönemez
      navigate('/admin/dashboard', { replace: true });
    } else {
      alert('Giriş Başarısız! Email veya şifre yanlış.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Girişi 🔒</h2>
        <form onSubmit={handleLogin}>
          <div className="admin-login-form-group">
            <label className="admin-login-label">E-posta</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="admin-login-input"
              placeholder="admin@gmail.com" 
            />
          </div>
          <div className="admin-login-form-group" style={{ marginBottom: '20px' }}>
            <label className="admin-login-label">Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="admin-login-input"
              placeholder="******" 
            />
          </div>
          <button type="submit" className="admin-login-submit">Panele Gir</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;