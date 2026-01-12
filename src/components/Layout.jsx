import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import './Beslenme.css'; 
=======
import './Beslenme.css'; // Ortak CSS dosyanız
>>>>>>> 9f6058059f5ac7b23911c40f06b68cbda2954e37

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // KREM RENK TEMASI İÇİN ORTAK STİL
    const creamTheme = {
        backgroundColor: '#fdfbf7', // Sıcak, açık krem rengi
        color: '#333' // Koyu yazı rengi
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar Overlay (Mobilde karartma) */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* --- NAVBAR (ÜST KISIM) --- */}
            <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={creamTheme}>
                <div className="container-fluid">
                    <button className="btn btn-link text-dark me-2" onClick={() => setIsSidebarOpen(true)}>
                        <i className="fas fa-bars fa-lg"></i>
                    </button>
                    
                    {/* LOGO: DIET (Koyu) + DIARY (Turuncu) */}
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

            {/* --- SIDEBAR (SOL MENÜ) --- */}
            <div id="leftSidebar" className={isSidebarOpen ? 'active' : ''} 
                style={{
                    ...creamTheme, 
                    borderRight: '1px solid #e0e0e0' // Menüyü içerikten ayıran ince çizgi
                }}
            >
                {/* Menü Başlığı */}
                <div className="sidebar-header p-3" style={{...creamTheme, borderBottom: '1px solid #e0e0e0'}}>
                    <h5 className="m-0 fw-bold" style={{color: '#1b4332'}}>Menü</h5>
                </div>
                
                {/* Linkler */}
                <ul className="list-unstyled mt-2">
                    <li>
                        <Link to="/dashboard" className={`text-dark ${isActive('/dashboard')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-th-large me-2"></i>Genel Bakış
                        </Link>
                    </li>
                    <li>
                        <Link to="/beslenme" className={`text-dark ${isActive('/beslenme')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-utensils me-2"></i>Beslenme Günlüğü
                        </Link>
                    </li>
                    <li>
                        <Link to="/egzersizler" className={`text-dark ${isActive('/egzersizler')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-dumbbell me-2"></i>Egzersizler
                        </Link>
                    </li>

                     <li>
                        <Link to="/tarifler" className={`text-dark ${isActive('/tarifler')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-book-open me-2"></i>Sağlıklı Tarifler
                        </Link>
                    </li>
                    
                    <li>
                        <Link to="/su-takibi" className={`text-dark ${isActive('/su-takibi')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-tint me-2"></i>Su Takibi
                        </Link>
                    </li>
                    
                    <li>
                        <Link to="/diyetisyenler" className={`text-dark ${isActive('/diyetisyenler')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-user-md me-2"></i>Diyetisyenler
                        </Link>
                    </li>
                    <li>
                        <Link to="/profil" className={`text-dark ${isActive('/profil')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-user me-2"></i>Profilim
                        </Link>
                    </li>
                </ul>
            </div>

            {/* SAYFA İÇERİĞİ */}
            <div className="main-content-area" style={{paddingTop: '0px'}}>
                {children}
            </div>
        </div>
    );
};

export default Layout;