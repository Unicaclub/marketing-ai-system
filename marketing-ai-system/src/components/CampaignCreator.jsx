import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  UserPlus,
  Smartphone,
  ShoppingCart,
  Upload,
  Image,
  Video,
  FileText,
  Calendar,
  DollarSign,
  Globe,
  MessageSquare,
  Instagram,
  Facebook,
  Bot,
  Zap,
  Save,
  Play
} from 'lucide-react';


const CampaignCreator = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    objective: '',
    platforms: [],
    targetAudience: {
      ageRange: [18, 65],
      gender: 'all',
      location: '',
      interests: []
    },
    budget: {
      type: 'daily',
      amount: 100,
      duration: 7
    },
    content: {
      headline: '',
      description: '',
      callToAction: '',
      media: []
    },
    schedule: {
      startDate: '',
      endDate: '',
      timezone: 'America/Sao_Paulo'
    },
    salesStrategy: null,
    productDatabase: null
  });

  // Handlers de upload de mídia (deve ficar logo após os hooks de estado)
  const fileInputRef = useRef(null);
  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    setCampaignData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        media: files
      }
    }));
  };
  const handleSelectFilesClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const campaignObjectives = [
    {
      id: 'brand_awareness',
      title: 'Reconhecimento da Marca',
      description: 'Aumentar a visibilidade e conhecimento da sua marca',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      id: 'traffic',
      title: 'Tráfego',
      description: 'Direcionar visitantes para seu site ou landing page',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      id: 'engagement',
      title: 'Engajamento',
      description: 'Aumentar curtidas, comentários e compartilhamentos',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      id: 'leads',
      title: 'Geração de Leads',
      description: 'Capturar informações de contato de potenciais clientes',
      icon: <UserPlus className="w-8 h-8" />,
      color: 'bg-orange-500'
    },
    {
      id: 'app_promotion',
      title: 'Promoção de App',
      description: 'Aumentar downloads e instalações do seu aplicativo',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'sales',
      title: 'Vendas',
      description: 'Converter leads em vendas com IA automatizada',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'bg-red-500',
      special: true
    }
  ];

  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      color: 'text-pink-600'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Video className="w-6 h-6" />,
      color: 'text-black'
    }
  ];

  const salesStrategies = [
    {
      id: 'consultative',
      title: 'Venda Consultiva',
      description: 'Abordagem personalizada com foco em necessidades específicas',
      features: ['Qualificação detalhada', 'Apresentação personalizada', 'Follow-up inteligente']
    },
    {
      id: 'direct',
      title: 'Venda Direta',
      description: 'Abordagem direta com foco em conversão rápida',
      features: ['Oferta imediata', 'Urgência e escassez', 'Fechamento rápido']
    },
    {
      id: 'nurturing',
      title: 'Nutrição de Leads',
      description: 'Educação gradual até a decisão de compra',
      features: ['Conteúdo educativo', 'Relacionamento longo prazo', 'Conversão gradual']
    },
    {
      id: 'upsell',
      title: 'Upsell/Cross-sell',
      description: 'Maximizar valor por cliente existente',
      features: ['Ofertas complementares', 'Upgrades', 'Produtos relacionados']
    }
  ];

  const updateCampaignData = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedData = (parent, field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const togglePlatform = (platformId) => {
    setCampaignData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(campaignData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 6 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-primary' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Básicas</h2>
        <p className="text-gray-600">Defina o nome e objetivo da sua campanha</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Campanha
        </label>
        <input
          type="text"
          value={campaignData.name}
          onChange={(e) => updateCampaignData('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ex: Black Friday 2024"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Objetivo da Campanha
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaignObjectives.map((objective) => (
            <div
              key={objective.id}
              onClick={() => updateCampaignData('objective', objective.id)}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                campaignData.objective === objective.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${objective.special ? 'ring-2 ring-yellow-300' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg text-white ${objective.color}`}>
                  {objective.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {objective.title}
                    {objective.special && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        IA
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{objective.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plataformas</h2>
        <p className="text-gray-600">Escolha onde sua campanha será executada</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              campaignData.platforms.includes(platform.id)
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={platform.color}>
                {platform.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-600">
                  {platform.id === 'whatsapp' && 'Mensagens diretas e automação'}
                  {platform.id === 'instagram' && 'Posts, stories e reels'}
                  {platform.id === 'facebook' && 'Feed, stories e anúncios'}
                  {platform.id === 'tiktok' && 'Vídeos virais e trends'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Público-Alvo</h2>
        <p className="text-gray-600">Defina quem você quer alcançar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faixa Etária
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={campaignData.targetAudience.ageRange[0]}
              onChange={(e) => updateNestedData('targetAudience', 'ageRange', [parseInt(e.target.value), campaignData.targetAudience.ageRange[1]])}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="13"
              max="65"
            />
            <span className="text-gray-500">até</span>
            <input
              type="number"
              value={campaignData.targetAudience.ageRange[1]}
              onChange={(e) => updateNestedData('targetAudience', 'ageRange', [campaignData.targetAudience.ageRange[0], parseInt(e.target.value)])}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="13"
              max="65"
            />
            <span className="text-gray-500">anos</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gênero
          </label>
          <select
            value={campaignData.targetAudience.gender}
            onChange={(e) => updateNestedData('targetAudience', 'gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <input
            type="text"
            value={campaignData.targetAudience.location}
            onChange={(e) => updateNestedData('targetAudience', 'location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: São Paulo, SP ou Brasil"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interesses (separados por vírgula)
          </label>
          <textarea
            value={campaignData.targetAudience.interests.join(', ')}
            onChange={(e) => updateNestedData('targetAudience', 'interests', e.target.value.split(', ').filter(i => i.trim()))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="Ex: tecnologia, marketing digital, empreendedorismo"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Orçamento</h2>
        <p className="text-gray-600">Configure o investimento da campanha</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Orçamento
          </label>
          <select
            value={campaignData.budget.type}
            onChange={(e) => updateNestedData('budget', 'type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="daily">Diário</option>
            <option value="total">Total da Campanha</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$)
          </label>
          <input
            type="number"
            value={campaignData.budget.amount}
            onChange={(e) => updateNestedData('budget', 'amount', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min="10"
            step="10"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duração (dias)
          </label>
          <input
            type="number"
            value={campaignData.budget.duration}
            onChange={(e) => updateNestedData('budget', 'duration', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min="1"
            max="365"
          />
        </div>

        <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Estimativa de Investimento</span>
          </div>
          <div className="text-sm text-blue-700">
            <p>Orçamento {campaignData.budget.type === 'daily' ? 'diário' : 'total'}: R$ {campaignData.budget.amount.toLocaleString()}</p>
            <p>Duração: {campaignData.budget.duration} dias</p>
            <p className="font-medium">
              Total estimado: R$ {(campaignData.budget.type === 'daily' 
                ? campaignData.budget.amount * campaignData.budget.duration 
                : campaignData.budget.amount).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conteúdo</h2>
        <p className="text-gray-600">Crie o conteúdo da sua campanha</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título Principal
          </label>
          <input
            type="text"
            value={campaignData.content.headline}
            onChange={(e) => updateNestedData('content', 'headline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Transforme seu negócio com IA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={campaignData.content.description}
            onChange={(e) => updateNestedData('content', 'description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="4"
            placeholder="Descreva sua oferta, benefícios e diferenciais..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call to Action
          </label>
          <input
            type="text"
            value={campaignData.content.callToAction}
            onChange={(e) => updateNestedData('content', 'callToAction', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Saiba Mais, Compre Agora, Cadastre-se"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mídia
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-500">Suporte para imagens, vídeos e documentos</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleMediaSelect}
            />
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleSelectFilesClick}
            >
              Selecionar Arquivos
            </button>
            {campaignData.content.media && campaignData.content.media.length > 0 && (
              <div className="mt-4 text-left">
                <p className="text-sm font-medium mb-2">Arquivos selecionados:</p>
                <ul className="text-xs text-gray-700">
                  {campaignData.content.media.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {campaignData.objective === 'sales' && (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">IA de Vendas Ativada</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              Para campanhas de vendas, nossa IA irá gerar automaticamente variações do conteúdo 
              otimizadas para conversão e personalizar as mensagens para cada lead.
            </p>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Configurar IA de Vendas
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {campaignData.objective === 'sales' ? 'Estratégia de Vendas' : 'Agendamento'}
        </h2>
        <p className="text-gray-600">
          {campaignData.objective === 'sales' 
            ? 'Configure a estratégia de vendas com IA'
            : 'Defina quando sua campanha será executada'
          }
        </p>
      </div>

      {campaignData.objective === 'sales' ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Escolha a Estratégia de Vendas
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salesStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  onClick={() => updateCampaignData('salesStrategy', strategy.id)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    campaignData.salesStrategy === strategy.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{strategy.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {strategy.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Upload de Base de Produtos</h3>
            </div>
            <p className="text-green-700 mb-4">
              Faça upload da sua base de produtos/serviços para que a IA possa personalizar as vendas.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Fazer Upload da Base
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início
            </label>
            <input
              type="datetime-local"
              value={campaignData.schedule.startDate}
              onChange={(e) => updateNestedData('schedule', 'startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Término
            </label>
            <input
              type="datetime-local"
              value={campaignData.schedule.endDate}
              onChange={(e) => updateNestedData('schedule', 'endDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              value={campaignData.schedule.timezone}
              onChange={(e) => updateNestedData('schedule', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">Nova York (GMT-5)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Nova Campanha</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          {renderStepIndicator()}
        </div>

        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar Rascunho
            </button>

            {currentStep === 6 ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                Criar Campanha
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;

