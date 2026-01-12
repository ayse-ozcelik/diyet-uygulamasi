// --- KULLANICI İŞLEMLERİ ---
export const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));

// --- SU TAKİBİ İŞLEMLERİ ---
export const getWaterHistory = (userEmail) => {
    return JSON.parse(localStorage.getItem(`${userEmail}_waterHistory`)) || {};
};

export const saveWater = (userEmail, date, count) => {
    const history = getWaterHistory(userEmail);
    history[date] = count;
    localStorage.setItem(`${userEmail}_waterHistory`, JSON.stringify(history));
};

// --- BESLENME / YEMEK İŞLEMLERİ ---
export const getUserMeals = (userEmail) => {
    return JSON.parse(localStorage.getItem(`${userEmail}_userMeals`)) || [];
};

export const saveMeal = (userEmail, meal) => {
    const meals = getUserMeals(userEmail);
    meals.push(meal);
    localStorage.setItem(`${userEmail}_userMeals`, JSON.stringify(meals));
};

// --- RANDEVU (DİYETİSYEN) İŞLEMLERİ ---

// Tüm randevuları getir
export const getAppointments = () => {
    return JSON.parse(localStorage.getItem('randevular')) || [];
};

// Yeni randevu ekle
export const addAppointment = (randevu) => {
    const current = getAppointments();
    current.push(randevu);
    localStorage.setItem('randevular', JSON.stringify(current));
};

// Randevu iptal et (Sil)
export const deleteAppointment = (id) => {
    const current = getAppointments();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem('randevular', JSON.stringify(updated));
};