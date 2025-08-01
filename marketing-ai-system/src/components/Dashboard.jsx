import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  BarChart3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Eye,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalCampaigns: 12,
    activeCampaigns: 8,
    totalReach: 45230,
    totalConversions: 1847,
    roi: 450,
    ctr: 3.2,
    revenue: 89500,
    avgEngagement: 7.8
  });

  const [recentCampaigns] = useState([
    {
      id: 1,
      name: 'Black Friday 2024',
      platform: 'Instagram',
      status: 'active',
      reach: 12500,
      conversions: 234,
      roi: 380,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Lançamento Produto X',
      platform: 'WhatsApp',
      status: 'active',
      reach: 8900,
      conversions: 156,
      roi: 420,
      createdAt: '2024-01-12'
    },
    {
      id: 3,
      name: 'Campanha Verão',
      platform: 'Facebook',
      status: 'paused',
      reach: 15600,
      conversions: 298,
      roi: 510,
      createdAt: '2024-01-10'
    }
  ]);

  const metricCards = [
    {
      title: 'Campanhas Ativas',
      value: metrics.activeCampaigns,
      total: metrics.totalCampaigns,
      icon: <Target className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      positive: true
    },
    {
      title: 'Alcance Total',
      value: metrics.totalReach.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+23%',
      positive: true
    },
    {
      title: 'Conversões',
      value: metrics.totalConversions.toLocaleString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+18%',
      positive: true
    },
    {
      title: 'ROI Médio',
      value: `${metrics.roi}%`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%',
      positive: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'campaign-status-active';
      case 'paused':
        return 'campaign-status-paused';
      default:
        return 'campaign-status-draft';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'paused':
        return 'Pausada';
      default:
        return 'Rascunho';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral das suas campanhas e métricas
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/campaigns"
            className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Campanha
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.positive ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {metric.value}
                {metric.total && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    de {metric.total}
                  </span>
                )}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link
          to="/chat"
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white card-hover group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Chat com IA</h3>
              <p className="text-blue-100 text-sm">
                Crie campanhas conversando com nossa IA
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-200 group-hover:text-white transition-colors" />
          </div>
        </Link>

        <Link
          to="/analytics"
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white card-hover group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-green-100 text-sm">
                Veja relatórios detalhados de performance
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200 group-hover:text-white transition-colors" />
          </div>
        </Link>

        <Link
          to="/config"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white card-hover group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Configurações</h3>
              <p className="text-purple-100 text-sm">
                Configure suas integrações e APIs
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-200 group-hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Campanhas Recentes
            </h2>
            <Link
              to="/campaigns"
              className="text-primary hover:text-blue-700 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentCampaigns.map((campaign) => (
            <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                    <span className="text-sm text-gray-500">{campaign.platform}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {campaign.reach.toLocaleString()} alcance
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {campaign.conversions} conversões
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {campaign.roi}% ROI
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Semanal
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">CTR Médio</span>
              <span className="font-medium">{metrics.ctr}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Engajamento</span>
              <span className="font-medium">{metrics.avgEngagement}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Receita Total</span>
              <span className="font-medium">R$ {metrics.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximas Ações
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Revisar campanha "Black Friday 2024"
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Configurar integração do Instagram
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Analisar relatório de conversões
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

