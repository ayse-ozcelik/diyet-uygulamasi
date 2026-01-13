// LocalStorage anahtarları
const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  USERS: 'myAppUsers',
  FOODS: 'myAppFoods',
  APPOINTMENTS: 'randevular',
  WATER_HISTORY: (email) => `${email}_waterHistory`,
  USER_MEALS: (email) => `${email}_userMeals`,
  EXERCISE_HISTORY: (email) => `${email}_exerciseHistory`,
  WATER_LOGS: (email) => `${email}_waterLogs`,
  STEPS: (email) => `${email}_steps`,
};

// --- KULLANICI İŞLEMLERİ ---
export const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
    } catch {
        return null;
    }
};

export const saveCurrentUser = (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getAllUsers = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch {
        return [];
    }
};

export const saveUser = (user) => {
    const users = getAllUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// --- SU TAKİBİ İŞLEMLERİ ---
export const getWaterHistory = (userEmail) => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.WATER_HISTORY(userEmail))) || {};
    } catch {
        return {};
    }
};

export const saveWater = (userEmail, date, count) => {
    const history = getWaterHistory(userEmail);
    history[date] = count;
    localStorage.setItem(STORAGE_KEYS.WATER_HISTORY(userEmail), JSON.stringify(history));
};

export const getWaterLogs = (userEmail) => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.WATER_LOGS(userEmail))) || [];
    } catch {
        return [];
    }
};

export const saveWaterLog = (userEmail, log) => {
    const logs = getWaterLogs(userEmail);
    logs.push(log);
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS(userEmail), JSON.stringify(logs));
};

export const deleteWaterLog = (userEmail, logId) => {
    const logs = getWaterLogs(userEmail);
    const updated = logs.filter(l => l.id !== logId);
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS(userEmail), JSON.stringify(updated));
};

export const deleteWaterLogsByDate = (userEmail, date) => {
    const logs = getWaterLogs(userEmail);
    const updated = logs.filter(l => l.date !== date);
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS(userEmail), JSON.stringify(updated));
};

// --- BESLENME / YEMEK İŞLEMLERİ ---
export const getUserMeals = (userEmail) => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_MEALS(userEmail))) || [];
    } catch {
        return [];
    }
};

export const saveMeal = (userEmail, meal) => {
    const meals = getUserMeals(userEmail);
    const mealWithId = { ...meal, id: meal.id || Date.now(), date: meal.date || new Date().toLocaleDateString('tr-TR') };
    meals.push(mealWithId);
    localStorage.setItem(STORAGE_KEYS.USER_MEALS(userEmail), JSON.stringify(meals));
    return mealWithId;
};

export const deleteMeal = (userEmail, mealId) => {
    const meals = getUserMeals(userEmail);
    const updated = meals.filter(m => m.id !== mealId);
    localStorage.setItem(STORAGE_KEYS.USER_MEALS(userEmail), JSON.stringify(updated));
};

// --- EGZERSİZ İŞLEMLERİ ---
export const getExerciseHistory = (userEmail) => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_HISTORY(userEmail))) || [];
    } catch {
        return [];
    }
};

export const saveExercise = (userEmail, exercise) => {
    const exercises = getExerciseHistory(userEmail);
    const exerciseWithId = { ...exercise, id: exercise.id || Date.now(), date: exercise.date || new Date().toLocaleDateString('en-CA') };
    exercises.push(exerciseWithId);
    localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY(userEmail), JSON.stringify(exercises));
    return exerciseWithId;
};

export const deleteExercise = (userEmail, exerciseId) => {
    const exercises = getExerciseHistory(userEmail);
    const updated = exercises.filter(e => e.id !== exerciseId);
    localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY(userEmail), JSON.stringify(updated));
};

// --- RANDEVU (DİYETİSYEN) İŞLEMLERİ ---
export const getAppointments = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || [];
    } catch {
        return [];
    }
};

export const addAppointment = (randevu) => {
    const current = getAppointments();
    const appointmentWithId = { ...randevu, id: randevu.id || Date.now() };
    current.push(appointmentWithId);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(current));
    return appointmentWithId;
};

export const deleteAppointment = (id) => {
    const current = getAppointments();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
};

// --- BESİN KÜTÜPHANESİ ---
export const getFoods = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FOODS)) || [];
    } catch {
        return [];
    }
};

export const saveFood = (food) => {
    const foods = getFoods();
    const foodWithId = { ...food, id: food.id || Date.now() };
    foods.push(foodWithId);
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods));
    return foodWithId;
};

export const deleteFood = (foodId) => {
    const foods = getFoods();
    const updated = foods.filter(f => f.id !== foodId);
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(updated));
};

// --- ADIM SAYISI ---
export const getSteps = (userEmail) => {
    try {
        return localStorage.getItem(STORAGE_KEYS.STEPS(userEmail)) || '0';
    } catch {
        return '0';
    }
};

export const saveSteps = (userEmail, steps) => {
    localStorage.setItem(STORAGE_KEYS.STEPS(userEmail), steps.toString());
};