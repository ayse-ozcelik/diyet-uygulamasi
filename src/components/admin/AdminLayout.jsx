import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Çıkış yapıp ana sayfaya atar
        navigate('/');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* --- SIDEBAR BAŞLANGIÇ --- */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
                <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-4 fw-bold">Admin Panel</span>
                </div>
                <hr />
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
                <hr />
                <button onClick={handleLogout} className="btn btn-danger w-100">
                    <i className="fas fa-sign-out-alt me-2"></i> Çıkış / Siteye Dön
                </button>
            </div>
            {/* --- SIDEBAR BİTİŞ --- */}

            {/* İçerik Alanı (Outlet) */}
            <div className="flex-grow-1 p-4" style={{backgroundColor: '#f8f9fa'}}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;