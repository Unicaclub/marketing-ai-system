import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bot,
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Zap,
  Target,
  Instagram,
  Facebook,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Campanhas', href: '/campaigns', icon: Target },
    { name: 'Chat IA', href: '/chat', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const platformNavigation = [
    { name: 'WhatsApp', href: '/platforms/whatsapp', icon: MessageSquare },
    { name: 'Instagram', href: '/platforms/instagram', icon: Instagram },
    { name: 'Facebook', href: '/platforms/facebook', icon: Facebook },
  ];

  const settingsNavigation = [
    { name: 'Configurações', href: '/config', icon: Settings },
    { name: 'Perfil', href: '/profile', icon: User },
  ];

  const isActive = (href) => location.pathname === href;

  const renderNavItem = (item, collapsed = false) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`
          relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group
          ${collapsed ? 'nav-item-collapsed' : ''}
          ${isActive(item.href)
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
        `}
        onClick={closeMobileSidebar}
      >
        <Icon className={`w-5 h-5 nav-icon ${collapsed ? '' : 'mr-3'}`} />
        <span className={`nav-text ${collapsed ? 'hidden' : ''}`}>{item.name}</span>
        {collapsed && (
          <div className="nav-tooltip">
            {item.name}
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Marketing AI</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `sidebar-mobile ${sidebarOpen ? 'open' : ''}`
          : `sidebar-desktop ${sidebarCollapsed ? 'collapsed' : ''}`
        }
        bg-white shadow-lg
        h-full
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 relative">
          <div className={`flex items-center space-x-3 ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <span className="text-lg font-semibold text-gray-900">Marketing AI</span>
            )}
          </div>
          
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={closeMobileSidebar}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Desktop toggle button */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
import WhatsAppAutomation from './platforms/WhatsAppAutomation';

        {/* Navigation */}
        <nav className="mt-6 px-3 overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => renderNavItem(item, sidebarCollapsed && !isMobile))}
          </div>

          {/* Platforms Section */}
          <div className="mt-8">
            {(!sidebarCollapsed || isMobile) && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Plataformas
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {platformNavigation.map((item) => renderNavItem(item, sidebarCollapsed && !isMobile))}
              <Link to="/platforms/WhatsApp/automation" className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group`}>
                <MessageSquare className="w-5 h-5 mr-3" />
                <span className="nav-text">Automação do WhatsApp</span>
              </Link>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mt-8">
            {(!sidebarCollapsed || isMobile) && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Configurações
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {settingsNavigation.map((item) => renderNavItem(item, sidebarCollapsed && !isMobile))}
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className={`flex items-center ${sidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
            {(!sidebarCollapsed || isMobile) && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Usuário Demo'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'teste@teste.com'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`
                p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors
                ${sidebarCollapsed && !isMobile ? 'relative group' : ''}
              `}
            >
              <LogOut className="w-4 h-4" />
              {sidebarCollapsed && !isMobile && (
                <div className="nav-tooltip">
                  Sair
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`
        ${isMobile 
          ? 'main-content-mobile'
          : `main-content-desktop ${sidebarCollapsed ? 'expanded' : ''}`
        }
        min-h-screen transition-all duration-300 ease-in-out
      `}>
        <div className="fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

