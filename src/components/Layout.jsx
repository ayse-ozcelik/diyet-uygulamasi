import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // --- 1. NAVBAR STİLİ (ÜST MENÜ) ---
    // Buraya yazdığımız kodlar CSS dosyasını beklemez, anında çalışır.
    const navbarStyle = {
        backgroundColor: '#ffffff',     // KESİN BEYAZ
        borderBottom: '1px solid #ddd', // Altına gri çizgi (Yeşille karışmasın diye)
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', // Hafif gölge
        position: 'relative',           // Sayfa akışında dursun
        zIndex: 1000                    // En üstte görünsün
    };

    // --- 2. SIDEBAR STİLİ (SOL MENÜ) ---
    // Burası yeşil kalsın istiyorsan bu renkleri kullanabilirsin
    const sidebarStyle = {
        backgroundColor: '#1b4332', // Koyu Yeşil
        color: '#ffffff',           // Yazılar Beyaz
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? 0 : '-280px', // Açık/Kapalı ayarı
        width: '280px',
        transition: '0.3s',
        zIndex: 1050,
        boxShadow: '5px 0 15px rgba(0,0,0,0.1)',
        paddingTop: '1rem'
    };

    return (
        <div className="dashboard-wrapper" style={{ backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
            
            {/* Sidebar Overlay (Karartma) */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040
                    }}
                ></div>
            )}

            {/* --- NAVBAR --- */}
            <nav className="navbar navbar-expand-lg navbar-light" style={navbarStyle}>
                <div className="container-fluid">
                    <button className="btn btn-link text-dark me-2" onClick={() => setIsSidebarOpen(true)}>
                        <i className="fas fa-bars fa-lg"></i>
                    </button>
                    
                    <Link className="navbar-brand fw-bold text-dark" to="/dashboard" style={{ fontSize: '1.5rem' }}>
                        DIET<span style={{color: '#e76f51'}}>DIARY</span>
                    </Link>
                    
                    <div className="ms-auto">
                        <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={handleLogout}>
                            Çıkış <i className="fas fa-power-off ms-1"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- SIDEBAR --- */}
            <div id="leftSidebar" style={sidebarStyle}>
                <div className="p-3 border-bottom border-secondary">
                    <h5 className="m-0 fw-bold text-white">Menü</h5>
                </div>
                <ul className="list-unstyled mt-3 px-2">
                    {/* Linkler için basit stil */}
                    {[
                        { to: '/dashboard', icon: 'fa-th-large', text: 'Genel Bakış' },
                        { to: '/beslenme', icon: 'fa-utensils', text: 'Beslenme Günlüğü' },
                        { to: '/egzersizler', icon: 'fa-dumbbell', text: 'Egzersizler' },
                        { to: '/tarifler', icon: 'fa-book-open', text: 'Sağlıklı Tarifler' },
                        { to: '/su-takibi', icon: 'fa-tint', text: 'Su Takibi' },
                        { to: '/diyetisyenler', icon: 'fa-user-md', text: 'Diyetisyenler' },
                        { to: '/profil', icon: 'fa-user', text: 'Profilim' }
                    ].map((item, index) => (
                        <li key={index} className="mb-2">
                            <Link 
                                to={item.to} 
                                className="text-decoration-none text-white d-block p-2 rounded"
                                onClick={() => setIsSidebarOpen(false)}
                                style={{ 
                                    backgroundColor: location.pathname === item.to ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    transition: '0.2s'
                                }}
                            >
                                <i className={`fas ${item.icon} me-3`} style={{width: '20px'}}></i>
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- İÇERİK ALANI --- */}
            <div className="main-content-area">
                {children}
            </div>
        </div>
    );
};

export default Layout;