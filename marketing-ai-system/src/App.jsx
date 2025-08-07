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
import WhatsAppAutomation from './components/platforms/WhatsAppAutomation';
import InstagramManager from './components/platforms/InstagramManager';
import FacebookManager from './components/platforms/FacebookManager';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

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
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Páginas protegidas com layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/config" element={
              <ProtectedRoute>
                <Layout><Config /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout><Campaigns /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout><Analytics /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Layout><Chat /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Páginas de gerenciamento de plataformas */}
            <Route path="/platforms/whatsapp" element={
              <ProtectedRoute>
                <Layout><WhatsAppManager /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/platforms/whatsapp/automation" element={
              <ProtectedRoute>
                <Layout><WhatsAppAutomation /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/platforms/instagram" element={
              <ProtectedRoute>
                <Layout><InstagramManager /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/platforms/facebook" element={
              <ProtectedRoute>
                <Layout><FacebookManager /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

