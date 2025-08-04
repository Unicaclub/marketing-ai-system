import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Enquanto carrega, mostra um loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se há usuário autenticado, redireciona para dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não há usuário autenticado, renderiza o componente filho (login/register)
  return children;
};

export default PublicRoute;