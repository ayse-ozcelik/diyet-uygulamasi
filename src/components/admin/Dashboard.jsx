import React, { useEffect, useState } from 'react';

const Dashboard = () => {
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
      <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>📊 Admin Kontrol Paneli</h2>
      
      {/* --- ÜST KARTLAR --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={statCardStyle}>
          <h3>👥 {stats.userCount}</h3>
          <span>Kullanıcı</span>
        </div>
        <div style={statCardStyle}>
          <h3>🍎 {stats.foodCount}</h3>
          <span>Besin Çeşidi</span>
        </div>
        
        {/* YENİ: Risk Sayacı Kartı */}
        <div style={{ ...statCardStyle, borderLeft: '5px solid #e74c3c', color: overLimitUsers.length > 0 ? '#c0392b' : '#27ae60' }}>
          <h3>⚠️ {overLimitUsers.length}</h3>
          <span>Limit Aşan (Bugün)</span>
        </div>
      </div>

      {/* --- ⚠️ ALARM BÖLÜMÜ: KALORİ LİMİTİNİ AŞANLAR --- */}
      {overLimitUsers.length > 0 && (
        <div style={{ backgroundColor: '#fff5f5', border: '1px solid #ffcccc', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3 style={{ color: '#c0392b', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
             🚨 Dikkat! Bugün Kalori Sınırını Aşanlar
          </h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {overLimitUsers.map((u, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '4px solid #c0392b' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{u.name}</div>
                <div style={{ fontSize: '20px', color: '#c0392b', fontWeight: 'bold', margin: '5px 0' }}>{u.total} kcal</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                  Sınırı <span style={{ fontWeight: 'bold', color: 'red' }}>{u.excess} kcal</span> aştı!
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- GRAFİKLER (LİDER TABLOSU) --- */}
      <h4 style={{ color: '#7f8c8d', marginBottom: '15px' }}>🏆 Genel Performans Liderleri</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
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
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h4 style={{ color: '#2c3e50', borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '15px' }}>{title}</h4>
      {data.length === 0 || data[0][dataKey] === 0 ? (
        <p style={{ color: '#bdc3c7', fontSize: '14px' }}>Veri yok.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.map((user, index) => (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', color: '#555' }}>
                <span style={{ fontWeight: 'bold' }}>{index + 1}. {user.name}</span>
                <span style={{ fontWeight: 'bold', color: color }}>{user[dataKey]} {unit}</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#ecf0f1', borderRadius: '10px', height: '10px' }}>
                <div style={{ width: `${(user[dataKey] / maxValue) * 100}%`, backgroundColor: color, height: '100%', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const statCardStyle = {
  backgroundColor: 'white',
  padding: '15px 25px',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  color: '#2c3e50',
  minWidth: '150px'
};

export default Dashboard;