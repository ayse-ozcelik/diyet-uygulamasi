import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      
      navigate('/admin/dashboard');
    } else {
      alert('Giriş Başarısız! Email veya şifre yanlış.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c3e50' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Admin Girişi 🔒</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} placeholder="admin@gmail.com" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} placeholder="******" />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Panele Gir</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;