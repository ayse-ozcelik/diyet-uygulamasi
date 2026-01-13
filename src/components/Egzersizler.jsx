import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import confetti from 'canvas-confetti';
import { getCurrentUser, getExerciseHistory, saveExercise, deleteExercise } from '../api/api';
import './Egzersizler.css';

// Tarih fonksiyonları
const getToday = (format = 'tr-TR') => {
  return new Date().toLocaleDateString(format);
};

const getPastDays = (days = 28, format = 'en-CA') => {
  const dates = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString(format));
  }
  return dates;
};

// Egzersiz türleri ve MET değerleri
const EXERCISE_TYPES = {
  'Yürüyüş': { met: 3.5, color: '#2ecc71', icon: 'fa-walking' },
  'Koşu': { met: 7, color: '#e76f51', icon: 'fa-running' },
  'Yüzme': { met: 6, color: '#3498db', icon: 'fa-swimmer' },
  'Kardiyo': { met: 8, color: '#e84393', icon: 'fa-heartbeat' },
  'Bisiklet': { met: 5.5, color: '#f1c40f', icon: 'fa-bicycle' },
  'Fitness': { met: 6, color: '#9b59b2', icon: 'fa-dumbbell' },
};

ChartJS.register(ArcElement, Tooltip, Legend);

function Egzersizler() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const saved = getCurrentUser();
    return saved && saved.weight ? saved : { weight: 70, height: 170, name: 'Misafir' };
  });
  
  const [exerciseData, setExerciseData] = useState([]);
  const [formData, setFormData] = useState({ type: 'Yürüyüş', duration: '' });

  const dailyTarget = 1000;
  const timeTarget = 180;
  const userKey = user?.email || "guest";
  const today = getToday('en-CA');

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.email) { 
        localStorage.removeItem('currentUser');
        navigate('/', { replace: true }); 
        return false;
      }
      return true;
    };

    if (!checkAuth()) return;

    // Browser history değişikliklerini dinle
    const handlePopState = () => {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.email) {
        localStorage.removeItem('currentUser');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    const savedData = getExerciseHistory(userKey);
    setExerciseData(savedData);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, userKey]);

  const getColor = (type) => EXERCISE_TYPES[type]?.color || '#2ecc71';
  const getIcon = (type) => EXERCISE_TYPES[type]?.icon || 'fa-walking';
  const getMET = (type) => EXERCISE_TYPES[type]?.met || 3;

  const heatmapData = useMemo(() => {
    const dates = getPastDays(27, 'en-CA');
    return dates.map(dateStr => {
      const dayCalories = exerciseData
        .filter(ex => ex.date === dateStr)
        .reduce((sum, curr) => sum + Math.round(getMET(curr.type) * user.weight * (curr.duration / 60)), 0);
      return { date: dateStr, calories: dayCalories };
    });
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
    acc[curr.type].calories += Math.round(getMET(curr.type) * user.weight * (curr.duration / 60));
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
    const newEx = { ...formData, duration: parseInt(formData.duration), date: today };
    const saved = saveExercise(userKey, newEx);
    setExerciseData([...exerciseData, saved]);
    setFormData({ ...formData, duration: '' });
  };

  const handleUndo = type => {
    const list = exerciseData.filter(ex => ex.type === type && ex.date === today);
    if (list.length) {
      const lastId = list[list.length - 1].id;
      deleteExercise(userKey, lastId);
      setExerciseData(exerciseData.filter(ex => ex.id !== lastId));
    }
  };

  const handleDeleteRow = type => {
    const toDelete = exerciseData.filter(ex => ex.type === type && ex.date === today);
    toDelete.forEach(ex => deleteExercise(userKey, ex.id));
    setExerciseData(exerciseData.filter(ex => !(ex.type === type && ex.date === today)));
  };

  const bmi = user.weight && user.height ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : '0';
  const bmiStatus = parseFloat(bmi) < 18.5 ? 'Zayıf' : parseFloat(bmi) < 25 ? 'Normal' : parseFloat(bmi) < 30 ? 'Fazla Kilolu' : 'Obez';
  const bmiClass = parseFloat(bmi) < 18.5 ? 'vki-zayif' : parseFloat(bmi) < 25 ? 'vki-normal' : parseFloat(bmi) < 30 ? 'vki-fazla' : 'vki-obez';

  // BURADAKİ <Layout> ETİKETLERİNİ KALDIRDIK
  return (
      <div className="container exercise-page">
        
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
            <div className="section-card shadow-sm h-100 bg-white p-4 exercise-section-card">
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
                <button type="submit" className="btn w-100 p-3 fw-bold shadow-sm exercise-btn-submit">KAYDET</button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="section-card shadow-sm h-100 bg-white p-4 exercise-section-card">
              <h5 className="fw-bold mb-4">Bugünkü Aktiviteler</h5>
              {Object.values(aggregated).length > 0 ? Object.values(aggregated).map((ex, i) => {
                const perc = Math.min((ex.calories / dailyTarget) * 100, 100);
                return (
                  <div key={i} className="activity-item-custom mb-3 shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <div className="p-2 rounded-3 me-3 exercise-activity-icon" style={{ '--activity-color': ex.color, backgroundColor: `${ex.color}15`, color: ex.color }}>
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
                        <span className="fw-bold ms-2 exercise-activity-percent" style={{ '--activity-color': ex.color, color: ex.color }}>%{Math.round(perc)}</span>
                      </div>
                    </div>
                    <div className="progress exercise-progress">
                      <div className="progress-bar" style={{ '--progress-width': `${perc}%`, '--progress-color': ex.color, width: `${perc}%`, backgroundColor: ex.color }}></div>
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
                    style={{ '--heatmap-color': getHeatmapColor(day.calories), backgroundColor: getHeatmapColor(day.calories) }}
                    title={`${day.date}: ${day.calories} kcal`}
                  />
                ))}
              </div>
              <div className="mt-3 d-flex justify-content-center align-items-center gap-2 small text-muted">
                <span>Az</span>
                <div className="heatmap-day heatmap-day-legend heatmap-day-legend-0"></div>
                <div className="heatmap-day heatmap-day-legend heatmap-day-legend-1"></div>
                <div className="heatmap-day heatmap-day-legend heatmap-day-legend-2"></div>
                <div className="heatmap-day heatmap-day-legend heatmap-day-legend-3"></div>
                <div className="heatmap-day heatmap-day-legend heatmap-day-legend-4"></div>
                <span>Çok</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Egzersizler;