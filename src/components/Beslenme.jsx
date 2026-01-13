import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getUserMeals, saveMeal, deleteMeal, getFoods } from '../api/api';
import './Beslenme.css';

// Tarih fonksiyonu
const getToday = (format = 'tr-TR') => {
  return new Date().toLocaleDateString(format);
};

const foodLibrary = [
    { id: "yumurta", name: "Haşlanmış Yumurta (1 Adet)", cal: 75, img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500" },
    { id: "tavuk", name: "Izgara Tavuk Göğsü", cal: 165, img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500" },
    { id: "corba", name: "Mercimek Çorbası", cal: 140, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
    { id: "yogurt", name: "Ev Yoğurdu (100g)", cal: 60, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" }
];

function Beslenme() {
    const navigate = useNavigate();
    const [user] = useState(() => getCurrentUser());
    const [meals, setMeals] = useState([]);
    const [formData, setFormData] = useState({ type: 'Kahvaltı', food: '', cal: '' });
    const [adminFoods, setAdminFoods] = useState([]);

    const userKey = user?.email || "guest";

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
        loadData();
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [user, navigate]);

    const loadData = () => {
        const today = getToday('tr-TR');
        const allMeals = getUserMeals(userKey);
        setMeals(allMeals.filter(m => m.date === today));
        setAdminFoods(getFoods());
    };

    const handleSaveMeal = (newMeal) => {
        const today = getToday('tr-TR');
        const mealWithDate = { ...newMeal, date: today };
        saveMeal(userKey, mealWithDate);
        loadData();
    };

    const handleDeleteMeal = (id) => {
        if (window.confirm("Bu öğünü silmek istediğine emin misin?")) {
            deleteMeal(userKey, id);
            loadData();
        }
    };

    const totalCalories = meals.reduce((sum, m) => sum + parseInt(m.cal || 0), 0);
    const allAvailableFoods = [...foodLibrary, ...adminFoods];

    // --- DİNAMİK YEŞİL ARKA PLAN HESAPLAMASI ---
    const calorieLimit = 2000;
    const calorieRatio = Math.min(totalCalories / calorieLimit, 1);
    
    // Açık yeşil/kremden (95% lightness) zengin bir orman yeşiline (85% lightness) geçiş
    // Doygunluğu da kalori arttıkça hafifçe artırıyoruz (saturation)
    const dynamicHue = 150; // Yeşil tonu
    const dynamicSaturation = 10 + (calorieRatio * 20); // %10'dan %30'a
    const dynamicLightness = 97 - (calorieRatio * 12); // %97'den %85'e (Koyulaşma)
    
    const pageBgColor = `hsl(${dynamicHue}, ${dynamicSaturation}%, ${dynamicLightness}%)`;

    return (
        <div className="beslenme-wrapper">
            {/* Üst Kısım: Kalori Kartı */}
            <div className="w-100 mb-5 beslenme-header-card">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8 text-center">
                            <div className="mx-auto mb-3 beslenme-gradient-line"></div>
                            <h5 className="fw-bold text-muted text-uppercase mb-1 beslenme-title">
                                Günlük Kalori Özeti
                            </h5>
                            <div className="d-flex align-items-baseline justify-content-center mb-3">
                                <span className="display-3 fw-bold beslenme-calorie-value">{totalCalories}</span>
                                <span className="ms-2 h3 text-muted fw-light">kcal</span>
                            </div>
                            <div className="px-md-5">
                                <div className="progress beslenme-progress">
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated beslenme-calorie-progress-bar" 
                                        role="progressbar" 
                                        style={{ 
                                            width: `${calorieRatio * 100}%`, 
                                            backgroundColor: calorieRatio > 0.9 ? '#c62828' : '#1b4332'
                                        }}
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-2 text-muted fw-bold beslenme-progress-label">
                                    <span>0 kcal</span>
                                    <span className={calorieRatio > 1 ? 'beslenme-progress-label-danger' : 'beslenme-calorie-value'}>
                                        {calorieRatio > 1 ? 'LİMİT AŞILDI!' : `HEDEF: ${calorieLimit} kcal`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row g-4">
                    {/* Sol: Ekleme Formu */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm p-4 bg-white rounded-4 border-0 h-100">
                            <h5 className="fw-bold mb-4 beslenme-form-title">
                                <i className="fas fa-plus-circle me-2"></i>Yeni Öğün Ekle
                            </h5>
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveMeal(formData); setFormData({...formData, food: '', cal: ''}); }}>
                                <div className="mb-3">
                                    <label className="small fw-bold text-muted mb-1">ÖĞÜN TÜRÜ</label>
                                    <select className="form-select border-0 bg-light rounded-3 shadow-none py-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                        <option>Kahvaltı</option><option>Öğle Yemeği</option><option>Akşam Yemeği</option><option>Ara Öğün</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold text-muted mb-1">BESİN ADI</label>
                                    <input className="form-control border-0 bg-light rounded-3 shadow-none py-2" value={formData.food} onChange={e => setFormData({...formData, food: e.target.value})} placeholder="Örn: Haşlanmış Yumurta" required />
                                </div>
                                <div className="mb-4">
                                    <label className="small fw-bold text-muted mb-1">KALORİ</label>
                                    <input className="form-control border-0 bg-light rounded-3 shadow-none py-2" type="number" value={formData.cal} onChange={e => setFormData({...formData, cal: e.target.value})} placeholder="0" required />
                                </div>
                                <button className="btn btn-save w-100 py-3 fw-bold rounded-pill shadow-sm">ÖĞÜNÜ KAYDET</button>
                            </form>
                        </div>
                    </div>

                    {/* Sağ: Timeline Listesi */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm p-4 bg-white rounded-4 border-0 h-100">
                            <h5 className="fw-bold mb-4 border-bottom pb-2 beslenme-section-title">
                                <i className="fas fa-history me-2"></i>Bugün Ne Yedin?
                            </h5>
                            <div className="meal-timeline ps-3 beslenme-timeline">
                                {meals.length > 0 ? meals.map(m => (
                                    <div key={m.id} className="position-relative mb-3 ps-4">
                                        <div className="position-absolute start-0 translate-middle-x bg-white beslenme-timeline-dot"></div>
                                        <div className="p-3 shadow-sm rounded-4 border-0 d-flex justify-content-between align-items-center beslenme-meal-card">
                                            <div>
                                                <small className="badge rounded-pill mb-1 beslenme-meal-badge">{m.type}</small>
                                                <h6 className="mb-0 fw-bold">{m.food}</h6>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-bold me-3 beslenme-meal-calorie">{m.cal} kcal</span>
                                                <button className="btn btn-sm text-danger opacity-50" onClick={() => handleDeleteMeal(m.id)}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="text-center py-5 text-muted opacity-50">Henüz bir kayıt yok.</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Bölüm: Diyet Puanı ve Bilgi */}
                <div className="row mt-5 g-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm p-4 bg-white rounded-4 border-0 d-flex flex-row align-items-center">
                            <div className="me-4 text-center">
                                <h6 className="small fw-bold text-muted mb-2">DİYET PUANI</h6>
                                <div className="h2 mb-0 fw-bold beslenme-diet-score">75</div>
                            </div>
                            <div className="flex-grow-1">
                                <div className="progress beslenme-diet-progress">
                                    <div className="progress-bar bg-success beslenme-diet-progress-bar"></div>
                                </div>
                                <p className="small mt-2 mb-0 text-muted">Hedeflerine %75 uyumlusun. Harika! 🌿</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm p-4 rounded-4 border-0 beslenme-tip-card">
                            <div className="d-flex align-items-center">
                                <div className="fs-2 me-3">💡</div>
                                <div>
                                    <h6 className="fw-bold mb-1 beslenme-tip-title">Günün İpucu</h6>
                                    <p className="small mb-0 opacity-75">Yeşil çay metabolizmanı hızlandırır, bugün bir fincan denemeye ne dersin?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hızlı Ekleme Kısmı */}
                <div className="row mt-5 mb-5">
                    <div className="col-12"><h5 className="fw-bold mb-4 beslenme-section-title">Hızlı Seçenekler</h5></div>
                    {allAvailableFoods.map((item, index) => (
                        <div key={index} className="col-6 col-md-3 mb-4">
                            <div className="card border-0 shadow-sm h-100 overflow-hidden rounded-4 transition-all hover-up">
                                <img src={item.img || item.image} className="card-img-top beslenme-food-image" alt={item.name} />
                                <div className="p-3 text-center">
                                    <h6 className="small fw-bold text-truncate mb-2">{item.name}</h6>
                                    <button className="btn btn-outline-success btn-sm w-100 rounded-pill fw-bold beslenme-food-btn"
                                            onClick={() => handleSaveMeal({ type: 'Ara Öğün', food: item.name, cal: item.cal || item.calorie })}>
                                        {item.cal || item.calorie} kcal +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Beslenme;