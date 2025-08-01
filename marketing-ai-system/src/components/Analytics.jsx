import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const metrics = {
    totalReach: { value: 45230, change: 23, positive: true },
    totalConversions: { value: 1847, change: 18, positive: true },
    avgROI: { value: 450, change: 5, positive: true },
    avgCTR: { value: 3.2, change: -2, positive: false },
    totalRevenue: { value: 89500, change: 15, positive: true },
    avgEngagement: { value: 7.8, change: 12, positive: true }
  };

  const campaignPerformance = [
    { name: 'Black Friday 2024', reach: 12500, conversions: 234, roi: 380, revenue: 28500 },
    { name: 'Lançamento Produto X', reach: 8900, conversions: 156, roi: 420, revenue: 18900 },
    { name: 'Campanha Verão', reach: 15600, conversions: 298, roi: 510, revenue: 35600 },
    { name: 'Retargeting Q1', reach: 8230, conversions: 89, roi: 290, revenue: 6500 }
  ];

  const platformData = [
    { platform: 'Instagram', reach: 18500, conversions: 567, revenue: 42300, color: 'bg-pink-500' },
    { platform: 'Facebook', reach: 15600, conversions: 432, revenue: 28900, color: 'bg-blue-500' },
    { platform: 'WhatsApp', reach: 11130, conversions: 848, revenue: 18300, color: 'bg-green-500' }
  ];

  const timeData = [
    { period: 'Jan', reach: 12000, conversions: 234, revenue: 18500 },
    { period: 'Fev', reach: 15600, conversions: 298, revenue: 24300 },
    { period: 'Mar', reach: 18900, conversions: 367, revenue: 31200 },
    { period: 'Abr', reach: 22300, conversions: 445, revenue: 38900 },
    { period: 'Mai', reach: 25800, conversions: 523, revenue: 45600 }
  ];

  const MetricCard = ({ title, value, change, positive, icon, suffix = '' }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-blue-600">{icon}</div>
        </div>
        <div className={`flex items-center text-sm font-medium ${
          positive ? 'text-green-600' : 'text-red-600'
        }`}>
          {positive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Análise detalhada da performance das suas campanhas
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <button className="btn-primary-gradient text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Alcance Total"
          value={metrics.totalReach.value}
          change={metrics.totalReach.change}
          positive={metrics.totalReach.positive}
          icon={<Eye className="w-6 h-6" />}
        />
        <MetricCard
          title="Conversões"
          value={metrics.totalConversions.value}
          change={metrics.totalConversions.change}
          positive={metrics.totalConversions.positive}
          icon={<MousePointer className="w-6 h-6" />}
        />
        <MetricCard
          title="ROI Médio"
          value={metrics.avgROI.value}
          change={metrics.avgROI.change}
          positive={metrics.avgROI.positive}
          icon={<TrendingUp className="w-6 h-6" />}
          suffix="%"
        />
        <MetricCard
          title="CTR Médio"
          value={metrics.avgCTR.value}
          change={metrics.avgCTR.change}
          positive={metrics.avgCTR.positive}
          icon={<Activity className="w-6 h-6" />}
          suffix="%"
        />
        <MetricCard
          title="Receita Total"
          value={`R$ ${metrics.totalRevenue.value.toLocaleString()}`}
          change={metrics.totalRevenue.change}
          positive={metrics.totalRevenue.positive}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <MetricCard
          title="Engajamento"
          value={metrics.avgEngagement.value}
          change={metrics.avgEngagement.change}
          positive={metrics.avgEngagement.positive}
          icon={<Users className="w-6 h-6" />}
          suffix="%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance ao Longo do Tempo</h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-4">
            {timeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">{item.period}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-900 font-medium">
                        {item.reach.toLocaleString()} alcance
                      </span>
                      <span className="text-green-600">
                        {item.conversions} conversões
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    R$ {item.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance por Plataforma</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {platformData.map((platform, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${platform.color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{platform.platform}</span>
                    <span className="text-sm text-gray-600">
                      R$ {platform.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{platform.reach.toLocaleString()} alcance</span>
                    <span>{platform.conversions} conversões</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Performance das Campanhas</h3>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alcance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaignPerformance.map((campaign, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {campaign.reach.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {campaign.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-600 font-medium">{campaign.roi}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    R$ {campaign.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights e Recomendações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Oportunidade de Crescimento</h4>
                  <p className="text-sm text-green-700">
                    A campanha "Verão" tem o melhor ROI (510%). Considere aumentar o orçamento em 30%.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Alcance em Alta</h4>
                  <p className="text-sm text-blue-700">
                    Seu alcance aumentou 23% no último mês. Continue investindo em conteúdo visual.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Atenção ao CTR</h4>
                  <p className="text-sm text-yellow-700">
                    O CTR médio caiu 2%. Teste novos criativos e ajuste a segmentação de público.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Engajamento Crescente</h4>
                  <p className="text-sm text-purple-700">
                    O engajamento subiu 12%. Seus conteúdos estão ressoando bem com o público.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

