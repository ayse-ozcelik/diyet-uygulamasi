import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Yeni oluşturduğun component
import AdminUsers from './components/admin/AdminUsers';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/Dashboard'; 
import AdminLogin from './components/admin/AdminLogin';
// import Users from './components/admin/Users'; // Artık AdminUsers kullanıyoruz, buna gerek kalmadı
import Foods from './components/admin/Foods';
import AdminRandevular from './components/admin/AdminRandevular';

import Auth from './components/Auth';
import Layout from "./components/Layout";
import Dashboard from './components/Dashboard';
import Beslenme from './components/Beslenme';
import Egzersizler from './components/Egzersizler';
import SuTakibi from './components/SuTakibi';
import Profil from './components/Profil';
import Tarifler from './components/Tarifler'; 
import Diyetisyenler from './components/Diyetisyenler';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login - Layout YOK (Tam ekran) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Paneli - Layout VAR (Sidebar ve Header gelir) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* DÜZELTME: Artık 'users' yoluna gidince yeni tablon açılacak */}
          <Route path="users" element={<AdminUsers />} />
          
          <Route path="foods" element={<Foods />} />
          <Route path="randevular" element={<AdminRandevular />} />
        </Route>

        {/* Kullanıcı Paneli */}
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/beslenme" element={<Layout><Beslenme /></Layout>} />
        <Route path="/egzersizler" element={<Layout><Egzersizler /></Layout>} />
        <Route path="/tarifler" element={<Layout><Tarifler /></Layout>} />
        <Route path="/su-takibi" element={<Layout><SuTakibi /></Layout>} />
        <Route path="/diyetisyenler" element={<Layout><Diyetisyenler /></Layout>} />
        <Route path="/profil" element={<Layout><Profil /></Layout>} />
      </Routes>
    </Router>
  );
}
export default App;