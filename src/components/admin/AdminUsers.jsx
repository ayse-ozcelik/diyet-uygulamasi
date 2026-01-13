import React, { useState, useEffect } from 'react';

// ARTIK IMPORT YOK. Sadece LocalStorage var.

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Sadece tarayıcı hafızasındaki (Kayıt olan) kullanıcıları çek
    const localData = JSON.parse(localStorage.getItem('myAppUsers')) || [];
    setUsers(localData);
  }, []);

  const handleDelete = (email) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) {
      const newUsers = users.filter(u => u.email !== email);
      setUsers(newUsers);
      localStorage.setItem('myAppUsers', JSON.stringify(newUsers));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Kullanıcı Yönetimi</h2>
      <div className="alert alert-warning"><small>Not: Sadece uygulamadan 'Kayıt Ol' ile gelen kullanıcılar listelenir.</small></div>
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr><th>İsim</th><th>Email</th><th>Rol</th><th>İşlem</th></tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className="badge bg-primary">user</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.email)}>Sil</button></td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center text-muted">Henüz kayıtlı kullanıcı yok.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;