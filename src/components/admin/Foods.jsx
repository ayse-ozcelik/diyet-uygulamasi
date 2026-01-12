import React, { useState, useEffect } from 'react';

const Foods = () => {
  const [foods, setFoods] = useState([]);
  // Form state'i (image artık Base64 string tutacak)
  const [form, setForm] = useState({ name: '', calorie: '', type: 'Karbonhidrat', image: '' });

  useEffect(() => {
    const savedFoods = JSON.parse(localStorage.getItem('myAppFoods')) || [];
    setFoods(savedFoods);
  }, []);

  // --- YENİ: RESİM YÜKLEME FONKSİYONU (Base64 Çevirici) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Seçilen ilk dosya
    
    if (file) {
      // Boyut Kontrolü (Örn: 500KB üzeri yüklemesin, localStorage şişmesin)
      if (file.size > 500000) {
        alert("Dosya boyutu çok büyük! Lütfen 500KB'dan küçük (örneğin ekran görüntüsü) bir resim seçin.");
        e.target.value = null; // Inputu temizle
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Dosya okuma bitince oluşan uzun string'i state'e kaydet
        setForm({ ...form, image: reader.result });
      };
      // Okuma işlemini başlat
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    
    if (!form.name || !form.calorie || !form.image) {
      return alert('Lütfen resim dahil tüm alanları doldurun!');
    }

    // LocalStorage kotası dolduysa hata verebilir, try-catch ile yakalayalım
    try {
        const newFoods = [...foods, { ...form, id: Date.now() }];
        localStorage.setItem('myAppFoods', JSON.stringify(newFoods));
        setFoods(newFoods);
        setForm({ name: '', calorie: '', type: 'Karbonhidrat', image: '' }); // Formu sıfırla
        // Dosya inputunu manuel temizlemek gerekir
        document.getElementById('fileInput').value = null;
    } catch (error) {
        alert("Hata: Hafıza dolu olabilir! Daha küçük bir resim deneyin veya eski kayıtları silin.");
        console.error("LocalStorage Error:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Silmek istediğine emin misin?')) {
      const filteredFoods = foods.filter(food => food.id !== id);
      setFoods(filteredFoods);
      localStorage.setItem('myAppFoods', JSON.stringify(filteredFoods));
    }
  };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🍎 Besin Yönetimi</h2>

      {/* --- EKLEME KARTI --- */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#7f8c8d' }}>Yeni Besin Ekle</h4>
        
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Besin Adı (Örn: Tavuk Salata)" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              style={inputStyle} 
            />
            
            <input 
              type="number" 
              placeholder="Kalori (kcal)" 
              value={form.calorie}
              onChange={(e) => setForm({...form, calorie: e.target.value})}
              style={inputStyle} 
            />

            <select 
              value={form.type} 
              onChange={(e) => setForm({...form, type: e.target.value})}
              style={inputStyle}
            >
              <option>Karbonhidrat</option>
              <option>Protein</option>
              <option>Yağ</option>
              <option>Meyve/Sebze</option>
              <option>Atıştırmalık</option>
            </select>
          </div>

          {/* --- YENİ: DOSYA YÜKLEME ALANI --- */}
          <div style={{ border: '2px dashed #dfe6e9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <label htmlFor="fileInput" style={{ cursor: 'pointer', color: '#3498db', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
              📸 Fotoğraf Seçmek İçin Tıkla (Max 500KB)
            </label>
            <input 
              id="fileInput"
              type="file" 
              accept="image/*" // Sadece resim dosyaları
              onChange={handleImageUpload}
              style={{ display: 'none' }} // Çirkin inputu gizle, label'a tıklatacağız
            />
            
            {/* Seçilen resmin önizlemesi */}
            {form.image && (
              <div style={{ marginTop: '10px' }}>
                <img src={form.image} alt="Önizleme" style={{ height: '100px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <p style={{ fontSize: '12px', color: 'green' }}>Resim seçildi!</p>
              </div>
            )}
          </div>
          
          <button type="submit" style={buttonStyle}>+ Besini Kaydet</button>
        </form>
      </div>

      {/* --- LİSTELEME --- */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 20px 0', color: '#7f8c8d' }}>Mevcut Besinler ({foods.length})</h4>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ecf0f1', color: '#7f8c8d' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Görsel</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Ad</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Tip</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Kalori</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '10px' }}>
                  <img src={food.image} alt={food.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                </td>
                <td style={{ padding: '15px 10px', fontWeight: '500' }}>{food.name}</td>
                <td style={{ padding: '15px 10px' }}>
                  <span style={badgeStyle(food.type)}>{food.type}</span>
                </td>
                <td style={{ padding: '15px 10px' }}>{food.calorie} kcal</td>
                <td style={{ padding: '15px 10px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(food.id)}
                    style={{ ...buttonStyle, backgroundColor: '#ff6b6b', padding: '5px 10px', fontSize: '12px' }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '14px', minWidth: '150px' };
const buttonStyle = { padding: '12px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const badgeStyle = (type) => {
  let color = '#95a5a6';
  if (type === 'Protein') color = '#3498db';
  if (type === 'Karbonhidrat') color = '#f1c40f';
  if (type === 'Yağ') color = '#e67e22';
  if (type === 'Meyve/Sebze') color = '#2ecc71';
  return { backgroundColor: color, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' };
};

export default Foods;