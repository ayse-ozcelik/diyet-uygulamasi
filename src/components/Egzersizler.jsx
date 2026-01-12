import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
// DİKKAT: Buradan Layout importunu kaldırdık çünkü App.js zaten sarmalıyor.
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import confetti from 'canvas-confetti';
import './Egzersizler.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Egzersizler() {
  const navigate = useNavigate();
  // NaN hatası almamak için güvenli user verisi
  const [user] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('currentUser'));
    return saved && saved.weight ? saved : { weight: 70, height: 170, name: 'Misafir' };
  });
  
  const [exerciseData, setExerciseData] = useState([]);
  const [formData, setFormData] = useState({ type: 'Yürüyüş', duration: '' });

  const dailyTarget = 1000;
  const timeTarget = 180;
  const userKey = user?.email || "guest";
  const exerciseStorageKey = `${userKey}_exerciseHistory`;
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) { navigate('/'); return; }
    const savedData = JSON.parse(localStorage.getItem(exerciseStorageKey)) || [];
    setExerciseData(savedData);
  }, [navigate, exerciseStorageKey]);

  const MET = { 'Yürüyüş': 3.5, 'Koşu': 7, 'Yüzme': 6, 'Kardiyo': 8, 'Bisiklet': 5.5, 'Fitness': 6 };
  const getColor = (type) => ({ 'Yürüyüş': '#2ecc71', 'Koşu': '#e76f51', 'Yüzme': '#3498db', 'Kardiyo': '#e84393', 'Bisiklet': '#f1c40f', 'Fitness': '#9b59b2' })[type];
  const getIcon = (type) => ({ 'Yürüyüş': 'fa-walking', 'Koşu': 'fa-running', 'Yüzme': 'fa-swimmer', 'Kardiyo': 'fa-heartbeat', 'Bisiklet': 'fa-bicycle', 'Fitness': 'fa-dumbbell' })[type];

  const heatmapData = useMemo(() => {
    const data = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      const dayCalories = exerciseData
        .filter(ex => ex.date === dateStr)
        .reduce((sum, curr) => sum + Math.round((MET[curr.type] || 3) * user.weight * (curr.duration / 60)), 0);
      data.push({ date: dateStr, calories: dayCalories });
    }
    return data;
  }, [exerciseData, user.weight]);

  const getHeatmapColor = (cals) => {
    if (cals === 0) return '#f1f5f9';
    if (cals < 300) return '#bbf7d0';
    if (cals < 700) return '#4ade80';
    if (cals < 1000) return '#16a34a';
    return '#15803d';
  };

  const todaysExercises = exerciseData.filter(ex => ex.date === today);
  const aggregated = todaysExercises.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = { type: curr.type, calories: 0, duration: 0, color: getColor(curr.type) };
    acc[curr.type].calories += Math.round((MET[curr.type] || 3) * user.weight * (curr.duration / 60));
    acc[curr.type].duration += parseInt(curr.duration);
    return acc;
  }, {});

  const totalCals = Object.values(aggregated).reduce((a, b) => a + b.calories, 0);
  const totalMins = Object.values(aggregated).reduce((a, b) => a + b.duration, 0);

  useEffect(() => {
    if (totalCals >= dailyTarget) {
      const lastCelebrate = localStorage.getItem(`celebrate_${today}`);
      if (lastCelebrate !== 'true') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e76f51', '#2ecc71', '#3498db']
        });
        localStorage.setItem(`celebrate_${today}`, 'true');
      }
    }
  }, [totalCals, today]);

  const calorieChartData = {
    labels: Object.keys(aggregated),
    datasets: [{
      data: [...Object.values(aggregated).map(a => a.calories), Math.max(0, dailyTarget - totalCals)],
      backgroundColor: [...Object.values(aggregated).map(a => a.color), '#f1f5f9'],
      cutout: '80%', borderRadius: 10
    }]
  };

  const timeChartData = {
    datasets: [{ data: [totalMins, Math.max(0, timeTarget - totalMins)], backgroundColor: ['#6366f1', '#f1f5f9'], cutout: '80%', borderRadius: 10 }]
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.duration) return;
    const newEx = { ...formData, duration: parseInt(formData.duration), date: today, id: Date.now() };
    const updated = [...exerciseData, newEx];
    setExerciseData(updated);
    localStorage.setItem(exerciseStorageKey, JSON.stringify(updated));
    setFormData({ ...formData, duration: '' });
  };

  const handleUndo = type => {
    const list = exerciseData.filter(ex => ex.type === type && ex.date === today);
    if (list.length) {
      const lastId = list[list.length - 1].id;
      const updated = exerciseData.filter(ex => ex.id !== lastId);
      setExerciseData(updated);
      localStorage.setItem(exerciseStorageKey, JSON.stringify(updated));
    }
  };

  const handleDeleteRow = type => {
    const updated = exerciseData.filter(ex => !(ex.type === type && ex.date === today));
    setExerciseData(updated);
    localStorage.setItem(exerciseStorageKey, JSON.stringify(updated));
  };

  const bmi = user.weight && user.height ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : '0';
  const bmiStatus = parseFloat(bmi) < 18.5 ? 'Zayıf' : parseFloat(bmi) < 25 ? 'Normal' : parseFloat(bmi) < 30 ? 'Fazla Kilolu' : 'Obez';
  const bmiClass = parseFloat(bmi) < 18.5 ? 'vki-zayif' : parseFloat(bmi) < 25 ? 'vki-normal' : parseFloat(bmi) < 30 ? 'vki-fazla' : 'vki-obez';

  // BURADAKİ <Layout> ETİKETLERİNİ KALDIRDIK
  return (
      <div className="container exercise-page" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        
        {/* İstatistik Kartları */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="stat-card-main shadow-sm">
              <h6 className="fw-bold text-muted mb-3 small">KALORİ DAĞILIMI</h6>
              <div className="chart-wrapper">
                <Doughnut data={calorieChartData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                <div className="chart-inner-text"><span className="small text-muted">YAKILAN</span><strong>{totalCals}</strong></div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card-main shadow-sm">
              <h6 className="fw-bold text-muted mb-3 small">SÜRE İLERLEMESİ</h6>
              <div className="chart-wrapper">
                <Doughnut data={timeChartData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                <div className="chart-inner-text"><strong>{totalMins}</strong><span className="small text-muted">DAKİKA</span></div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card-main shadow-sm">
              <h6 className="fw-bold text-muted mb-2 small">VÜCUT ANALİZİ</h6>
              <p className="small text-muted mb-1">{user.height}cm / {user.weight}kg</p>
              <h2 className="fw-bold mb-1">{bmi}</h2>
              <div className={`vki-badge ${bmiClass}`}>
                {bmiStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Egzersiz Ekleme Formu */}
        <div className="row g-4 mb-5">
          <div className="col-lg-5">
            <div className="section-card shadow-sm h-100 bg-white p-4" style={{ borderRadius: '28px' }}>
              <h5 className="fw-bold mb-4">Egzersiz Ekle</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">TÜR</label>
                  <select className="form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Yürüyüş</option><option>Koşu</option><option>Yüzme</option><option>Kardiyo</option><option>Bisiklet</option><option>Fitness</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="small fw-bold text-muted mb-2">SÜRE (DK)</label>
                  <input type="number" className="form-control" placeholder="30" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
                </div>
                <button type="submit" className="btn w-100 p-3 fw-bold shadow-sm" style={{backgroundColor:'#1b4332', color:'white'}}>KAYDET</button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="section-card shadow-sm h-100 bg-white p-4" style={{ borderRadius: '28px' }}>
              <h5 className="fw-bold mb-4">Bugünkü Aktiviteler</h5>
              {Object.values(aggregated).length > 0 ? Object.values(aggregated).map((ex, i) => {
                const perc = Math.min((ex.calories / dailyTarget) * 100, 100);
                return (
                  <div key={i} className="activity-item-custom mb-3 shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <div className="p-2 rounded-3 me-3" style={{ backgroundColor: `${ex.color}15`, color: ex.color }}>
                          <i className={`fas ${getIcon(ex.type)} fa-lg`}></i>
                        </div>
                        <div>
                          <span className="fw-bold d-block">{ex.type}</span>
                          <small className="text-muted"><i className="far fa-clock me-1"></i>{ex.duration} dk | <i className="fas fa-fire ms-2 me-1"></i>{ex.calories} kcal</small>
                        </div>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <button className="btn-control btn-undo" onClick={() => handleUndo(ex.type)} title="Geri Al"><i className="fas fa-undo"></i></button>
                        <button className="btn-control btn-delete-row" onClick={() => handleDeleteRow(ex.type)} title="Tümünü Sil"><i className="fas fa-trash"></i></button>
                        <span className="fw-bold ms-2" style={{ color: ex.color }}>%{Math.round(perc)}</span>
                      </div>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                      <div className="progress-bar" style={{ width: `${perc}%`, backgroundColor: ex.color }}></div>
                    </div>
                  </div>
                )
              }) : <div className="text-center py-5 text-muted"><i className="fas fa-running fa-3x mb-3 opacity-25"></i><p>Henüz bir aktivite eklenmedi.</p></div>}
            </div>
          </div>
        </div>

        {/* Isı Haritası */}
        <div className="row">
          <div className="col-12">
            <div className="heatmap-card shadow-sm text-center">
              <h5 className="fw-bold mb-4">Aktivite Yoğunluğu (Son 4 Hafta)</h5>
              <div className="heatmap-container">
                {heatmapData.map((day, i) => (
                  <div
                    key={i}
                    className="heatmap-day"
                    style={{ backgroundColor: getHeatmapColor(day.calories) }}
                    title={`${day.date}: ${day.calories} kcal`}
                  />
                ))}
              </div>
              <div className="mt-3 d-flex justify-content-center align-items-center gap-2 small text-muted">
                <span>Az</span>
                <div className="heatmap-day" style={{ backgroundColor: '#f1f5f9', width: '12px', height: '12px' }}></div>
                <div className="heatmap-day" style={{ backgroundColor: '#bbf7d0', width: '12px', height: '12px' }}></div>
                <div className="heatmap-day" style={{ backgroundColor: '#4ade80', width: '12px', height: '12px' }}></div>
                <div className="heatmap-day" style={{ backgroundColor: '#16a34a', width: '12px', height: '12px' }}></div>
                <div className="heatmap-day" style={{ backgroundColor: '#15803d', width: '12px', height: '12px' }}></div>
                <span>Çok</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Egzersizler;