import React, { useState } from 'react';
import {
  Facebook,
  ThumbsUp,
  MessageCircle,
  Share,
  Eye,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Settings,
  Plus,
  BarChart3,
  Clock,
  Zap,
  Upload,
  Filter,
  Search,
  MoreVertical,
  Globe,
  UserCheck
} from 'lucide-react';

const FacebookManager = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = {
    pageFollowers: 28450,
    pageViews: 12340,
    postReach: 89230,
    engagement: 6.8,
    adSpend: 4500,
    conversions: 67,
    cpm: 12.50,
    ctr: 2.4
  };

  const posts = [
    {
      id: 1,
      type: 'text',
      content: 'Descubra como nossa solução de IA pode transformar seu negócio! 🚀 Agende uma demonstração gratuita.',
      likes: 156,
      comments: 23,
      shares: 8,
      reach: 4230,
      engagement: 7.2,
      timestamp: '3 horas atrás',
      campaign: 'Black Friday 2024',
      status: 'published'
    },
    {
      id: 2,
      type: 'image',
      content: 'Nossos clientes estão obtendo resultados incríveis! Veja alguns casos de sucesso.',
      likes: 289,
      comments: 45,
      shares: 19,
      reach: 8950,
      engagement: 9.1,
      timestamp: '1 dia atrás',
      campaign: 'Casos de Sucesso',
      status: 'published'
    },
    {
      id: 3,
      type: 'video',
      content: 'Tutorial: Como configurar sua primeira campanha de marketing digital em 5 minutos.',
      likes: 423,
      comments: 67,
      shares: 34,
      reach: 12340,
      engagement: 11.8,
      timestamp: '2 dias atrás',
      campaign: 'Conteúdo Educativo',
      status: 'published'
    }
  ];

  const ads = [
    {
      id: 1,
      name: 'Campanha Black Friday - Conversão',
      objective: 'conversions',
      status: 'active',
      budget: 150,
      spent: 127.50,
      reach: 15420,
      clicks: 234,
      conversions: 12,
      ctr: 1.52,
      cpc: 0.54
    },
    {
      id: 2,
      name: 'Awareness - Produto X',
      objective: 'brand_awareness',
      status: 'active',
      budget: 100,
      spent: 89.30,
      reach: 23450,
      clicks: 156,
      conversions: 8,
      ctr: 0.67,
      cpc: 0.57
    },
    {
      id: 3,
      name: 'Retargeting - Visitantes Site',
      objective: 'traffic',
      status: 'paused',
      budget: 80,
      spent: 65.20,
      reach: 8930,
      clicks: 189,
      conversions: 15,
      ctr: 2.12,
      cpc: 0.35
    }
  ];

  const audiences = [
    {
      id: 1,
      name: 'Empresários 25-45',
      size: 2400000,
      type: 'saved',
      lastUsed: '2 dias atrás'
    },
    {
      id: 2,
      name: 'Visitantes do Site',
      size: 15420,
      type: 'custom',
      lastUsed: '1 hora atrás'
    },
    {
      id: 3,
      name: 'Lookalike - Clientes',
      size: 1800000,
      type: 'lookalike',
      lastUsed: '5 dias atrás'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getObjectiveLabel = (objective) => {
    switch (objective) {
      case 'conversions': return 'Conversões';
      case 'brand_awareness': return 'Reconhecimento';
      case 'traffic': return 'Tráfego';
      case 'engagement': return 'Engajamento';
      case 'lead_generation': return 'Leads';
      default: return objective;
    }
  };

  const getAudienceTypeColor = (type) => {
    switch (type) {
      case 'saved': return 'text-blue-600 bg-blue-100';
      case 'custom': return 'text-purple-600 bg-purple-100';
      case 'lookalike': return 'text-green-600 bg-green-100';
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
              <p className="text-sm font-medium text-gray-600">Seguidores da Página</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.pageFollowers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+3.2%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alcance dos Posts</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.postReach.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8.7%</span>
            <span className="text-gray-500 ml-1">vs. semana anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gasto em Anúncios</p>
              <p className="text-2xl font-bold text-gray-900">R$ {metrics.adSpend.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">CPM: R$ {metrics.cpm}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversions}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Anúncios Ativos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Anúncios Ativos</h3>
          <button className="text-primary hover:text-blue-700 text-sm font-medium">
            Ver todos
          </button>
        </div>
        <div className="space-y-4">
          {ads.filter(ad => ad.status === 'active').map((ad) => (
            <div key={ad.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{ad.name}</h4>
                  <p className="text-sm text-gray-500">{getObjectiveLabel(ad.objective)}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">R$ {ad.spent}</p>
                  <p className="text-xs text-gray-500">Gasto</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{ad.reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Alcance</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{ad.clicks}</p>
                  <p className="text-xs text-gray-500">Cliques</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{ad.conversions}</p>
                  <p className="text-xs text-gray-500">Conversões</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                  Ativo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Recentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Posts Recentes da Página</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Post
          </button>
        </div>
        <div className="space-y-4">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.timestamp}</span>
                    <span>Campanha: {post.campaign}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Alcance: {post.reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Engajamento: {post.engagement}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAds = () => (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar anúncios..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="paused">Pausados</option>
              <option value="completed">Concluídos</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Novo Anúncio
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Anúncios */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Campanhas de Anúncios</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {ads.map((ad) => (
            <div key={ad.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{ad.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{getObjectiveLabel(ad.objective)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                        {ad.status === 'active' ? 'Ativo' : ad.status === 'paused' ? 'Pausado' : 'Concluído'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">R$ {ad.budget}</p>
                  <p className="text-xs text-gray-500">Orçamento</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">R$ {ad.spent}</p>
                  <p className="text-xs text-gray-500">Gasto</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{ad.reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Alcance</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{ad.clicks}</p>
                  <p className="text-xs text-gray-500">Cliques</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{ad.conversions}</p>
                  <p className="text-xs text-gray-500">Conversões</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{ad.ctr}%</p>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">R$ {ad.cpc}</p>
                  <p className="text-xs text-gray-500">CPC</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audiências */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Audiências Salvas</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nova Audiência
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audiences.map((audience) => (
            <div key={audience.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{audience.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAudienceTypeColor(audience.type)}`}>
                  {audience.type === 'saved' && 'Salva'}
                  {audience.type === 'custom' && 'Personalizada'}
                  {audience.type === 'lookalike' && 'Lookalike'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tamanho:</span>
                  <span className="text-sm font-medium">{audience.size.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Último uso:</span>
                  <span className="text-sm font-medium">{audience.lastUsed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Detalhado - Facebook</h3>
        
        {/* Gráfico de Performance */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Gráfico de performance dos anúncios</p>
            <p className="text-sm text-gray-500">Últimos 30 dias</p>
          </div>
        </div>

        {/* Métricas de Anúncios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">CTR Médio</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.ctr}%</p>
            <p className="text-xs text-blue-700">Taxa de cliques</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">CPC Médio</p>
            <p className="text-2xl font-bold text-green-600">R$ 0,45</p>
            <p className="text-xs text-green-700">Custo por clique</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-900">CPM Médio</p>
            <p className="text-2xl font-bold text-purple-600">R$ {metrics.cpm}</p>
            <p className="text-xs text-purple-700">Custo por mil impressões</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-900">ROAS</p>
            <p className="text-2xl font-bold text-orange-600">4.2x</p>
            <p className="text-xs text-orange-700">Retorno sobre investimento</p>
          </div>
        </div>

        {/* Análise de Audiência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Performance por Dispositivo</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mobile</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">68%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Desktop</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/3 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">32%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Performance por Horário</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Manhã (6h-12h)</span>
                <span className="text-sm font-medium">CTR: 2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tarde (12h-18h)</span>
                <span className="text-sm font-medium">CTR: 2.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Noite (18h-24h)</span>
                <span className="text-sm font-medium">CTR: 3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Madrugada (0h-6h)</span>
                <span className="text-sm font-medium">CTR: 1.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Facebook</h3>
        
        <div className="space-y-6">
          {/* Configuração da Conta */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Conta do Facebook</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID da Página
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ID da sua página do Facebook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token de Acesso
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Token de acesso da página"
                />
              </div>
            </div>
          </div>

          {/* Configuração de Anúncios */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configuração de Anúncios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID da Conta de Anúncios
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="act_1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pixel do Facebook
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ID do pixel de conversão"
                />
              </div>
            </div>
          </div>

          {/* Configurações de Automação */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configurações de Automação</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Otimização Automática</p>
                  <p className="text-sm text-gray-500">Ajustar lances automaticamente para melhor performance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Pausar Anúncios com Baixa Performance</p>
                  <p className="text-sm text-gray-500">Pausar automaticamente anúncios com CTR abaixo de 1%</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Configurações de Relatórios */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Relatórios Automáticos</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência dos Relatórios
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email para Relatórios
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Facebook className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facebook Business</h1>
            <p className="text-gray-600">Gerencie suas campanhas e anúncios no Facebook</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Importar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'ads', label: 'Anúncios', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
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

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'ads' && renderAds()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default FacebookManager;

