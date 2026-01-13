import React, { useState } from 'react';

function Tarifler() {
    // Tarif verilerini bir dizide topluyoruz (Yönetimi daha kolay)
    const recipes = [
        {
            id: 1,
            name: "Renkli Kinoa Salatası",
            time: "15 Dakika",
            desc: "Yüksek proteinli ve glütensiz bir öğle yemeği alternatifi.",
            img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
            steps: ["Kinoaları haşlayıp süzün.", "İçine ince kıyılmış maydanoz, domates ve avokado ekleyin.", "Limon ve zeytinyağı sosu ile servis edin."],
            details: "Kinoa, tam protein içeren nadir bitkisel kaynaklardan biridir. Bu salata hem hafif hem de oldukça doyurucudur."
        },
        {
            id: 2,
            name: "Orman Meyveli Yulaf",
            time: "10 Dakika",
            desc: "Güne enerjik başlamanızı sağlayacak lif deposu kahvaltı.",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
            steps: ["Yulafı süt veya su ile kıvam alana kadar pişirin.", "Üzerine taze yaban mersini ve fıstık ezmesi ekleyin.", "Bir tutam tarçın serperek tatlandırın."],
            details: "Yulaf yavaş sindirilen karbonhidratlar içerir, bu da gün boyu kan şekerinizi dengede tutar."
        },
        {
            id: 3,
            name: "Zeytinyağlı Taze Fasulye",
            time: "35 Dakika",
            desc: "Hafif, geleneksel ve sindirim dostu bir sebze yemeği.",
            img: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=800",
            steps: ["Fasulyeleri ayıklayıp boyuna ikiye bölün.", "Soğan ve sarımsağı az zeytinyağında pembeleştirip domatesleri ekleyin.", "Fasulyeleri ve az suyu ilave edip kısık ateşte yumuşayana kadar pişirin."],
            details: "Geleneksel bir Ege lezzeti olan bu yemek, düşük kalorisiyle diyetlerin vazgeçilmezidir."
        },
        {
            id: 4,
            name: "Yağsız Fırın Mücver",
            time: "40 Dakika",
            desc: "Kızartma tadında ama çok daha sağlıklı bir klasik.",
            img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800",
            steps: ["Kabakları rendeleyip suyunu iyice sıkın.", "Dereotu, yumurta, az miktar tam buğday unu ve lor peyniri ile karıştırın.", "Yağlı kağıt serili fırın tepsisine döküp 180 derecede kızarana kadar pişirin."],
            details: "Fırınlama yöntemi sayesinde mücverin kalorisini %60 oranında azaltmış oluyoruz."
        },
        {
            id: 5,
            name: "Bulgurlu Semizotu Yemeği",
            time: "25 Dakika",
            desc: "Omega-3 deposu, doyurucu ve çok hafif bir Anadolu lezzeti.",
            img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
            steps: ["Soğanları soteleyip salçayı ekleyin.", "Yıkanmış semizotlarını ve 1 yemek kaşığı bulguru ilave edin.", "Kendi suyunda kısa süre pişirip üzerine sarımsaklı yoğurtla servis yapın."],
            details: "Semizotu, bitkisel Omega-3 açısından en zengin yeşil yapraklı sebzedir."
        },
        {
            id: 6,
            name: "Anne Usulü Diyet Köfte",
            time: "20 Dakika",
            desc: "Ekmek içi yerine yulaf ezmesi kullanılarak hazırlanan yüksek proteinli öğün.",
            img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800",
            steps: ["Yağsız dana kıymayı soğan, maydanoz ve baharatlarla yoğurun.", "Bağlayıcı olarak galeta unu yerine öğütülmüş yulaf kullanın.", "Yağsız tavada veya ızgarada çevirerek pişirin."],
            details: "Yulaf kullanmak hem lif oranını artırır hem de köftelerin daha sulu kalmasını sağlar."
        }
    ];

    const [selectedRecipe, setSelectedRecipe] = useState(null);

    return (
        <div className="container py-4">
            <h4 className="fw-bold mb-4" style={{ color: '#1b4332' }}>
                <i className="fas fa-leaf me-2"></i>Günün Sağlıklı Tarif Önerileri
            </h4>

            <div className="row">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="col-md-6 mb-4">
                        <div 
                            className="section-card shadow-sm p-0 overflow-hidden bg-white rounded-4 border-0 h-100"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => setSelectedRecipe(recipe)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <img src={recipe.img} className="w-100" style={{ height: '250px', objectFit: 'cover' }} alt={recipe.name} />
                            <div className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="fw-bold mb-0">{recipe.name}</h5>
                                    <span className="badge bg-success rounded-pill" style={{ backgroundColor: '#1b4332' }}>{recipe.time}</span>
                                </div>
                                <p className="text-muted small mb-3">{recipe.desc}</p>
                                <div className="recipe-details p-3 rounded-3" style={{ backgroundColor: '#f8fdfa', borderLeft: '4px solid #1b4332' }}>
                                    <h6 className="fw-bold small mb-2 text-success text-uppercase">Nasıl Yapılır? (Göz At)</h6>
                                    <ul className="small text-muted ps-3 mb-0">
                                        {recipe.steps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- DETAY MODALI --- */}
            {selectedRecipe && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                     style={{ zIndex: 2000, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    
                    <div className="container position-relative" style={{ maxWidth: '900px' }}>
                        {/* Geri Butonu */}
                        <button 
                            className="btn btn-light rounded-circle position-absolute top-0 start-0 m-3 shadow"
                            onClick={() => setSelectedRecipe(null)}
                            style={{ zIndex: 10, width: '40px', height: '40px' }}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>

                        <div className="card border-0 rounded-5 overflow-hidden shadow-lg bg-white">
                            <div className="row g-0">
                                <div className="col-md-6">
                                    <img src={selectedRecipe.img} className="h-100 w-100" style={{ objectFit: 'cover', minHeight: '450px' }} alt={selectedRecipe.name} />
                                </div>
                                <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
                                    <div className="mb-2">
                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
                                            <i className="far fa-clock me-1"></i> {selectedRecipe.time} Hazırlık
                                        </span>
                                    </div>
                                    <h2 className="fw-bold mb-3" style={{ color: '#1b4332' }}>{selectedRecipe.name}</h2>
                                    <p className="text-muted mb-4" style={{fontSize: '1.1rem'}}>{selectedRecipe.details}</p>
                                    
                                    <h5 className="fw-bold mb-3 text-uppercase small" style={{letterSpacing: '1px'}}>Adım Adım Hazırlanışı</h5>
                                    <div className="recipe-steps overflow-auto" style={{ maxHeight: '250px' }}>
                                        {selectedRecipe.steps.map((step, i) => (
                                            <div key={i} className="d-flex mb-3 align-items-start">
                                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1" 
                                                     style={{ minWidth: '24px', height: '24px', fontSize: '0.8rem' }}>{i + 1}</div>
                                                <span className="text-secondary">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button className="btn btn-success w-100 rounded-pill mt-4 py-3 fw-bold shadow-sm" 
                                            style={{backgroundColor: '#1b4332', border: 'none'}}
                                            onClick={() => setSelectedRecipe(null)}>
                                        TARİFİ KAPAT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tarifler;
