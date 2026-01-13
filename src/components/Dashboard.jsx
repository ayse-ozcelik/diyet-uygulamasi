import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- StatCard Bileşeni ---
function StatCard({ icon, value, label, color, bg, isEditable, onClick }) {
    return (
      <div 
        className={`stat-card text-center shadow-sm border-0 p-3 bg-white rounded-4 h-100 position-relative ${isEditable ? 'cursor-pointer' : ''}`} 
        onClick={onClick}
        style={{ cursor: isEditable ? 'pointer' : 'default' }}
      >
        {isEditable && (
          <div className="position-absolute top-0 end-0 m-2 text-muted small opacity-50">
            <i className="fas fa-pen" style={{ fontSize: '0.7rem' }}></i>
          </div>
        )}
        <div className="stat-icon mx-auto mb-2" style={{ backgroundColor: bg, color: color, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={`fas fa-${icon} fa-lg`}></i>
        </div>
        <div className="h5 fw-bold mb-0">{value}</div>
        <div className="text-muted small fw-bold">{label}</div>
      </div>
    );
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || {});
  const [waterCount, setWaterCount] = useState(0);
  const [meals, setMeals] = useState([]);
  const [quote, setQuote] = useState("");
  
  // --- Dünya Mutfağı Verileri ve State'i ---
 const worldCuisineFacts = [
    "🇹🇷 TÜRKİYE'nin dünya çapında meşhur zeytinyağlıları, Akdeniz diyetinin en sağlıklı örneklerindendir ve kalp dostu yağlar ile antioksidanlar açısından zengindir.",
    "Japonya'da Miso çorbası, sadece bir yemek değil; sindirimi kolaylaştırdığı ve bağışıklığı güçlendirdiği için hemen hemen her öğünde tüketilen bir şifa kaynağıdır.",
    "İtalya'da gerçek bir pizza napoletana, yüksek proteinli özel unlarla hazırlanır ve odun ateşinde sadece 60-90 saniye arasında pişirilir.",
    "Meksika mutfağının temel taşı olan Avokado, sağlıklı yağlar açısından o kadar zengindir ki 'doğanın tereyağı' olarak adlandırılır.",
    "Yunanistan'da gerçek süzme yoğurt, probiyotik açısından market yoğurtlarından çok daha zengindir ve metabolizmayı hızlandırmaya yardımcı olur.",
    "Hindistan'da kullanılan Zerdeçal, içerdiği kurkumin sayesinde doğal bir iltihap sökücü olarak binlerce yıldır tıp alanında da kullanılır."
  ];
  const [cuisineFact, setCuisineFact] = useState("");

  const [dailySteps, setDailySteps] = useState(localStorage.getItem(`${user.email || 'guest'}_steps`) || "5,240");
  const [currentWeight, setCurrentWeight] = useState(user.weight || "70");

  // Oyun State'leri
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacleX, setObstacleX] = useState(100); 

  const runnerRef = useRef(null);
  const obstacleRef = useRef(null);
  const gameIntervalRef = useRef(null);
  const scoreRef = useRef(0);

  const motivationQuotes = [
    "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. 💪",
    "Bugünkü seçimlerin, yarınki seni oluşturur. 🌱",
    "Vücuduna iyi bak, yaşamak zorunda olduğun tek yer orası. ✨",
    "Engeller seni durduramaz, sadece yolunu değiştirir. 🚀",
  ];

  const handleJump = useCallback(() => {
    if (!gameActive || isJumping) return; 
    setIsJumping(true);
    setTimeout(() => { setIsJumping(false); }, 600);
  }, [gameActive, isJumping]);

  useEffect(() => {
    if (!user.email && !localStorage.getItem('currentUser')) { 
        navigate('/'); 
        return; 
    }
    loadData();
    setQuote(motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]);
    
    // Rastgele Dünya Mutfağı Bilgisi Seç
    setCuisineFact(worldCuisineFacts[Math.floor(Math.random() * worldCuisineFacts.length)]);

    const handleKeyDown = (e) => { 
        if (e.code === 'Space') { 
            e.preventDefault(); 
            handleJump(); 
        } 
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [handleJump, user.email, navigate]);

  useEffect(() => {
    return () => { if (gameIntervalRef.current) clearInterval(gameIntervalRef.current); };
  }, []);

  const loadData = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const userKey = user.email || "guest";
    const waterHistory = JSON.parse(localStorage.getItem(`${userKey}_waterHistory`)) || {};
    setWaterCount(waterHistory[today] || 0);
    const allMeals = JSON.parse(localStorage.getItem(`${userKey}_userMeals`)) || [];
    const todayTr = new Date().toLocaleDateString('tr-TR');
    setMeals(allMeals.filter(m => m.date === todayTr));
  };

  const handleStart = () => {
    setScore(0); scoreRef.current = 0; setObstacleX(100); setGameActive(true); setIsJumping(false);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    gameIntervalRef.current = setInterval(() => {
      setObstacleX((prevX) => {
        let speed = 1.5 + (scoreRef.current / 15);
        let newX = prevX - speed;
        if (newX < -10) { scoreRef.current += 1; setScore(scoreRef.current); return 100; }
        return newX;
      });
      const runner = runnerRef.current?.getBoundingClientRect();
      const obs = obstacleRef.current?.getBoundingClientRect();
      if (runner && obs) {
        const isColliding = runner.right - 25 > obs.left && runner.left + 25 < obs.right && runner.bottom - 10 > obs.top; 
        if (isColliding) { setGameActive(false); clearInterval(gameIntervalRef.current); alert(`Oyun Bitti! Skorun: ${scoreRef.current}`); setObstacleX(100); }
      }
    }, 20);
  };

  const addWater = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const userKey = user.email || "guest";
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    const waterHistory = JSON.parse(localStorage.getItem(`${userKey}_waterHistory`)) || {};
    waterHistory[today] = newCount;
    localStorage.setItem(`${userKey}_waterHistory`, JSON.stringify(waterHistory));
  };

  const addRecommendation = () => {
    const userKey = user.email || "guest";
    const todayTr = new Date().toLocaleDateString('tr-TR');
    const newMeal = { id: Date.now(), name: "Yeşil Detoks Salatası", food: "Yeşil Detoks Salatası", cal: "210", type: "Öğle Yemeği", date: todayTr };
    const allMeals = JSON.parse(localStorage.getItem(`${userKey}_userMeals`)) || [];
    const updatedMeals = [...allMeals, newMeal];
    localStorage.setItem(`${userKey}_userMeals`, JSON.stringify(updatedMeals));
    setMeals(updatedMeals.filter(m => m.date === todayTr)); 
    alert("Yeşil Detoks Salatası menüne eklendi! 🥗");
  };

  const updateSteps = () => {
    const newSteps = prompt("Bugünkü adım sayınızı giriniz:", dailySteps);
    if (newSteps) { setDailySteps(newSteps); localStorage.setItem(`${user.email || 'guest'}_steps`, newSteps); }
  };

  const updateWeight = () => {
    const newWeight = prompt("Güncel kilonuzu giriniz (kg):", currentWeight);
    if (newWeight) { 
        setCurrentWeight(newWeight); 
        const updatedUser = { ...user, weight: newWeight }; 
        setUser(updatedUser); 
        localStorage.setItem('currentUser', JSON.stringify(updatedUser)); 
    }
  };

  const totalCalories = meals.reduce((sum, m) => sum + parseInt(m.cal || 0), 0);

  return (
    <div className="dashboard-wrapper w-100" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', marginTop: '-20px' }}>
      
      {/* HEADER */}
      <div className="dashboard-header w-100 text-center pb-5 pt-5" style={{ backgroundColor: '#1b4332', color: 'white', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <div className="container">
          <h1 className="fw-bold display-6 mb-1">Selam, {user.name?.split(' ')[0] || 'Misafir'}! ✨</h1>
          <p className="mb-3 opacity-75">Bugün sağlığın için neler yaptın?</p>
          <div className="d-flex justify-content-center">
              <div className="motivation-mini-box py-2 px-4 rounded-pill shadow-sm bg-white d-inline-flex align-items-center">
                  <span className="text-dark fw-medium" style={{ fontSize: '0.9rem' }}>{quote}</span>
              </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px' }}>
        {/* STATS */}
        <div className="row g-4">
          <div className="col-md-3">
              <StatCard icon="fire" value={`${totalCalories} kcal`} label="ALINAN KALORİ" color="#ff7675" bg="#fff5f5" />
          </div>
          
          <div className="col-md-3">
            <div className="stat-card text-center shadow-sm border-0 h-100 p-3 bg-white rounded-4">
              <div className="stat-icon mx-auto mb-2" style={{ backgroundColor: '#e3f2fd', color: '#2196f3', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-tint fa-lg"></i>
              </div>
              <div className="h4 fw-bold mb-0">{waterCount} / 10</div>
              <div className="text-muted small fw-bold">SU (BARDAK)</div>
              <button onClick={addWater} className="btn btn-info btn-sm text-white mt-3 rounded-pill px-4 fw-bold">+ Ekle</button>
            </div>
          </div>

          <div className="col-md-3">
              <StatCard icon="walking" value={dailySteps} label="GÜNLÜK ADIM" color="#ffa502" bg="#fffaf0" isEditable={true} onClick={updateSteps} />
          </div>
          
          <div className="col-md-3">
              <StatCard icon="weight" value={`${currentWeight} kg`} label="GÜNCEL KİLO" color="#2ed573" bg="#f0fff4" isEditable={true} onClick={updateWeight} />
          </div>
        </div>

        {/* ÖNERİLER VE GRAFİK */}
        <div className="row mt-4 g-4 mb-4">
            <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3">
                                <i className="fas fa-chart-pie text-success"></i>
                            </div>
                            <h5 className="fw-bold mb-0" style={{ color: '#1b4332' }}>Besin Dağılımı</h5>
                        </div>
                        <span className="badge rounded-pill bg-light text-muted fw-normal px-3">Bugün</span>
                    </div>
                    <div className="progress mb-4" style={{ height: '35px', borderRadius: '12px', backgroundColor: '#f0f2f5', overflow: 'hidden' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: '40%', backgroundColor: '#ffa502', fontWeight: '600', fontSize: '0.75rem' }}>KARB</div>
                        <div className="progress-bar" role="progressbar" style={{ width: '30%', backgroundColor: '#ff7675', fontWeight: '600', fontSize: '0.75rem' }}>PRO</div>
                        <div className="progress-bar" role="progressbar" style={{ width: '30%', backgroundColor: '#2196f3', fontWeight: '600', fontSize: '0.75rem' }}>YAĞ</div>
                    </div>
                    <div className="d-flex align-items-center p-3 rounded-4" style={{ backgroundColor: '#f8fdfb', border: '1px dashed #c3e6cb' }}>
                        <i className="fas fa-lightbulb text-warning me-3 fa-lg"></i>
                        <p className="text-muted small mb-0">
                            <strong className="text-dark">Beslenme İpucu:</strong> Günlük makro hedeflerine yakınsın. Protein alımını biraz artırarak kas kütleni koruyabilirsin.
                        </p>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden">
                    <div className="row g-0 h-100">
                        <div className="col-5 position-relative">
                            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" alt="Salata" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '200px' }} />
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-white text-success shadow-sm rounded-pill px-3"><i className="fas fa-star me-1"></i> Şefin Seçimi</span>
                            </div>
                        </div>
                        <div className="col-7 p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="fw-bold mb-0" style={{ color: '#1b4332' }}>Yeşil Detoks Salatası</h5>
                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1" style={{fontSize: '0.65rem'}}>VİTAMİN+</span>
                                </div>
                                <p className="text-muted small mb-3">Vücudunu arındıran enerji deposu.</p>
                                <div className="d-flex gap-3 text-muted small mb-3">
                                    <span><i className="fas fa-fire me-1 text-danger"></i> 210 kcal</span>
                                    <span><i className="fas fa-clock me-1 text-primary"></i> 10 dk</span>
                                </div>
                            </div>
                            <button onClick={addRecommendation} className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm" style={{ backgroundColor: '#1b4332', border: 'none' }}>LİSTEME EKLE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* DÜNYA MUTFAĞINDAN KÜLTÜR KÖŞESİ - GÜNCELLENMİŞ VE KISALTILMIŞ */}
        <div className="row mt-4 mb-4">
            <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4" 
                     style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', color: 'white' }}>
                    <div className="card-body py-4 px-5 text-center"> 
                        <h6 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px', opacity: 0.7, fontSize: '0.75rem' }}>
                            <i className="fas fa-globe-americas me-2"></i>Dünya Mutfağından: Biliyor muydunuz?
                        </h6>
                        <div className="mx-auto mb-3" style={{ width: '40px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                        <p className="mb-0 fs-5 fw-light italic" style={{ lineHeight: '1.6', fontStyle: 'italic', opacity: 0.9 }}>
                            "{cuisineFact}"
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* OYUN */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="game-card-minimal p-4 bg-white rounded-4 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-success mb-0">🏃 Egzersiz Oyunu (Space ile Zıpla)</h5>
                <span className="badge bg-success rounded-pill px-3 py-2">Skor: {score}</span>
              </div>
              <div id="game-container" onClick={handleJump} style={{ height: '160px', position: 'relative', background: '#f0fff4', borderRadius: '15px', overflow: 'hidden', borderBottom: '4px solid #2d6a4f', cursor: 'pointer' }}>
                {!gameActive && (
                  <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 30, background: 'rgba(240, 255, 244, 0.8)' }}>
                    <button className="btn btn-success btn-md px-5 rounded-pill shadow fw-bold" onClick={(e) => { e.stopPropagation(); handleStart(); }}>OYUNA BAŞLA</button>
                  </div>
                )}
                <div ref={runnerRef} style={{ position: 'absolute', left: '50px', bottom: isJumping ? '80px' : '10px', fontSize: '2.2rem', transition: isJumping ? 'bottom 0.3s ease-out' : 'bottom 0.3s ease-in', zIndex: 5 }}>
                  <i className="fas fa-running" style={{ color: '#2d6a4f' }}></i>
                </div>
                <div id="obstacle" ref={obstacleRef} style={{ position: 'absolute', left: `${obstacleX}%`, bottom: '10px', width: '25px', height: '35px', backgroundColor: '#e74c3c', borderRadius: '5px', zIndex: 5 }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;