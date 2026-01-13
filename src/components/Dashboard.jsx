import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getWaterHistory, saveWater, getUserMeals, saveSteps } from '../api/api';
import './Dashboard.css';

// Tarih fonksiyonları
const getToday = (format = 'tr-TR') => {
  return new Date().toLocaleDateString(format);
};

// LocalStorage anahtarları
const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  USER_MEALS: (email) => `${email}_userMeals`,
  STEPS: (email) => `${email}_steps`,
};

// Motivasyon mesajları
const MOTIVATION_QUOTES = [
  "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. 💪",
  "Bugünkü seçimlerin, yarınki seni oluşturur. 🌱",
  "Vücuduna iyi bak, yaşamak zorunda olduğun tek yer orası. ✨",
  "Engeller seni durduramaz, sadece yolunu değiştirir. 🚀",
];

// Dünya mutfağı bilgileri
const WORLD_CUISINE_FACTS = [
  "🇹🇷 TÜRKİYE: Zeytinyağlılar, kalp dostu yağlar ve antioksidan deposudur.",
  "🇯🇵 JAPONYA: Miso çorbası sindirimi kolaylaştırır ve bağışıklığı güçlendirir.",
  "🇮🇹 İTALYA: Gerçek pizza napoletana odun ateşinde sadece 60-90 saniyede pişer.",
  "🇲🇽 MEKSİKA: Avokado, sağlıklı yağlar açısından o kadar zengindir ki 'doğanın tereyağı' denir.",
  "🇬🇷 YUNANİSTAN: Gerçek süzme yoğurt, protein ve probiyotik açısından çok zengindir.",
  "🇮🇳 HİNDİSTAN: Zerdeçal, içerdiği kurkumin sayesinde doğal bir iltihap sökücüdür.",
];

function Dashboard() {
  const navigate = useNavigate();
  // Başlangıç değeri hatasını önlemek için güvenli başlatma
  const [user, setUser] = useState(() => getCurrentUser() || {});
  const [waterCount, setWaterCount] = useState(0);
  const [meals, setMeals] = useState([]);
  const [quote, setQuote] = useState("");
  const [cuisineFact, setCuisineFact] = useState("");
  const [dailySteps, setDailySteps] = useState("0");
  const [currentWeight, setCurrentWeight] = useState("70");

  // Oyun State'leri
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacleX, setObstacleX] = useState(100); 

  const runnerRef = useRef(null);
  const obstacleRef = useRef(null);
  const gameIntervalRef = useRef(null);
  const scoreRef = useRef(0);

  // Zıplama Fonksiyonu
  const handleJump = useCallback(() => {
    if (!gameActive || isJumping) return; 
    setIsJumping(true);
    setTimeout(() => { setIsJumping(false); }, 600);
  }, [gameActive, isJumping]);

  // Güvenlik: Sürekli authentication kontrolü (geri/ileri butonları için)
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      if (!currentUser?.email) { 
        localStorage.removeItem('currentUser');
        navigate('/', { replace: true }); 
        return false;
      }
      return true;
    };

    // İlk kontrol
    if (!checkAuth()) return;

    // Browser history değişikliklerini dinle (geri/ileri butonları)
    const handlePopState = () => {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.email) {
        localStorage.removeItem('currentUser');
        // Giriş sayfasına yönlendir
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Veri Yükleme Effect'i
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser?.email) { 
        return; 
    }
    
    setUser(currentUser);
    setCurrentWeight(currentUser.weight || "70");
    
    const userKey = currentUser.email || "guest";
    const today = getToday('en-CA');
    const todayTr = getToday('tr-TR');
    
    // Su verisi
    const waterHistory = getWaterHistory(userKey);
    setWaterCount(waterHistory[today] || 0);
    
    // Yemek verisi
    const allMeals = getUserMeals(userKey);
    setMeals(allMeals.filter(m => m.date === todayTr));
    
    // Adım verisi
    const savedSteps = localStorage.getItem(STORAGE_KEYS.STEPS(userKey)) || "5,240";
    setDailySteps(savedSteps);

    setQuote(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
    setCuisineFact(WORLD_CUISINE_FACTS[Math.floor(Math.random() * WORLD_CUISINE_FACTS.length)]);

    // Klavye dinleyicisi (Oyun için)
    const handleKeyDown = (e) => { 
        if (e.code === 'Space') { 
            e.preventDefault();
            handleJump(); 
        } 
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [handleJump]);

  // Oyun Döngüsü Temizliği
  useEffect(() => {
    return () => { 
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current); 
    };
  }, []);

  const handleStart = () => {
    setScore(0); 
    scoreRef.current = 0; 
    setObstacleX(100); 
    setGameActive(true); 
    setIsJumping(false);

    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    
    gameIntervalRef.current = setInterval(() => {
      setObstacleX((prevX) => {
        // Oyun hızlandırma mantığı
        let speed = 1.5 + (scoreRef.current / 15);
        let newX = prevX - speed;
        
        // Engel ekran dışına çıktıysa başa al ve puan ver
        if (newX < -10) { 
          scoreRef.current += 1; 
          setScore(scoreRef.current); 
          return 100; 
        }
        return newX;
      });

      // Çarpışma Kontrolü
      const runner = runnerRef.current?.getBoundingClientRect();
      const obs = obstacleRef.current?.getBoundingClientRect();
      
      if (runner && obs) {
        // Basit çarpışma mantığı (margin payları ile)
        const isColliding = 
          runner.right - 20 > obs.left && 
          runner.left + 20 < obs.right && 
          runner.bottom - 10 > obs.top; 
          
        if (isColliding) { 
          setGameActive(false); 
          clearInterval(gameIntervalRef.current); 
          alert(`Oyun Bitti! Skorun: ${scoreRef.current}`); 
          setObstacleX(100); 
        }
      }
    }, 20);
  };

  const addWater = () => {
    const userKey = user?.email || "guest";
    const today = getToday('en-CA');
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    saveWater(userKey, today, newCount);
  };

  const addRecommendation = () => {
    const userKey = user?.email || "guest";
    const todayTr = getToday('tr-TR');
    const newMeal = { 
      id: Date.now(),
      name: "Yeşil Detoks Salatası", 
      food: "Yeşil Detoks Salatası", 
      cal: "210", 
      type: "Öğle Yemeği", 
      date: todayTr 
    };
    
    // Mevcut yemekleri al ve yenisini ekle
    const allMeals = getUserMeals(userKey);
    const updatedMeals = [...allMeals, newMeal];
    
    // LocalStorage güncelle (API fonksiyonu yoksa manuel)
    localStorage.setItem(STORAGE_KEYS.USER_MEALS(userKey), JSON.stringify(updatedMeals));
    
    // State güncelle
    setMeals(updatedMeals.filter(m => m.date === todayTr)); 
    alert("Yeşil Detoks Salatası menüne eklendi! 🥗");
  };

  const updateSteps = () => {
    const newSteps = prompt("Bugünkü adım sayınızı giriniz:", dailySteps);
    if (newSteps !== null && newSteps !== "") { 
      setDailySteps(newSteps); 
      const userKey = user?.email || 'guest';
      // LocalStorage manuel kayıt (API yoksa)
      localStorage.setItem(STORAGE_KEYS.STEPS(userKey), newSteps);
      // Eğer API fonksiyonu varsa: saveSteps(userKey, newSteps);
    }
  };

  const updateWeight = () => {
    const newWeight = prompt("Güncel kilonuzu giriniz (kg):", currentWeight);
    if (newWeight) { 
      setCurrentWeight(newWeight); 
      const updatedUser = { ...user, weight: newWeight }; 
      setUser(updatedUser); 
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser)); 
    }
  };

  const totalCalories = meals.reduce((sum, m) => sum + parseInt(m.cal || 0), 0);

  return (
    <div className="dashboard-wrapper w-100">
      {/* HEADER */}
      <div className="dashboard-header w-100 text-center pb-5 pt-5">
        <div className="container">
          {/* user.name hatasını önlemek için ?. (optional chaining) kullandık */}
          <h1 className="fw-bold display-6 mb-1">Selam, {user?.name?.split(' ')[0] || 'Misafir'}! ✨</h1>
          <p className="mb-3 opacity-75">Bugün sağlığın için neler yaptın?</p>
          <div className="d-flex justify-content-center">
              <div className="motivation-mini-box py-2 px-4 rounded-pill shadow-sm bg-white d-inline-flex align-items-center">
                  <span className="text-dark fw-medium">{quote}</span>
              </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-container">
        {/* STATS */}
        <div className="row g-4">
          <div className="col-md-3">
            <div className="stat-card text-center shadow-sm border-0 p-3 bg-white rounded-4 h-100">
              <div className="stat-icon mx-auto mb-2" style={{ backgroundColor: '#fff5f5', color: '#ff7675', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-fire fa-lg"></i>
              </div>
              <div className="h5 fw-bold mb-0">{totalCalories} kcal</div>
              <div className="text-muted small fw-bold">ALINAN KALORİ</div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="stat-card text-center shadow-sm border-0 p-3 bg-white rounded-4 h-100">
              <div className="stat-icon mx-auto mb-2" style={{ backgroundColor: '#e3f2fd', color: '#2196f3', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-tint fa-lg"></i>
              </div>
              <div className="h4 fw-bold mb-0">{waterCount} / 10</div>
              <div className="text-muted small fw-bold mb-3">SU (BARDAK)</div>
              <button 
                onClick={addWater} 
                className="btn btn-info btn-sm text-white rounded-pill px-4 fw-bold shadow-sm"
              >
                + Su Ekle
              </button>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card text-center shadow-sm border-0 p-3 bg-white rounded-4 h-100" style={{ cursor: 'pointer', transition: '0.3s ease' }} onClick={updateSteps}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="stat-icon mx-auto mb-2" style={{ backgroundColor: '#fffaf0', color: '#ffa502', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-walking fa-lg"></i>
              </div>
              <div className="h5 fw-bold mb-0">{dailySteps}</div>
              <div className="text-muted small fw-bold">GÜNLÜK ADIM</div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="stat-card text-center shadow-sm border-0 p-3 bg-white rounded-4 h-100" style={{ cursor: 'pointer', transition: '0.3s ease' }} onClick={updateWeight}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="stat-icon mx-auto mb-2" style={{ backgroundColor: '#f0fff4', color: '#2ed573', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-weight fa-lg"></i>
              </div>
              <div className="h5 fw-bold mb-0">{currentWeight} kg</div>
              <div className="text-muted small fw-bold">GÜNCEL KİLO</div>
            </div>
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
                            <h5 className="fw-bold mb-0 dashboard-title">Besin Dağılımı</h5>
                        </div>
                        <span className="badge rounded-pill bg-light text-muted fw-normal px-3">Bugün</span>
                    </div>
                    {/* Basit İlerleme Çubuğu */}
                    <div className="progress mb-4" style={{height: '25px', borderRadius: '12px'}}>
                        <div className="progress-bar bg-warning" role="progressbar" style={{width: '40%'}}>KARB</div>
                        <div className="progress-bar bg-danger" role="progressbar" style={{width: '30%'}}>PRO</div>
                        <div className="progress-bar bg-info" role="progressbar" style={{width: '30%'}}>YAĞ</div>
                    </div>
                    <div className="d-flex align-items-center p-3 rounded-4 bg-light">
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
                            <img 
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" 
                                alt="Salata" 
                                style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                            />
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-white text-success shadow-sm rounded-pill px-3">
                                    <i className="fas fa-star me-1"></i> Şefin Seçimi
                                </span>
                            </div>
                        </div>
                        <div className="col-7 p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="fw-bold mb-0">Yeşil Detoks Salatası</h5>
                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">VİTAMİN+</span>
                                </div>
                                <p className="text-muted small mb-3">Vücudunu arındıran enerji deposu.</p>
                                <div className="d-flex gap-3 text-muted small mb-3">
                                    <span><i className="fas fa-fire me-1 text-danger"></i> 210 kcal</span>
                                    <span><i className="fas fa-clock me-1 text-primary"></i> 10 dk</span>
                                </div>
                            </div>
                            <button onClick={addRecommendation} className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm">
                                LİSTEME EKLE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* DÜNYA MUTFAĞINDAN KÜLTÜR KÖŞESİ */}
        <div className="row mt-4 mb-4">
            <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4" style={{backgroundColor: '#fff8e1'}}>
                    <div className="card-body py-4 px-5 text-center"> 
                        <h6 className="fw-bold text-uppercase mb-3 text-warning">
                            <i className="fas fa-globe-americas me-2"></i>Dünya Mutfağından: Biliyor muydunuz?
                        </h6>
                        <div className="mx-auto mb-3" style={{width: '50px', height: '2px', backgroundColor: '#ffd54f'}}></div>
                        <p className="mb-0 fs-5 fw-light fst-italic text-muted">
                            "{cuisineFact}"
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* OYUN */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="p-4 bg-white rounded-4 shadow-sm border" style={{minHeight: '250px'}}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-success mb-0">🏃 Egzersiz Oyunu (Space ile Zıpla)</h5>
                <span className="badge bg-success rounded-pill px-3 py-2">Skor: {score}</span>
              </div>
              
              <div 
                className="game-container position-relative overflow-hidden bg-light rounded-3 border" 
                style={{height: '150px', cursor: 'pointer'}} 
                onClick={handleJump}
              >
                {!gameActive && (
                  <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style={{zIndex: 10, backgroundColor: 'rgba(255,255,255,0.8)'}}>
                    <button className="btn btn-success btn-lg px-5 rounded-pill shadow fw-bold" onClick={(e) => { e.stopPropagation(); handleStart(); }}>
                        OYUNA BAŞLA
                    </button>
                  </div>
                )}
                
                {/* Koşucu */}
                <div 
                    ref={runnerRef} 
                    className="position-absolute"
                    style={{
                        bottom: isJumping ? '80px' : '20px', 
                        left: '50px', 
                        transition: 'bottom 0.3s ease',
                        fontSize: '2rem',
                        color: '#2d3436'
                    }}
                >
                  <i className="fas fa-running"></i>
                </div>

                {/* Engel */}
                <div 
                    ref={obstacleRef} 
                    className="position-absolute bg-danger rounded" 
                    style={{
                        bottom: '20px', 
                        left: `${obstacleX}%`, 
                        width: '30px', 
                        height: '30px'
                    }}
                ></div>
                
                {/* Zemin Çizgisi */}
                <div className="position-absolute bottom-0 w-100 border-bottom border-2 border-dark mb-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;