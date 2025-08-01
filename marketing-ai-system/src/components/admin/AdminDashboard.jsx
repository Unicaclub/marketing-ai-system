import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Activity,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Database,
  Bot,
  Zap,
  Globe,
  BarChart3,
  UserCheck,
  CreditCard,
  Bell,
  LogOut
} from 'lucide-react';

const AdminDashboard = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalCompanies: 156,
    activeCompanies: 134,
    totalRevenue: 89450,
    monthlyRevenue: 12340,
    totalCampaigns: 2456,
    activeCampaigns: 567,
    aiInteractions: 45230,
    systemUptime: 99.8
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'user_registration',
      description: 'Novo usuário registrado: João Silva',
      timestamp: '2 min atrás',
      company: 'TechCorp Ltda'
    },
    {
      id: 2,
      type: 'campaign_created',
      description: 'Nova campanha criada: Black Friday 2024',
      timestamp: '15 min atrás',
      company: 'E-commerce Plus'
    },
    {
      id: 3,
      type: 'ai_interaction',
      description: 'IA processou 150 interações de vendas',
      timestamp: '30 min atrás',
      company: 'Sistema'
    },
    {
      id: 4,
      type: 'payment_received',
      description: 'Pagamento recebido: R$ 299,00',
      timestamp: '1 hora atrás',
      company: 'Marketing Pro'
    },
    {
      id: 5,
      type: 'system_alert',
      description: 'Uso de CPU acima de 80%',
      timestamp: '2 horas atrás',
      company: 'Sistema'
    }
  ]);

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'TechCorp Ltda',
      users: 12,
      plan: 'Enterprise',
      status: 'active',
      revenue: 1299,
      lastActivity: '2 min atrás',
      campaigns: 8,
      aiUsage: 2340
    },
    {
      id: 2,
      name: 'E-commerce Plus',
      users: 8,
      plan: 'Professional',
      status: 'active',
      revenue: 599,
      lastActivity: '15 min atrás',
      campaigns: 5,
      aiUsage: 1890
    },
    {
      id: 3,
      name: 'Marketing Pro',
      users: 5,
      plan: 'Basic',
      status: 'active',
      revenue: 299,
      lastActivity: '1 hora atrás',
      campaigns: 3,
      aiUsage: 567
    },
    {
      id: 4,
      name: 'StartupX',
      users: 3,
      plan: 'Basic',
      status: 'trial',
      revenue: 0,
      lastActivity: '3 horas atrás',
      campaigns: 2,
      aiUsage: 234
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration': return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'campaign_created': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'ai_interaction': return <Bot className="w-4 h-4 text-purple-500" />;
      case 'payment_received': return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'system_alert': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trial': return 'text-blue-600 bg-blue-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Enterprise': return 'text-purple-600 bg-purple-100';
      case 'Professional': return 'text-blue-600 bg-blue-100';
      case 'Basic': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.activeCompanies}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">R$ {systemStats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+18%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+25%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Métricas do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">{systemStats.systemUptime}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Interações IA</span>
              <span className="text-sm font-medium">{systemStats.aiInteractions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Usuários Online</span>
              <span className="text-sm font-medium">{systemStats.activeUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">CPU</span>
              <span className="text-sm font-medium text-orange-600">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Memória</span>
              <span className="text-sm font-medium text-green-600">65%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Disco</span>
              <span className="text-sm font-medium text-blue-600">42%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alertas</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">CPU alto (78%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Todos os serviços OK</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Backup concluído</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividades Recentes</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{activity.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar empresas..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos os status</option>
              <option value="active">Ativas</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspensas</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Exportar
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              Nova Empresa
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Empresas Cadastradas</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {companies.map((company) => (
            <div key={company.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{company.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                        {company.status === 'active' ? 'Ativa' : company.status === 'trial' ? 'Trial' : 'Suspensa'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(company.plan)}`}>
                        {company.plan}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">R$ {company.revenue}/mês</p>
                  <p className="text-xs text-gray-500">Última atividade: {company.lastActivity}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{company.users}</p>
                  <p className="text-xs text-gray-500">Usuários</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{company.campaigns}</p>
                  <p className="text-xs text-gray-500">Campanhas</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{company.aiUsage.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Uso de IA</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <button className="text-sm font-medium text-primary hover:text-blue-700">
                    Gerenciar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Sistema</h3>
        
        <div className="space-y-6">
          {/* Configurações Gerais */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configurações Gerais</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Registros de Novos Usuários</p>
                  <p className="text-sm text-gray-500">Permitir que novos usuários se registrem</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Modo de Manutenção</p>
                  <p className="text-sm text-gray-500">Ativar modo de manutenção do sistema</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Configurações de IA */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configurações de IA</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo de IA Padrão
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite de Tokens por Usuário
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="10000"
                />
              </div>
            </div>
          </div>

          {/* Configurações de Email */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configurações de Email</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porta SMTP
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="587"
                />
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Sistema de Marketing AI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'companies', label: 'Empresas', icon: Building2 },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'companies' && renderCompanies()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;

