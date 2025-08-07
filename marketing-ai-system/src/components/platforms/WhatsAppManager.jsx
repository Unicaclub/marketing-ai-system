import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Send,
  Phone,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  Download,
  Upload,
  Filter,
  Search,
  MoreVertical,
  Bot,
  Zap
} from 'lucide-react';

const WhatsAppManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [autoReply, setAutoReply] = useState(true);
  const [continuousLearning, setContinuousLearning] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Função para salvar configurações
  // Função para iniciar sessão WhatsApp
  const handleStartSession = async () => {
    if (!whatsappNumber) {
      alert('Informe o número do WhatsApp!');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: whatsappNumber })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Sessão iniciada! Detalhes: ' + JSON.stringify(data));
      } else {
        alert('Erro ao iniciar sessão: ' + (data.details || res.status));
      }
    } catch (err) {
      alert('Erro ao conectar com o backend: ' + err.message);
    }
  };

  // Função para enviar mensagem de texto
  const handleSendMessage = async () => {
    const session = prompt('ID da sessão WhatsApp:');
    const phone = prompt('Número do destinatário (com DDI):');
    const message = prompt('Digite a mensagem:');
    if (session && phone && message) {
      try {
        const res = await fetch(`${API_URL}/whatsapp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, phone, message })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Mensagem enviada! Detalhes: ' + JSON.stringify(data));
        } else {
          alert('Erro ao enviar mensagem: ' + (data.details || res.status));
        }
      } catch (err) {
        alert('Erro ao conectar com o backend: ' + err.message);
      }
    }
  };

  // Função para enviar imagem
  const handleSendImage = async () => {
    const session = prompt('ID da sessão WhatsApp:');
    const phone = prompt('Número do destinatário (com DDI):');
    const image = prompt('URL da imagem:');
    const caption = prompt('Legenda (opcional):');
    if (session && phone && image) {
      try {
        const res = await fetch(`${API_URL}/whatsapp/send-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, phone, image, caption })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Imagem enviada! Detalhes: ' + JSON.stringify(data));
        } else {
          alert('Erro ao enviar imagem: ' + (data.details || res.status));
        }
      } catch (err) {
        alert('Erro ao conectar com o backend: ' + err.message);
      }
    }
  };

  // Função para enviar arquivo
  const handleSendFile = async () => {
    const session = prompt('ID da sessão WhatsApp:');
    const phone = prompt('Número do destinatário (com DDI):');
    const file = prompt('URL do arquivo:');
    const filename = prompt('Nome do arquivo:');
    if (session && phone && file && filename) {
      try {
        const res = await fetch(`${API_URL}/whatsapp/send-file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, phone, file, filename })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Arquivo enviado! Detalhes: ' + JSON.stringify(data));
        } else {
          alert('Erro ao enviar arquivo: ' + (data.details || res.status));
        }
      } catch (err) {
        alert('Erro ao conectar com o backend: ' + err.message);
      }
    }
  };

  // Função para enviar sticker
  const handleSendSticker = async () => {
    const session = prompt('ID da sessão WhatsApp:');
    const phone = prompt('Número do destinatário (com DDI):');
    const sticker = prompt('URL do sticker:');
    if (session && phone && sticker) {
      try {
        const res = await fetch(`${API_URL}/whatsapp/send-sticker`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, phone, sticker })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Sticker enviado! Detalhes: ' + JSON.stringify(data));
        } else {
          alert('Erro ao enviar sticker: ' + (data.details || res.status));
        }
      } catch (err) {
        alert('Erro ao conectar com o backend: ' + err.message);
      }
    }
  };

  // Função para enviar contato
  const handleSendContact = async () => {
    const session = prompt('ID da sessão WhatsApp:');
    const phone = prompt('Número do destinatário (com DDI):');
    const contact = prompt('Contato (JSON):');
    if (session && phone && contact) {
      try {
        const res = await fetch(`${API_URL}/whatsapp/send-contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, phone, contact: JSON.parse(contact) })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Contato enviado! Detalhes: ' + JSON.stringify(data));
        } else {
          alert('Erro ao enviar contato: ' + (data.details || res.status));
        }
      } catch (err) {
        alert('Erro ao conectar com o backend: ' + err.message);
      }
    }
  };

  // Função para enviar localização
  const handleSendLocation = async () => {
    const session = prompt('ID da sessão WhatsApp:');
    const phone = prompt('Número do destinatário (com DDI):');
    const latitude = prompt('Latitude:');
    const longitude = prompt('Longitude:');
    const description = prompt('Descrição (opcional):');
    if (session && phone && latitude && longitude) {
      try {
        const res = await fetch(`${API_URL}/whatsapp/send-location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, phone, latitude, longitude, description })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Localização enviada! Detalhes: ' + JSON.stringify(data));
        } else {
          alert('Erro ao enviar localização: ' + (data.details || res.status));
        }
      } catch (err) {
        alert('Erro ao conectar com o backend: ' + err.message);
      }
    }
  };

  // Function to export WhatsApp data
  const handleExportData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/platforms/whatsapp/export`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whatsapp-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('Erro ao exportar dados do servidor');
      }
    } catch (error) {
      console.error('Error exporting WhatsApp data:', error);
      alert('Erro ao exportar dados do WhatsApp');
    }
  };

  // Function to handle new message creation
  const handleNewMessage = async () => {
    const phoneNumber = prompt('Digite o número do destinatário (com código do país):');
    if (phoneNumber) {
      const message = prompt('Digite a mensagem:');
      if (message) {
        try {
          const response = await fetch(`${API_URL}/api/platforms/whatsapp/send-message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              phone_number: phoneNumber,
              message: message
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            alert(`Mensagem enviada com sucesso!\nPara: ${result.phone_number}\nStatus: ${result.status}`);
          } else {
            throw new Error('Erro ao enviar mensagem');
          }
        } catch (error) {
          console.error('Error sending message:', error);
          alert('Erro ao enviar mensagem via WhatsApp');
        }
      }
    }
  };

  // Function to handle filters
  const handleFilter = () => {
    alert('Modal de filtros será implementado em breve.\n\nFiltros disponíveis:\n- Status da conversa\n- Período\n- Campanha\n- Agente IA');
  };
  const [conversations, setConversations] = useState([]);
  const [metrics, setMetrics] = useState({
    totalMessages: 1247,
    activeConversations: 89,
    responseRate: 94.2,
    averageResponseTime: '2.3 min',
    conversions: 23,
    conversionRate: 25.8
  });

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Black Friday 2024',
      status: 'active',
      messages: 342,
      responses: 298,
      conversions: 12,
      lastActivity: '2 min atrás'
    },
    {
      id: 2,
      name: 'Lançamento Produto X',
      status: 'paused',
      messages: 156,
      responses: 134,
      conversions: 8,
      lastActivity: '1 hora atrás'
    },
    {
      id: 3,
      name: 'Nutrição de Leads',
      status: 'active',
      messages: 89,
      responses: 76,
      conversions: 3,
      lastActivity: '15 min atrás'
    }
  ]);

  const [recentConversations] = useState([
    {
      id: 1,
      customerName: 'Maria Silva',
      customerPhone: '+55 11 99999-9999',
      lastMessage: 'Gostaria de saber mais sobre o produto',
      timestamp: '14:32',
      status: 'unread',
      campaign: 'Black Friday 2024',
      stage: 'interest',
      aiAgent: true
    },
    {
      id: 2,
      customerName: 'João Santos',
      customerPhone: '+55 11 88888-8888',
      lastMessage: 'Qual o prazo de entrega?',
      timestamp: '14:15',
      status: 'responded',
      campaign: 'Lançamento Produto X',
      stage: 'consideration',
      aiAgent: true
    },
    {
      id: 3,
      customerName: 'Ana Costa',
      customerPhone: '+55 11 77777-7777',
      lastMessage: 'Obrigada pelas informações!',
      timestamp: '13:45',
      status: 'read',
      campaign: 'Nutrição de Leads',
      stage: 'satisfied',
      aiAgent: false
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'awareness': return 'text-blue-600 bg-blue-100';
      case 'interest': return 'text-purple-600 bg-purple-100';
      case 'consideration': return 'text-orange-600 bg-orange-100';
      case 'purchase': return 'text-green-600 bg-green-100';
      case 'satisfied': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mensagens Enviadas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalMessages.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Conversas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeConversations}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8%</span>
            <span className="text-gray-500 ml-1">vs. semana anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Resposta</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.responseRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageResponseTime}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
            <span className="text-red-600">-15s</span>
            <span className="text-gray-500 ml-1">vs. semana anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversions}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
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
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+2.1%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Campanhas Ativas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Campanhas Ativas no WhatsApp</h3>
          <button className="text-primary hover:text-blue-700 text-sm font-medium">
            Ver todas
          </button>
        </div>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">Última atividade: {campaign.lastActivity}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{campaign.messages}</p>
                  <p className="text-xs text-gray-500">Mensagens</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{campaign.responses}</p>
                  <p className="text-xs text-gray-500">Respostas</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{campaign.conversions}</p>
                  <p className="text-xs text-gray-500">Conversões</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status === 'active' ? 'Ativa' : 'Pausada'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConversations = () => (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todas as conversas</option>
              <option value="unread">Não lidas</option>
              <option value="ai">Gerenciadas por IA</option>
              <option value="manual">Manuais</option>
            </select>
            <button 
              onClick={() => handleFilter()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Conversas Recentes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentConversations.map((conversation) => (
            <div key={conversation.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    {conversation.aiAgent && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{conversation.customerName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(conversation.stage)}`}>
                        {conversation.stage === 'interest' && 'Interesse'}
                        {conversation.stage === 'consideration' && 'Consideração'}
                        {conversation.stage === 'satisfied' && 'Satisfeito'}
                      </span>
                      {conversation.aiAgent && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          IA
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{conversation.customerPhone}</p>
                    <p className="text-sm text-gray-800">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">Campanha: {conversation.campaign}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{conversation.timestamp}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {conversation.status === 'unread' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {conversation.status === 'responded' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {conversation.status === 'read' && (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-500 ml-1">
                        {conversation.status === 'unread' && 'Não lida'}
                        {conversation.status === 'responded' && 'Respondida'}
                        {conversation.status === 'read' && 'Lida'}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Detalhado - WhatsApp</h3>
        
        {/* Gráfico de Performance */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Gráfico de performance das campanhas</p>
            <p className="text-sm text-gray-500">Mensagens enviadas vs. Respostas recebidas</p>
          </div>
        </div>

        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Taxa de Entrega</p>
            <p className="text-2xl font-bold text-blue-600">98.7%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">Taxa de Abertura</p>
            <p className="text-2xl font-bold text-green-600">89.3%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-900">Engajamento</p>
            <p className="text-2xl font-bold text-purple-600">67.8%</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-900">Tempo Médio de Sessão</p>
            <p className="text-2xl font-bold text-orange-600">4.2 min</p>
          </div>
        </div>
      </div>

      {/* Relatórios de IA */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Relatório de IA</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Interações Automatizadas</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">847</p>
            <p className="text-sm text-gray-500">76% do total de interações</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Satisfação do Cliente</h4>
            <p className="text-2xl font-bold text-green-600 mb-1">4.8/5</p>
            <p className="text-sm text-gray-500">Baseado em 234 avaliações</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Tempo de Resolução</h4>
            <p className="text-2xl font-bold text-purple-600 mb-1">1.8 min</p>
            <p className="text-sm text-gray-500">Média para respostas da IA</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações do WhatsApp</h3>
        
        <div className="space-y-6">
          {/* API Configuration */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configuração da API</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token da API do WhatsApp
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Insira seu token da API"
                  value={whatsappToken}
                  onChange={e => setWhatsappToken(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do WhatsApp Business
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+55 11 99999-9999"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configuração de Webhook</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Webhook
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://sua-api.com/webhook"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token de Verificação
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Token de verificação"
                  value={verificationToken}
                  onChange={e => setVerificationToken(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configurações de IA</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Respostas Automáticas</p>
                  <p className="text-sm text-gray-500">Permitir que a IA responda automaticamente</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoReply}
                    onChange={e => setAutoReply(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Aprendizado Contínuo</p>
                  <p className="text-sm text-gray-500">IA aprende com as interações</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={continuousLearning}
                    onChange={e => setContinuousLearning(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleSaveSettings}
            >
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
          <div className="p-3 bg-green-100 rounded-lg">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Business</h1>
            <p className="text-gray-600">Gerencie suas campanhas e conversas no WhatsApp</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <button
            onClick={handleStartSession}
            className="flex items-center gap-2 px-4 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Iniciar Sessão
          </button>
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Enviar Mensagem
          </button>
          <button
            onClick={handleSendImage}
            className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Enviar Imagem
          </button>
          <button
            onClick={handleSendFile}
            className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Enviar Arquivo
          </button>
          <button
            onClick={handleSendSticker}
            className="flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Enviar Sticker
          </button>
          <button
            onClick={handleSendContact}
            className="flex items-center gap-2 px-4 py-2 border border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Enviar Contato
          </button>
          <button
            onClick={handleSendLocation}
            className="flex items-center gap-2 px-4 py-2 border border-orange-400 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Enviar Localização
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'conversations', label: 'Conversas', icon: MessageSquare },
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
      {activeTab === 'conversations' && renderConversations()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default WhatsAppManager;

