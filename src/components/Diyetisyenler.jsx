import React, { useState, useEffect } from 'react';
import './Diyetisyenler.css';
import { FaCalendarAlt, FaClock, FaUserMd, FaMapMarkerAlt, FaStar, FaCheckCircle, FaTimes, FaTrashAlt, FaCalendarCheck } from 'react-icons/fa';

const Diyetisyenler = () => {
  const [diyetisyenler] = useState([
    { id: 1, isim: "Dyt. Ayşe Yılmaz", uzmanlik: "Kilo Kontrolü", puan: 4.9, konum: "İstanbul, Kadıköy", foto: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 2, isim: "Dyt. Mehmet Demir", uzmanlik: "Sporcu Beslenmesi", puan: 4.8, konum: "Ankara, Çankaya", foto: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 3, isim: "Dyt. Elif Kaya", uzmanlik: "Diyabet Uzmanı", puan: 5.0, konum: "İzmir, Bornova", foto: "https://randomuser.me/api/portraits/women/68.jpg" },
    { id: 4, isim: "Dyt. Caner Öztürk", uzmanlik: "Çocuk Beslenmesi", puan: 4.7, konum: "Bursa, Nilüfer", foto: "https://randomuser.me/api/portraits/men/85.jpg" }
  ]);

  const saatDilimleri = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const [modalOpen, setModalOpen] = useState(false);
  const [secilenDiyetisyen, setSecilenDiyetisyen] = useState(null);
  const [secilenTarih, setSecilenTarih] = useState('');
  const [alinmisRandevular, setAlinmisRandevular] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const kayitliRandevular = JSON.parse(localStorage.getItem('randevular')) || [];
    setAlinmisRandevular(kayitliRandevular);
  }, []);

  const handleRandevuAc = (diyetisyen) => {
    setSecilenDiyetisyen(diyetisyen);
    setSecilenTarih('');
    setIsSuccess(false);
    setModalOpen(true);
  };

  const handleSaatSecimi = (saat) => {
    if (!secilenTarih) return;

    const yeniRandevu = {
      id: Date.now(),
      kullanici: "Mevcut Kullanıcı",
      diyetisyenId: secilenDiyetisyen.id,
      diyetisyenIsim: secilenDiyetisyen.isim,
      tarih: secilenTarih,
      saat: saat,
      durum: "Onaylandı"
    };

    const guncelListe = [...alinmisRandevular, yeniRandevu];
    setAlinmisRandevular(guncelListe);
    localStorage.setItem('randevular', JSON.stringify(guncelListe));

    setIsSuccess(true);
    
    setTimeout(() => {
      setModalOpen(false);
      setIsSuccess(false);
    }, 2000);
  };

  // YENİ EKLENEN FONKSİYON: İPTAL ETME
  const handleRandevuIptal = (id) => {
    if (window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) {
      const yeniListe = alinmisRandevular.filter((randevu) => randevu.id !== id);
      setAlinmisRandevular(yeniListe);
      localStorage.setItem('randevular', JSON.stringify(yeniListe));
    }
  };

  const isSlotDolu = (saat) => {
    return alinmisRandevular.some(
      r => r.diyetisyenId === secilenDiyetisyen.id && r.tarih === secilenTarih && r.saat === saat
    );
  };

  return (
    <div className="page-container">
      <div className="max-width-wrapper">
        
        {/* Header */}
        <div className="section-header">
          <h2><FaUserMd style={{color: '#16a34a'}} /> Uzman Kadromuz</h2>
          <p>Sağlıklı bir yaşam için doğru adrestesiniz.</p>
        </div>
        
        {/* Modern Grid Yapısı */}
        <div className="dietitian-grid">
          {diyetisyenler.map((diyetisyen) => (
            <div key={diyetisyen.id} className="modern-card">
              <div className="rating-badge">
                <FaStar style={{color: '#f59e0b'}} /> {diyetisyen.puan}
              </div>
              <div className="image-container">
                <img src={diyetisyen.foto} alt={diyetisyen.isim} className="profile-img" />
              </div>
              <h3 className="card-name">{diyetisyen.isim}</h3>
              <div className="card-location">
                <FaMapMarkerAlt /> {diyetisyen.konum}
              </div>
              <div className="specialty-badge">
                {diyetisyen.uzmanlik}
              </div>
              <button 
                className="modern-btn"
                onClick={() => handleRandevuAc(diyetisyen)}
              >
                <FaCalendarAlt /> Randevu Oluştur
              </button>
            </div>
          ))}
        </div>

        {/* --- YENİ EKLENEN KISIM: RANDEVULARIM --- */}
        <div className="appointments-section">
          <h3 className="section-title-small">
            <FaCalendarCheck style={{color: '#16a34a'}} /> Randevularım
          </h3>

          {alinmisRandevular.length === 0 ? (
            <div className="no-appointment">
              <FaCalendarAlt size={40} style={{marginBottom: '10px', opacity: 0.5}} />
              <p>Henüz planlanmış bir randevunuz bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="appointment-list">
              {alinmisRandevular.map((randevu) => (
                <div key={randevu.id} className="appointment-card">
                  <div className="app-info">
                    <h4>{randevu.diyetisyenIsim}</h4>
                    <div className="app-details">
                      <span><FaCalendarAlt /> {randevu.tarih}</span>
                      <span><FaClock /> {randevu.saat}</span>
                    </div>
                  </div>
                  <button 
                    className="cancel-btn" 
                    onClick={() => handleRandevuIptal(randevu.id)}
                  >
                    <FaTrashAlt /> İptal Et
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MODAL (Aynı Yapı) --- */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              {isSuccess ? (
                <div className="success-view">
                  <FaCheckCircle className="success-icon" />
                  <h3>Randevu Oluşturuldu!</h3>
                  <p>Sayın üyemiz, randevunuz başarıyla sisteme kaydedildi.</p>
                </div>
              ) : (
                <>
                  <div className="modal-header">
                    <h3 style={{margin:0}}><FaCalendarAlt /> Randevu Planla</h3>
                    <button className="close-btn" onClick={() => setModalOpen(false)}><FaTimes /></button>
                  </div>
                  
                  <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
                    <img src={secilenDiyetisyen?.foto} alt="thumb" style={{width:'50px', height:'50px', borderRadius:'50%'}}/>
                    <div>
                      <strong>{secilenDiyetisyen?.isim}</strong> <br/>
                      <small style={{color:'#666'}}>{secilenDiyetisyen?.uzmanlik}</small>
                    </div>
                  </div>

                  <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>Tarih Seçiniz:</label>
                    <input 
                      type="date" 
                      style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}}
                      value={secilenTarih} 
                      onChange={(e) => setSecilenTarih(e.target.value)} 
                      min={new Date().toISOString().split("T")[0]} 
                    />
                  </div>

                  {secilenTarih ? (
                    <div>
                      <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}><FaClock /> Müsait Saatler:</label>
                      <div className="saat-grid">
                        {saatDilimleri.map((saat) => (
                          <button 
                            key={saat} 
                            className={`saat-kutusu ${isSlotDolu(saat) ? 'dolu' : 'bos'}`} 
                            disabled={isSlotDolu(saat)} 
                            onClick={() => handleSaatSecimi(saat)}
                          >
                            {saat}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{textAlign:'center', color:'#999', padding:'20px'}}>
                      <FaCalendarAlt size={30} style={{marginBottom:'10px'}}/>
                      <p>Lütfen saatleri görmek için tarih seçiniz.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diyetisyenler;