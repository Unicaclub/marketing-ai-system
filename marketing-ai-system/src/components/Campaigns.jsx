import React, { useState } from 'react';
import CampaignCreator from './CampaignCreator';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  MessageSquare,
  Bot
} from 'lucide-react';

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreator, setShowCreator] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Black Friday 2024',
      description: 'Campanha promocional para Black Friday com descontos especiais',
      platform: 'Instagram',
      status: 'active',
      reach: 12500,
      conversions: 234,
      roi: 380,
      budget: 5000,
      spent: 3200,
      ctr: 3.4,
      createdAt: '2024-01-15',
      endDate: '2024-01-30'
    },
    {
      id: 2,
      name: 'Lançamento Produto X',
      description: 'Campanha de lançamento do novo produto da linha premium',
      platform: 'WhatsApp',
      status: 'active',
      reach: 8900,
      conversions: 156,
      roi: 420,
      budget: 3000,
      spent: 1800,
      ctr: 4.1,
      createdAt: '2024-01-12',
      endDate: '2024-01-25'
    },
    {
      id: 3,
      name: 'Campanha Verão',
      description: 'Promoção de produtos de verão com foco em jovens',
      platform: 'Facebook',
      status: 'paused',
      reach: 15600,
      conversions: 298,
      roi: 510,
      budget: 4500,
      spent: 4100,
      ctr: 2.8,
      createdAt: '2024-01-10',
      endDate: '2024-02-10'
    },
    {
      id: 4,
      name: 'Retargeting Q1',
      description: 'Campanha de retargeting para visitantes do site',
      platform: 'Instagram',
      status: 'draft',
      reach: 0,
      conversions: 0,
      roi: 0,
      budget: 2500,
      spent: 0,
      ctr: 0,
      createdAt: '2024-01-08',
      endDate: '2024-02-15'
    }
  ]);

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

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4" />;
      case 'Instagram':
        return <Target className="w-4 h-4" />;
      case 'Facebook':
        return <Users className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });


  const handleCreateCampaign = (campaignData) => {
    if (editingCampaign) {
      // Editar campanha existente
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...c, ...campaignData } : c));
      setEditingCampaign(null);
    } else {
      // Nova campanha
      const newCampaign = {
        id: Date.now(),
        ...campaignData,
        status: 'draft',
        reach: 0,
        conversions: 0,
        roi: 0,
        spent: 0,
        ctr: 0,
        createdAt: new Date().toISOString().split('T')[0],
        endDate: campaignData.schedule?.endDate?.split('T')[0] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setCampaigns(prev => [newCampaign, ...prev]);
    }
    setShowCreator(false);
  };

  const handlePauseActivate = (id) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
        : c
    ));
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setShowCreator(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as suas campanhas de marketing digital
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowCreator(true)}
            className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativas</option>
              <option value="paused">Pausadas</option>
              <option value="draft">Rascunhos</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 card-hover">
            {/* Campaign Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {campaign.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {getPlatformIcon(campaign.platform)}
                    <span>{campaign.platform}</span>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Metrics */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                    <Eye className="w-3 h-3" />
                    Alcance
                  </div>
                  <div className="font-semibold text-gray-900">
                    {campaign.reach.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Conversões
                  </div>
                  <div className="font-semibold text-gray-900">
                    {campaign.conversions}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                    <DollarSign className="w-3 h-3" />
                    ROI
                  </div>
                  <div className="font-semibold text-green-600">
                    {campaign.roi}%
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                    <Target className="w-3 h-3" />
                    CTR
                  </div>
                  <div className="font-semibold text-gray-900">
                    {campaign.ctr}%
                  </div>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Orçamento</span>
                  <span>R$ {campaign.spent.toLocaleString()} / R$ {campaign.budget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Campaign Dates */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(campaign.createdAt).toLocaleDateString('pt-BR')} - {' '}
                  {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-3 py-2 ${campaign.status === 'active' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1`}
                  onClick={() => handlePauseActivate(campaign.id)}
                >
                  {campaign.status === 'active' ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Ativar</>}
                </button>
                <button
                  className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => handleEdit(campaign)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma campanha encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Crie sua primeira campanha para começar'
            }
          </p>
          <button 
            onClick={() => setShowCreator(true)}
            className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Campanha
          </button>
        </div>
      )}

      {/* Campaign Creator Modal */}
      {showCreator && (
        <CampaignCreator
          onClose={() => {
            setShowCreator(false);
            setEditingCampaign(null);
          }}
          onSave={handleCreateCampaign}
          {...(editingCampaign ? { ...editingCampaign } : {})}
        />
      )}
    </div>
  );
};

export default Campaigns;

