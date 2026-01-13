import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/api';
import './Layout.css';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation(); 
    const navigate = useNavigate();

    // Güvenlik: Her sayfa değişiminde ve geri/ileri butonlarında authentication kontrolü
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.email) {
            localStorage.removeItem('currentUser');
            navigate('/', { replace: true });
            return;
        }
    }, [navigate, location]);

    // Geri/ileri butonları için ek kontrol
    useEffect(() => {
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

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/', { replace: true });
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light layout-navbar">
                <div className="container-fluid">
                    <button 
                        type="button"
                        className="btn btn-link text-dark me-2 p-2" 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ fontSize: '1.25rem', zIndex: 1031, position: 'relative' }}
                        aria-label="Menüyü aç/kapat"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    
                    <Link className="navbar-brand fw-bold" to="/dashboard">
                        DIET<span className="navbar-brand-accent">DIARY</span>
                    </Link>
                    
                    <div className="ms-auto">
                        <button 
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold shadow-sm" 
                            onClick={handleLogout}
                            style={{ borderColor: '#e76f51', color: '#e76f51' }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#e76f51';
                                e.target.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#e76f51';
                            }}
                        >
                            Çıkış <i className="fas fa-power-off ms-1"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <div id="leftSidebar" className={`layout-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="m-0 fw-bold">Menü</h5>
                    <button 
                        className="btn btn-link p-0 text-dark" 
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ fontSize: '1.25rem', lineHeight: 1 }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <ul className="list-unstyled mt-3 px-2">
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
                                className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <i className={`fas ${item.icon} me-3 sidebar-link-icon`}></i>
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* İçerik Alanı */}
            <div className="main-content-area">
                {children}
            </div>

            {/* Footer */}
            <footer className="layout-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4 mb-md-0">
                            <h5 className="fw-bold mb-3">
                                <span className="footer-brand-accent">DIET</span>DIARY
                            </h5>
                            <p className="small opacity-75 mb-0">
                                Sağlıklı yaşam yolculuğunuzda yanınızdayız. Beslenme, egzersiz ve sağlık takibinizi kolaylaştıran modern bir platform.
                            </p>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <h6 className="fw-bold mb-3">Hızlı Linkler</h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2">
                                    <Link to="/dashboard" className="footer-link">
                                        <i className="fas fa-chevron-right me-2 footer-link-icon"></i>Genel Bakış
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/beslenme" className="footer-link">
                                        <i className="fas fa-chevron-right me-2 footer-link-icon"></i>Beslenme Günlüğü
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/egzersizler" className="footer-link">
                                        <i className="fas fa-chevron-right me-2 footer-link-icon"></i>Egzersizler
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/profil" className="footer-link">
                                        <i className="fas fa-chevron-right me-2 footer-link-icon"></i>Profilim
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h6 className="fw-bold mb-3">İletişim</h6>
                            <div className="small opacity-75">
                                <p className="mb-2">
                                    <i className="fas fa-envelope me-2"></i>info@dietdiary.com
                                </p>
                                <p className="mb-2">
                                    <i className="fas fa-phone me-2"></i>+90 (212) 123 45 67
                                </p>
                                <div className="d-flex gap-3 mt-3">
                                    <a href="#" className="footer-social-link">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="#" className="footer-social-link">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="footer-social-link">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="footer-divider" />
                    <div className="text-center small opacity-75">
                        <p className="mb-0">
                            © {new Date().getFullYear()} DIETDIARY. Tüm hakları saklıdır. | 
                            <span className="ms-2">Sağlıklı yaşam için tasarlandı 🥗</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;