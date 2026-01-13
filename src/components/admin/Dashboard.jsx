import React, { useEffect, useState } from 'react';

// Renk ve stil sabitleri
const COLORS = {
  primary: '#1b4332',
  success: '#43a047',
  danger: '#c62828',
  warning: '#ffa502',
  white: '#ffffff',
  text: '#333333',
  textMuted: '#6b7280',
  dark: '#1b4332',
  light: '#f8f9fa',
};

const BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '20px',
  xl: '28px',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ userCount: 0, foodCount: 0 });
  
  // Liderlik Tabloları
  const [leaders, setLeaders] = useState({ nutrition: [], exercise: [], water: [] });
  
  // ⚠️ YENİ: Limiti Aşan Kullanıcılar Listesi
  const [overLimitUsers, setOverLimitUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('myAppUsers')) || [];
    const foods = JSON.parse(localStorage.getItem('myAppFoods')) || [];
    setStats({ userCount: users.length, foodCount: foods.length });

    const today = new Date().toLocaleDateString('tr-TR'); // Sadece bugünü kontrol edeceğiz
    const limit = 2000;
    const riskyUsers = [];

    // --- TÜM KULLANICILARI ANALİZ ET ---
    const allData = users.map(user => {
      const meals = JSON.parse(localStorage.getItem(`${user.email}_userMeals`)) || [];
      const exercises = JSON.parse(localStorage.getItem(`${user.email}_userExercises`)) || [];
      const water = JSON.parse(localStorage.getItem(`${user.email}_userWater`)) || [];

      // 1. Bugün Yenen Kaloriyi Hesapla
      const todaysMeals = meals.filter(m => m.date === today);
      const todayCalories = todaysMeals.reduce((acc, curr) => acc + Number(curr.cal || curr.calorie || 0), 0);

      // 2. Eğer limit aşıldıysa riskli listesine ekle
      if (todayCalories > limit) {
        riskyUsers.push({
          name: user.name,
          total: todayCalories,
          excess: todayCalories - limit // Ne kadar aştı?
        });
      }

      return {
        name: user.name,
        mealCount: meals.length,
        exerciseCount: exercises.length,
        waterCount: water.length
      };
    });

    setOverLimitUsers(riskyUsers);

    // Liderlik Sıralamaları (Genel Toplam)
    setLeaders({
      nutrition: [...allData].sort((a, b) => b.mealCount - a.mealCount).slice(0, 5),
      exercise: [...allData].sort((a, b) => b.exerciseCount - a.exerciseCount).slice(0, 5),
      water: [...allData].sort((a, b) => b.waterCount - a.waterCount).slice(0, 5),
    });

  }, []);

  return (
    <div>
      <h2 style={{ color: COLORS.dark, marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>📊 Admin Kontrol Paneli</h2>
      
      {/* --- ÜST KARTLAR --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: 'none',
          padding: '1.5rem',
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          height: '100%',
        }}>
          <div style={{
            backgroundColor: '#e8f5e9',
            color: COLORS.primary,
            width: '56px',
            height: '56px',
            borderRadius: BORDER_RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.25rem',
          }}>
            <i className="fas fa-users"></i>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', color: COLORS.text }}>
            {stats.userCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Kullanıcı
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: 'none',
          padding: '1.5rem',
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          height: '100%',
        }}>
          <div style={{
            backgroundColor: '#fffaf0',
            color: COLORS.warning,
            width: '56px',
            height: '56px',
            borderRadius: BORDER_RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.25rem',
          }}>
            <i className="fas fa-apple-alt"></i>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', color: COLORS.text }}>
            {stats.foodCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Besin Çeşidi
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: 'none',
          padding: '1.5rem',
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          height: '100%',
        }}>
          <div style={{
            backgroundColor: overLimitUsers.length > 0 ? '#fff5f5' : '#f0fff4',
            color: overLimitUsers.length > 0 ? COLORS.danger : COLORS.success,
            width: '56px',
            height: '56px',
            borderRadius: BORDER_RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.25rem',
          }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', color: COLORS.text }}>
            {overLimitUsers.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Limit Aşan (Bugün)
          </div>
        </div>
      </div>

      {/* --- ⚠️ ALARM BÖLÜMÜ: KALORİ LİMİTİNİ AŞANLAR --- */}
      {overLimitUsers.length > 0 && (
        <div 
          style={{ 
            backgroundColor: '#fff5f5', 
            border: `1px solid #ffcccc`, 
            marginBottom: '2rem',
            padding: '1.5rem',
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h3 style={{ color: COLORS.danger, display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, marginBottom: '1.5rem' }}>
             🚨 Dikkat! Bugün Kalori Sınırını Aşanlar
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {overLimitUsers.map((u, i) => (
              <div 
                key={i} 
                style={{ 
                  borderLeft: `4px solid ${COLORS.danger}`, 
                  padding: '1rem',
                  backgroundColor: COLORS.white,
                  borderRadius: BORDER_RADIUS.md,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem', color: COLORS.text }}>{u.name}</div>
                <div style={{ fontSize: '1.5rem', color: COLORS.danger, fontWeight: '700', marginBottom: '0.25rem' }}>{u.total} kcal</div>
                <div style={{ fontSize: '0.875rem', color: COLORS.textMuted }}>
                  Sınırı <span style={{ fontWeight: '700', color: COLORS.danger }}>{u.excess} kcal</span> aştı!
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- GRAFİKLER (LİDER TABLOSU) --- */}
      <h4 style={{ color: COLORS.textMuted, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>🏆 Genel Performans Liderleri</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <ChartCard 
          title="🥗 En İyi Beslenenler" 
          data={leaders.nutrition} 
          dataKey="mealCount" 
          color="#2ecc71" 
          icon="🍽️"
          unit="Öğün"
        />

        <ChartCard 
          title="💪 En Çok Spor Yapanlar" 
          data={leaders.exercise} 
          dataKey="exerciseCount" 
          color="#e67e22" 
          icon="🔥"
          unit="Antrenman"
        />

        <ChartCard 
          title="💧 En Çok Su İçenler" 
          data={leaders.water} 
          dataKey="waterCount" 
          color="#3498db" 
          icon="bardak"
          unit="Bardak"
        />

      </div>
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---
const ChartCard = ({ title, data, dataKey, color, icon, unit }) => {
  const maxValue = data.length > 0 ? data[0][dataKey] : 1;
  return (
    <div 
      style={{ 
        padding: '1.5rem',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
    >
      <h4 style={{ color: COLORS.dark, borderBottom: `2px solid ${color}`, paddingBottom: '0.75rem', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>{title}</h4>
      {data.length === 0 || data[0][dataKey] === 0 ? (
        <p style={{ color: COLORS.textMuted, fontSize: '0.875rem' }}>Veri yok.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map((user, index) => (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', color: COLORS.text }}>
                <span style={{ fontWeight: '600' }}>{index + 1}. {user.name}</span>
                <span style={{ fontWeight: '700', color: color }}>{user[dataKey]} {unit}</span>
              </div>
              <div style={{ width: '100%', backgroundColor: COLORS.light, borderRadius: BORDER_RADIUS.md, height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(user[dataKey] / maxValue) * 100}%`, backgroundColor: color, height: '100%', borderRadius: BORDER_RADIUS.md, transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;