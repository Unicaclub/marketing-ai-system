import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Key,
  Shield,
  Zap,
  MessageSquare,
  Instagram,
  Facebook,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  Globe,
  Smartphone
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://marketing-ai-system-production.up.railway.app/api';
const Config = () => {
  // Dark mode
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('integrations');
  const [showApiKeys, setShowApiKeys] = useState({});
  const [integrations, setIntegrations] = useState({
    whatsapp: {
      enabled: false,
      apiKey: '',
      webhookUrl: '',
      status: 'disconnected'
    },
    instagram: {
      enabled: true,
      apiKey: '',
      accessToken: '',
      status: 'connected'
    },
    facebook: {
      enabled: true,
      apiKey: '',
      appSecret: '',
      status: 'connected'
    },
    openai: {
      enabled: true,
      apiKey: '',
      model: 'gpt-4',
      status: 'connected'
    }
  });

  // Estado do agente global de vendas
  const [salesAgent, setSalesAgent] = useState({ active: false, platforms: [], products: [], agent_id: null });
  const [allProducts, setAllProducts] = useState([]);
  const [loadingAgent, setLoadingAgent] = useState(false);

  // Buscar status do agente e produtos ao carregar
  useEffect(() => {
    if (!user) return;
    setLoadingAgent(true);
    // Buscar status/configuração do agente
    fetch(`${API_URL}/sales_agent/${user.id}`)
      .then(res => res.json())
      .then(data => setSalesAgent(data))
      .finally(() => setLoadingAgent(false));
    // Buscar produtos do usuário
    fetch(`${API_URL}/product_database?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setAllProducts(data));
  }, [user]);
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/user_api_keys/${user.id}`);
        if (res.ok) {
          const keys = await res.json();
          setIntegrations(prev => {
            const updated = { ...prev };
            keys.forEach(k => {
              if (updated[k.service]) {
                updated[k.service].apiKey = k.api_key;
              }
            });
            return updated;
          });
        }
      } catch (err) {
        // erro silencioso
      }
    };
    fetchApiKeys();
  }, [user]);

  const [notifications, setNotifications] = useState({
    campaignUpdates: true,
    performanceAlerts: true,
    weeklyReports: false,
    budgetAlerts: true,
    emailNotifications: true,
    pushNotifications: false
  });

  const [generalSettings, setGeneralSettings] = useState({
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    autoOptimization: true,
    dataRetention: '12months'
  });

  const toggleShowApiKey = (service) => {
    setShowApiKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const updateIntegration = (service, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const updateNotification = (setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const updateGeneralSetting = (setting, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'integrations', name: 'Integrações', icon: <Zap className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notificações', icon: <Bell className="w-5 h-5" /> },
    { id: 'general', name: 'Geral', icon: <Settings className="w-5 h-5" /> },
    { id: 'appearance', name: 'Aparência', icon: <Globe className="w-5 h-5" /> }
  ];

  const IntegrationCard = ({ service, config, icon, title, description }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(config.status)}`}>
          {getStatusIcon(config.status)}
          {config.status === 'connected' ? 'Conectado' : 'Desconectado'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Ativar integração</label>
          <button
            onClick={() => updateIntegration(service, 'enabled', !config.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.enabled ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {config.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKeys[service] ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => updateIntegration(service, 'apiKey', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Insira sua API key"
                />
                <button
                  type="button"
                  onClick={() => toggleShowApiKey(service)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showApiKeys[service] ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {service === 'whatsapp' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={config.webhookUrl}
                  onChange={(e) => updateIntegration(service, 'webhookUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://sua-url-webhook.com"
                />
              </div>
            )}

            {service === 'openai' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <select
                  value={config.model}
                  onChange={(e) => updateIntegration(service, 'model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Configure integrações, notificações e preferências do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tema do Sistema</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Escolha entre modo claro ou escuro para a interface.</p>
              <div className="flex items-center gap-4">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
                  onClick={() => setTheme('light')}
                >
                  Claro
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme === 'dark' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
                  onClick={() => setTheme('dark')}
                >
                  Escuro
                </button>
              </div>
            </div>
          )}
          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrações de Plataforma</h3>
                <p className="text-gray-600 mb-6">
                  Configure as conexões com WhatsApp, Instagram, Facebook e outros serviços
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IntegrationCard
                  service="whatsapp"
                  config={integrations.whatsapp}
                  icon={<MessageSquare className="w-6 h-6 text-green-600" />}
                  title="WhatsApp Business"
                  description="Integração com WhatsApp Business API"
                />

                <IntegrationCard
                  service="instagram"
                  config={integrations.instagram}
                  icon={<Instagram className="w-6 h-6 text-pink-600" />}
                  title="Instagram"
                  description="Conecte sua conta do Instagram"
                />

                <IntegrationCard
                  service="facebook"
                  config={integrations.facebook}
                  icon={<Facebook className="w-6 h-6 text-blue-600" />}
                  title="Facebook"
                  description="Integração com Facebook Ads"
                />

                <IntegrationCard
                  service="openai"
                  config={integrations.openai}
                  icon={<Shield className="w-6 h-6 text-purple-600" />}
                  title="OpenAI"
                  description="IA para geração de conteúdo"
                />
              </div>

              {/* Painel do Agente Global de Vendas */}
              <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Agente Global de Vendas</h3>
                <p className="text-blue-700 mb-4">Configure o agente especialista em conversão para atuar nas plataformas e produtos desejados.</p>
                {loadingAgent ? (
                  <div className="text-blue-600">Carregando configurações do agente...</div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block font-medium text-gray-700 mb-2">Ativar nas plataformas:</label>
                      <div className="flex gap-4">
                        {['whatsapp', 'instagram', 'facebook'].map(platform => (
                          <label key={platform} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={salesAgent.platforms?.includes(platform)}
                              onChange={e => {
                                const newPlatforms = e.target.checked
                                  ? [...(salesAgent.platforms || []), platform]
                                  : (salesAgent.platforms || []).filter(p => p !== platform);
                                setSalesAgent(sa => ({ ...sa, platforms: newPlatforms }));
                              }}
                            />
                            <span className="capitalize">{platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block font-medium text-gray-700 mb-2">Produtos para o agente vender:</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allProducts.length === 0 && <span className="text-gray-500">Nenhum produto cadastrado.</span>}
                        {allProducts.map(prod => (
                          <label key={prod.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={salesAgent.products?.includes(prod.id)}
                              onChange={e => {
                                const newProducts = e.target.checked
                                  ? [...(salesAgent.products || []), prod.id]
                                  : (salesAgent.products || []).filter(pid => pid !== prod.id);
                                setSalesAgent(sa => ({ ...sa, products: newProducts }));
                              }}
                            />
                            <span>{prod.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button
                      className="px-6 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                      onClick={async () => {
                        if (!user) return;
                        // Ativar/criar agente
                        let agentId = salesAgent.agent_id;
                        if (!agentId) {
                          const res = await fetch(`${API_URL}/sales_agent`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: user.id })
                          });
                          const data = await res.json();
                          agentId = data.agent_id;
                          setSalesAgent(sa => ({ ...sa, agent_id: agentId, active: true }));
                        }
                        // Salvar plataformas
                        await fetch(`${API_URL}/sales_agent/${agentId}/platforms`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ platforms: (salesAgent.platforms || []).map(p => ({ platform: p, active: true })) })
                        });
                        // Salvar produtos
                        await fetch(`${API_URL}/sales_agent/${agentId}/products`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ product_ids: salesAgent.products || [] })
                        });
                        alert('Configurações do agente de vendas salvas!');
                      }}
                    >
                      Salvar Configurações do Agente
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferências de Notificação</h3>
                <p className="text-gray-600 mb-6">
                  Escolha como e quando receber notificações sobre suas campanhas
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Notificações de Campanha</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Atualizações de campanha</div>
                        <div className="text-sm text-gray-500">Receba notificações quando campanhas forem atualizadas</div>
                      </div>
                      <button
                        onClick={() => updateNotification('campaignUpdates', !notifications.campaignUpdates)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.campaignUpdates ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.campaignUpdates ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Alertas de performance</div>
                        <div className="text-sm text-gray-500">Seja notificado sobre mudanças significativas na performance</div>
                      </div>
                      <button
                        onClick={() => updateNotification('performanceAlerts', !notifications.performanceAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.performanceAlerts ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.performanceAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Alertas de orçamento</div>
                        <div className="text-sm text-gray-500">Receba avisos quando o orçamento estiver próximo do limite</div>
                      </div>
                      <button
                        onClick={() => updateNotification('budgetAlerts', !notifications.budgetAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.budgetAlerts ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.budgetAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Relatórios</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Relatórios semanais</div>
                        <div className="text-sm text-gray-500">Receba um resumo semanal das suas campanhas</div>
                      </div>
                      <button
                        onClick={() => updateNotification('weeklyReports', !notifications.weeklyReports)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.weeklyReports ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações Gerais</h3>
                <p className="text-gray-600 mb-6">
                  Personalize as configurações básicas do sistema
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Fuso Horário
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => updateGeneralSetting('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                      <option value="America/New_York">Nova York (GMT-5)</option>
                      <option value="Europe/London">Londres (GMT+0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moeda
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => updateGeneralSetting('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="BRL">Real Brasileiro (R$)</option>
                      <option value="USD">Dólar Americano ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => updateGeneralSetting('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato de Data
                    </label>
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) => updateGeneralSetting('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retenção de Dados
                    </label>
                    <select
                      value={generalSettings.dataRetention}
                      onChange={(e) => updateGeneralSetting('dataRetention', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="3months">3 meses</option>
                      <option value="6months">6 meses</option>
                      <option value="12months">12 meses</option>
                      <option value="24months">24 meses</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Otimização Automática</div>
                      <div className="text-sm text-gray-500">Permitir que a IA otimize campanhas automaticamente</div>
                    </div>
                    <button
                      onClick={() => updateGeneralSetting('autoOptimization', !generalSettings.autoOptimization)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        generalSettings.autoOptimization ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          generalSettings.autoOptimization ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          onClick={async () => {
            if (!user) {
              alert('Faça login para salvar suas configurações.');
              return;
            }
            try {
              // Salvar API Keys de cada integração
              for (const service of Object.keys(integrations)) {
                if (integrations[service].apiKey) {
                  await fetch(`${API_URL}/user_api_keys`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      user_id: user.id,
                      service,
                      api_key: integrations[service].apiKey
                    })
                  });
                }
              }
              alert('Configurações salvas com sucesso!');
            } catch (err) {
              alert('Erro ao conectar com o backend: ' + err.message);
            }
          }}
        >
          <Save className="w-5 h-5" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default Config;

