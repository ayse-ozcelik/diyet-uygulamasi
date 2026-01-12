import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);

  // Sayfa açılınca localStorage'dan verileri çek
  useEffect(() => {
    // Auth.jsx'te kullanıcıları 'myAppUsers' adıyla kaydetmiştik
    const storedUsers = JSON.parse(localStorage.getItem('myAppUsers')) || [];
    setUsers(storedUsers);
  }, []);

  // Kullanıcı Silme Fonksiyonu
  const handleDelete = (email) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğine emin misin?')) {
      // Silinmek istenen dışındakileri filtrele
      const updatedUsers = users.filter(user => user.email !== email);
      // State'i güncelle (ekrandan silinsin)
      setUsers(updatedUsers);
      // LocalStorage'ı güncelle (hafızadan silinsin)
      localStorage.setItem('myAppUsers', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>👥 Kayıtlı Kullanıcılar</h2>
      
      {users.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
          Henüz kayıtlı kullanıcı yok.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px' }}>Ad Soyad</th>
                <th style={{ padding: '15px' }}>E-posta</th>
                <th style={{ padding: '15px' }}>Şifre</th>
                <th style={{ padding: '15px' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{user.name}</td>
                  <td style={{ padding: '15px' }}>{user.email}</td>
                  <td style={{ padding: '15px', fontFamily: 'monospace' }}>{user.password}</td>
                  <td style={{ padding: '15px' }}>
                    <button 
                      onClick={() => handleDelete(user.email)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;