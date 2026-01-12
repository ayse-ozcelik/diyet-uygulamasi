import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './SuTakibi.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function SuTakibi() {
  const [user] = useState(JSON.parse(localStorage.getItem('currentUser')) || { kilo: 70 });
  const [dailyLogs, setDailyLogs] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(250);

  const userKey = user?.email || "guest";
  const weight = user?.kilo || 70;
  const litreGoal = (weight * 0.033).toFixed(1);
  const glassGoal = Math.ceil((litreGoal * 1000) / 250);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`${userKey}_waterLogs`)) || [];
    setDailyLogs(saved);
  }, [userKey]);

  const today = new Date().toLocaleDateString('en-CA');
  const todaysEntries = dailyLogs.filter(log => log.date === today);
  const todayWater = todaysEntries.filter(l => l.type === 'Su').reduce((a, b) => a + b.value, 0);
  const todayOther = todaysEntries.filter(l => l.type !== 'Su').reduce((a, b) => a + b.value, 0);
  const todayTotal = todayWater + todayOther;

  // Dinamik Arka Plan Rengi
  const getDynamicBackground = () => {
    const progress = Math.min(todayTotal / glassGoal, 1);
    if (progress < 0.2) return '#d1e3f1';
    if (progress < 0.5) return '#b8e1f0';
    if (progress < 0.8) return '#a2dff5';
    return '#80d1ff';
  };

  const handleAdd = (name, ratio, icon) => {
    const glassValue = (selectedAmount / 250) * ratio;
    const newEntry = { id: Date.now(), date: today, type: name, ml: selectedAmount, value: glassValue, icon: icon };
    const updated = [...dailyLogs, newEntry];
    setDailyLogs(updated);
    localStorage.setItem(`${userKey}_waterLogs`, JSON.stringify(updated));
    setShowPanel(false);
  };

  const handleDeleteLast = () => {
    if (dailyLogs.length === 0) return;
    const updated = dailyLogs.slice(0, -1);
    setDailyLogs(updated);
    localStorage.setItem(`${userKey}_waterLogs`, JSON.stringify(updated));
  };

  const handleDeleteDay = (dateToDelete) => {
    if (window.confirm(`${dateToDelete} tarihli tüm veriler silinsin mi?`)) {
      const updated = dailyLogs.filter(log => log.date !== dateToDelete);
      setDailyLogs(updated);
      localStorage.setItem(`${userKey}_waterLogs`, JSON.stringify(updated));
    }
  };

  const remaining = Math.max(0, glassGoal - todayTotal);
  const groupedHistory = dailyLogs.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = { date: curr.date, totalMl: 0 };
    acc[curr.date].totalMl += curr.ml;
    return acc;
  }, {});
  const sortedHistory = Object.values(groupedHistory).sort((a, b) => new Date(b.date) - new Date(a.date));

  const GlassSVG = ({ percent, color, label, isTotal }) => (
    <div className={`glass-item ${isTotal ? 'total-item' : ''}`}>
      <div style={{ position: 'relative', width: isTotal ? '80px' : '65px', height: isTotal ? '110px' : '90px', margin: '0 auto' }}>
        <svg viewBox="0 0 100 120" style={{ width: '100%', height: '100%' }}>
          <path fill="#f1f3f5" d="M10,10 L90,10 L80,110 L20,110 Z" />
          <rect y={120 - (Math.min(percent, 100) * 1.2)} width="100" height="120" fill={color} clipPath="url(#g-mask)" style={{ transition: 'y 0.6s' }} />
          <defs><clipPath id="g-mask"><path d="M10,10 L90,10 L80,110 L20,110 Z" /></clipPath></defs>
          <path fill="none" stroke="#dee2e6" strokeWidth="3" d="M10,10 L90,10 L80,110 L20,110 Z" />
        </svg>
      </div>
      <div className="mt-2 fw-bold text-muted" style={{ fontSize: '0.7rem' }}>{label}</div>
    </div>
  );

  return (
    // DÜZELTİLDİ: paddingTop: '30px' yapıldı.
    // Navbar artık relative olduğu için kendi yerini kaplıyor, 
    // biz sadece estetik bir üst boşluk bırakıyoruz.
    <div className="water-page-wrapper w-100" style={{ 
        minHeight: '100vh', 
        marginTop: '0', 
        paddingTop: '30px', 
        paddingBottom: '40px',
        backgroundColor: getDynamicBackground() 
    }}>
      <div className="container-fluid">
        <h2 className="fw-bold mb-4 text-dark"><i className="fas fa-droplet text-info me-2"></i>Sıvı Takip Analizi</h2>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="section-card shadow-sm p-4 text-center h-100 bg-white" style={{borderRadius: '20px'}}>
              <h6 className="text-muted fw-bold mb-4">Anlık Tüketim Girişi</h6>
              <div className="glass-group">
                <GlassSVG percent={(todayWater / glassGoal) * 100} color="#22b8cf" label="Saf Su" />
                <GlassSVG percent={(todayOther / glassGoal) * 100} color="#f76707" label="Diğer" />
                <GlassSVG percent={(todayTotal / glassGoal) * 100} color="#40c057" label="TOPLAM" isTotal={true} />
              </div>
              <div className="d-flex flex-column align-items-center gap-3 mt-3">
                <div className="litre-select-container">
                  <select className="form-select" value={selectedAmount} onChange={(e) => setSelectedAmount(Number(e.target.value))}>
                    <option value="200">200 ml</option>
                    <option value="250">250 ml (Standart)</option>
                    <option value="330">330 ml</option>
                    <option value="500">500 ml</option>
                  </select>
                </div>
                <div className="d-flex gap-3">
                  <button className="action-btn btn-su shadow-sm" onClick={() => handleAdd('Su', 1, '💧')}>💧 Su Ekle</button>
                  <button className="action-btn btn-diger shadow-sm" onClick={() => setShowPanel(!showPanel)}>Diğer +</button>
                </div>
              </div>
              {showPanel && (
                <div className="mt-3 p-3 bg-light rounded-4 border d-flex flex-wrap justify-content-center gap-2">
                  <button className="btn btn-sm btn-white border px-3" onClick={() => handleAdd('Çay', 0.6, '☕')}>☕ Çay</button>
                  <button className="btn btn-sm btn-white border px-3" onClick={() => handleAdd('Kahve', 0.5, '☕')}>☕ Kahve</button>
                  <button className="btn btn-sm btn-white border px-3" onClick={() => handleAdd('Soda', 0.9, '🥤')}>🥤 Soda</button>
                  <button className="btn btn-sm btn-white border px-3" onClick={() => handleAdd('Ayran', 0.7, '🥛')}>🥛 Ayran</button>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="section-card shadow-sm p-4 h-100 text-center bg-white" style={{borderRadius: '20px'}}>
              <h6 className="text-muted fw-bold mb-4">Günün Dağılımı</h6>
              <div style={{ height: '220px' }}>
                <Doughnut
                  data={{
                    labels: ['Su', 'Diğer', 'Kalan'],
                    datasets: [{ data: [todayWater, todayOther, remaining], backgroundColor: ['#22b8cf', '#f76707', '#e9ecef'], borderWidth: 0 }]
                  }}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
              <div className="mt-4">
                <div className="badge bg-light text-primary p-3 rounded-4 border w-100 shadow-sm">
                  <span className="fs-6 fw-bold">Günlük Hedef: {litreGoal} L / {glassGoal} Bardak</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="section-card shadow-sm p-4 h-100 bg-white" style={{borderRadius: '20px'}}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-muted fw-bold mb-0">Günlük Özet</h6>
                <button className="btn-delete-last shadow-sm" onClick={handleDeleteLast} title="Son tekli girişi geri al">
                  <i className="fas fa-undo"></i>
                </button>
              </div>
              <div className="history-list">
                {sortedHistory.map((item) => (
                  <div key={item.date} className="history-row-item shadow-sm">
                    <span className="fw-bold"><i className="fas fa-calendar-alt text-info me-3"></i>{item.date}</span>
                    <div className="right-side-actions">
                      <span className="litre-pill">{(item.totalMl / 1000).toFixed(2)} L</span>
                      <button className="btn-delete-day" onClick={() => handleDeleteDay(item.date)} title="Tüm günü sil">
                        <i className="fas fa-times-circle"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="row g-4">
              <div className="col-12">
                <div className="section-card shadow-sm p-4 border-start border-info border-5 bg-white" style={{borderRadius: '20px'}}>
                  <h6 className="fw-bold mb-2 text-info"><i className="fas fa-lightbulb me-2"></i>Sağlık İpucu</h6>
                  <p className="small text-secondary mb-0">Su içmek sadece susuzluğu gidermez, odaklanmanı da artırır. Hedefine sadık kal!</p>
                </div>
              </div>
              <div className="col-12">
                <div className="section-card shadow-sm p-4 text-center bg-white" style={{borderRadius: '20px'}}>
                  <h6 className="text-muted fw-bold mb-4 text-start">Başarı Rozetleri</h6>
                  <div className="d-flex justify-content-center gap-4">
                    {[
                      { id: 1, icon: '🛡️', name: 'Savaşçı', condition: todayTotal >= glassGoal, desc: `Hedef olan ${glassGoal} bardağa ulaş.` },
                      { id: 2, icon: '👑', name: 'Kral', condition: todayTotal >= (glassGoal + 2), desc: 'Hedefin 2 bardak üstüne çık.' },
                      { id: 3, icon: '🔥', name: 'Seri', condition: todaysEntries.length > 0, desc: 'Bugün su içmeye başladın!' }
                    ].map(b => (
                      <div key={b.id} className="badge-wrapper">
                        <div style={{ opacity: b.condition ? 1 : 0.2, fontSize: '3rem', transition: '0.3s' }}>{b.icon}</div>
                        <div className="badge-tooltip shadow-lg"><strong>{b.name}</strong><br />{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuTakibi;