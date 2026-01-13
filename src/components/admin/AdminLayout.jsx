import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    // Güvenlik: Sürekli admin kontrolü (geri/ileri butonları için)
    useEffect(() => {
        const checkAuth = () => {
            const isAdmin = localStorage.getItem('isAdmin');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!isAdmin || !currentUser || currentUser.role !== 'admin') {
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('currentUser');
                navigate('/admin-login', { replace: true });
                return false;
            }
            return true;
        };

        // İlk kontrol
        if (!checkAuth()) return;

        // Browser history değişikliklerini dinle
        const handlePopState = () => {
            const isAdmin = localStorage.getItem('isAdmin');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!isAdmin || !currentUser || currentUser.role !== 'admin') {
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('currentUser');
                setTimeout(() => {
                    navigate('/admin-login', { replace: true });
                }, 0);
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('currentUser');
        navigate('/', { replace: true });
    };

    return (
        <div className="d-flex flex-column admin-wrapper">
            <div className="d-flex flex-grow-1">
                {/* --- SIDEBAR BAŞLANGIÇ --- */}
                <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark admin-sidebar">
                    <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="fs-4 fw-bold">Admin Panel</span>
                    </div>
                    <hr className="admin-sidebar-divider" />
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item mb-2">
                            <Link to="/admin/dashboard" className="nav-link text-white">
                                <i className="fas fa-chart-line me-2"></i> Özet (Dashboard)
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/admin/foods" className="nav-link text-white">
                                <i className="fas fa-apple-alt me-2"></i> Besin Yönetimi
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/admin/users" className="nav-link text-white">
                                <i className="fas fa-users me-2"></i> Kullanıcılar
                            </Link>
                        </li>
                        
                        {/* Randevular Linki */}
                        <li className="nav-item mb-2">
                            <Link to="/admin/randevular" className="nav-link text-white">
                                <i className="fas fa-calendar-check me-2"></i> Randevular
                            </Link>
                        </li>

                    </ul>
                    <hr className="admin-sidebar-divider" />
                    <button onClick={handleLogout} className="btn btn-danger w-100">
                        <i className="fas fa-sign-out-alt me-2"></i> Çıkış / Siteye Dön
                    </button>
                </div>
                {/* --- SIDEBAR BİTİŞ --- */}

                {/* İçerik Alanı (Outlet) */}
                <div className="flex-grow-1 p-4 admin-content-area">
                    <Outlet />
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="admin-footer">
                <div className="container-fluid px-4">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="mb-0 small opacity-75">
                                <i className="fas fa-shield-alt me-2"></i>
                                Admin Panel - DIETDIARY Yönetim Sistemi
                            </p>
                        </div>
                        <div className="col-md-6 text-end">
                            <p className="mb-0 small opacity-75">
                                © {new Date().getFullYear()} DIETDIARY. Tüm hakları saklıdır.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;