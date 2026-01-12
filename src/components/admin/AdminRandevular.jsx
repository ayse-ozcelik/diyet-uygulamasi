import React, { useState, useEffect } from 'react';

const AdminRandevular = () => {
  const [randevular, setRandevular] = useState([]);

  useEffect(() => {
    // LocalStorage'dan verileri çek
    const data = JSON.parse(localStorage.getItem('randevular')) || [];
    setRandevular(data);
  }, []);

  // Randevu İptal Etme (Silme) Fonksiyonu
  const handleIptal = (id) => {
    if (window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) {
      const yeniListe = randevular.filter(r => r.id !== id);
      setRandevular(yeniListe);
      localStorage.setItem('randevular', JSON.stringify(yeniListe));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-success">Randevu Yönetimi</h2>
      
      <div className="card shadow-sm">
        <div className="card-body">
          {randevular.length === 0 ? (
            <p className="text-center text-muted">Henüz hiç randevu alınmamış.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Diyetisyen</th>
                    <th>Tarih</th>
                    <th>Saat</th>
                    <th>Kullanıcı</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {randevular.map((randevu) => (
                    <tr key={randevu.id}>
                      <td className="fw-bold">{randevu.diyetisyenIsim}</td>
                      <td>{randevu.tarih}</td>
                      <td><span className="badge bg-info text-dark">{randevu.saat}</span></td>
                      <td>{randevu.kullanici}</td>
                      <td>
                        <span className="badge bg-success">Onaylı</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleIptal(randevu.id)}
                        >
                          İptal Et
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRandevular;