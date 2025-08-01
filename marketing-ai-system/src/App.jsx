import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importar componentes das páginas
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Config from './components/Config';
import Campaigns from './components/Campaigns';
import Analytics from './components/Analytics';
import Chat from './components/Chat';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import WhatsAppManager from './components/platforms/WhatsAppManager';
import InstagramManager from './components/platforms/InstagramManager';
import FacebookManager from './components/platforms/FacebookManager';

// Context para autenticação
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Páginas protegidas com layout */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/config" element={<Layout><Config /></Layout>} />
            <Route path="/campaigns" element={<Layout><Campaigns /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/chat" element={<Layout><Chat /></Layout>} />
            
            {/* Páginas de gerenciamento de plataformas */}
            <Route path="/platforms/whatsapp" element={<Layout><WhatsAppManager /></Layout>} />
            <Route path="/platforms/instagram" element={<Layout><InstagramManager /></Layout>} />
            <Route path="/platforms/facebook" element={<Layout><FacebookManager /></Layout>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

