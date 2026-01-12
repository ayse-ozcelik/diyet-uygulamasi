
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profil.css';

function Profil() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '', weight: '', goalWeight: '', height: '' });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Mevcut oturumu güncelle
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 2. Ana kullanıcı listesini (myAppUsers) kalıcı olarak güncelle
        let allUsers = JSON.parse(localStorage.getItem('myAppUsers')) || [];
        const updatedUsers = allUsers.map(u => u.email === user.email ? user : u);
        localStorage.setItem('myAppUsers', JSON.stringify(updatedUsers));

        alert("Bilgilerin başarıyla güncellendi! 🌿");
        navigate('/dashboard');
    };

    return (
        <div className="profile-page-container py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="profile-card-custom shadow">

                            {/* Üst Kısım: Başlık ve Görsel */}
                            <div className="profile-header-gradient">
                                <div className="avatar-wrapper">
                                    <i className="fas fa-user-circle fa-4x" style={{ color: '#1b4332' }}></i>
                                </div>
                                <h4 className="fw-bold mb-1">Hesap Ayarları</h4>
                                <p className="mb-0 opacity-75 small">Kişisel sağlık profilini yönet</p>
                            </div>

                            <div className="p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        {/* Ad Soyad */}
                                        <div className="col-12">
                                            <label className="small fw-bold text-muted mb-2 ms-2">AD SOYAD</label>
                                            <div className="input-group-custom">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    value={user.name}
                                                    onChange={handleChange}
                                                    placeholder="Adınız Soyadınız"
                                                    required
                                                />
                                                <i className="fas fa-pencil-alt"></i>
                                            </div>
                                        </div>

                                        {/* E-posta - Değiştirilemez */}
                                        <div className="col-12">
                                            <label className="small fw-bold text-muted mb-2 ms-2">E-POSTA</label>
                                            <div className="input-group-custom">
                                                <input
                                                    type="email"
                                                    className="form-control bg-light text-muted opacity-75"
                                                    value={user.email}
                                                    disabled
                                                />
                                                <i className="fas fa-lock" style={{ color: '#ced4da' }}></i>
                                            </div>
                                        </div>

                                        {/* Fiziksel Bilgiler Grubu */}
                                        <div className="col-md-4">
                                            <label className="small fw-bold text-muted mb-2 ms-2">KİLO (kg)</label>
                                            <div className="input-group-custom">
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    className="form-control text-center"
                                                    value={user.weight}
                                                    onChange={handleChange}
                                                />
                                                <i className="fas fa-pencil-alt" style={{ right: '12px' }}></i>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="small fw-bold text-muted mb-2 ms-2">BOY (cm)</label>
                                            <div className="input-group-custom">
                                                <input
                                                    type="number"
                                                    name="height"
                                                    className="form-control text-center"
                                                    value={user.height}
                                                    onChange={handleChange}
                                                />
                                                <i className="fas fa-pencil-alt" style={{ right: '12px' }}></i>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="small fw-bold text-muted mb-2 ms-2">HEDEF (kg)</label>
                                            <div className="input-group-custom">
                                                <input
                                                    type="number"
                                                    name="goalWeight"
                                                    className="form-control text-center text-danger fw-bold"
                                                    value={user.goalWeight}
                                                    onChange={handleChange}
                                                />
                                                <i className="fas fa-pencil-alt" style={{ right: '12px' }}></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Aksiyon Butonları */}
                                    <div className="row g-3 mt-4">
                                        <div className="col-md-8">
                                            <button type="submit" className="btn btn-save-profile w-100 shadow-sm">
                                                <i className="fas fa-check-circle me-2"></i>Değişiklikleri Kaydet
                                            </button>
                                        </div>
                                        <div className="col-md-4">
                                            <Link to="/dashboard" className="btn btn-light w-100 py-3 rounded-4 fw-bold text-muted border">
                                                Vazgeç
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;

//Kalıcı Güncelleme: handleSubmit içine, ana kullanıcı listesini (myAppUsers) güncelleyen kodu ekledim. Bu sayede kilo bilgin değiştiğinde, uygulamayı kapatıp açsan bile yeni kilon kayıtlı kalacak.
//Kullanıcı Deneyimi: Formun altına bir "İptal" butonu ekledim, yanlışlıkla girersen Dashboard'a hızlıca dönebilirsin.