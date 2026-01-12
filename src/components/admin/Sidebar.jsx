import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  // Hızlıca şık görünmesi için basit stiller
  const containerStyle = {
    height: '100%',
    width: '250px',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '4px',
    display: 'block',
    transition: 'background 0.3s'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Panel</h2>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Linkler - İleride oluşturacağımız sayfalara gidecek */}
        <Link to="/admin" style={linkStyle}>📊 Özet (Dashboard)</Link>
        <Link to="/admin/foods" style={linkStyle}>🍎 Besin Yönetimi</Link>
        <Link to="/admin/users" style={linkStyle}>👥 Kullanıcılar</Link>
        
        <hr style={{ width: '100%', margin: '20px 0', borderColor: '#555' }} />
        
        <Link to="/" style={{ ...linkStyle, backgroundColor: '#c0392b' }}>🏠 Çıkış / Siteye Dön</Link>
      </nav>
    </div>
  );
};

export default Sidebar;