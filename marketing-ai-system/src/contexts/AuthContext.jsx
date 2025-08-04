const API_URL = import.meta.env.VITE_API_URL || 'https://marketing-ai-system-production.up.railway.app/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        // Validar se os dados do usuário são válidos
        if (userObj && userObj.id && userObj.email && userObj.username) {
          setUser(userObj);
        } else {
          // Dados inválidos, limpar localStorage
          localStorage.removeItem('user');
        }
      } catch (error) {
        // JSON inválido, limpar localStorage
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        let errorMessage = 'Erro ao fazer login';
        
        if (res.status === 404) {
          errorMessage = 'Usuário não encontrado. Verifique o e-mail digitado.';
        } else if (res.status === 401) {
          errorMessage = 'Senha incorreta. Tente novamente.';
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        return { success: false, error: errorMessage };
      }
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Erro inesperado no login' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro de conexão. Verifique se o servidor está rodando.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        let errorMessage = 'Erro ao criar conta';
        
        if (res.status === 409) {
          errorMessage = 'Este e-mail ou nome de usuário já está sendo usado.';
        } else if (res.status === 400) {
          errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        return { success: false, error: errorMessage };
      }
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: 'Conta criada com sucesso!' };
      } else {
        return { success: false, error: data.error || 'Erro inesperado ao criar conta' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Erro de conexão. Verifique se o servidor está rodando.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const checkAuth = () => {
    // Verificar se o usuário está realmente autenticado
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      setUser(null);
      return false;
    }
    
    try {
      const userObj = JSON.parse(savedUser);
      if (!userObj || !userObj.id || !userObj.email || !userObj.username) {
        localStorage.removeItem('user');
        setUser(null);
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('user');
      setUser(null);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

