import React, { useState, useEffect } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const AdminPanel = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um admin logado no localStorage
    const savedAdmin = localStorage.getItem('adminAuth');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdminUser(adminData);
      } catch (error) {
        console.error('Erro ao carregar dados do admin:', error);
        localStorage.removeItem('adminAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (adminData) => {
    setAdminUser(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setAdminUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
};

export default AdminPanel;

