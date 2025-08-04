import React, { useState } from 'react';
import {
  Instagram,
  Heart,
  MessageCircle,
  Share,
  Eye,
  TrendingUp,
  Users,
  Image,
  Video,
  Calendar,
  Settings,
  Plus,
  BarChart3,
  Clock,
  Target,
  Zap,
  Upload,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';

const InstagramManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [instagramSettings, setInstagramSettings] = useState({
    username: '',
    accessToken: '',
    autoPost: true,
    autoStories: false,
    defaultHashtags: ''
  });

  // Function to handle file upload
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        console.log('Files selected:', files.map(f => f.name));
        alert(`${files.length} arquivo(s) selecionado(s).\nFuncionalidade de upload será implementada em breve.`);
      }
    };
    input.click();
  };

  // Function to create new Instagram post
  const handleNewPost = async () => {
    const caption = prompt('Digite a legenda do post:');
    if (caption) {
      const hashtags = prompt('Digite as hashtags (separadas por espaço):') || '';
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_URL}/api/platforms/instagram/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            caption: caption,
            hashtags: hashtags.split(' ').filter(h => h.length > 0),
            media: [], // In a real app, this would handle file uploads
            location: null
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(`Post do Instagram criado com sucesso!\nID: ${result.post.id}\nStatus: ${result.post.status}`);
        } else {
          throw new Error('Erro ao criar post');
        }
      } catch (error) {
        console.error('Error creating Instagram post:', error);
        alert('Erro ao criar post no Instagram');
      }
    }
  };

  // Function to create new Instagram story
  const handleNewStory = async () => {
    const textOverlay = prompt('Digite o texto do story (opcional):') || '';
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/platforms/instagram/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text_overlay: textOverlay,
          media: [], // In a real app, this would handle file uploads
          stickers: []
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Story do Instagram criado com sucesso!\nID: ${result.story.id}\nStatus: ${result.story.status}`);
      } else {
        throw new Error('Erro ao criar story');
      }
    } catch (error) {
      console.error('Error creating Instagram story:', error);
      alert('Erro ao criar story no Instagram');
    }
  };

  // Function to schedule posts
  const handleSchedule = () => {
    alert('Calendário de agenda será aberto.\n\nRecursos:\n- Visualização mensal\n- Agendamento de posts\n- Melhores horários\n- Fila de publicação');
  };

  // Function to save Instagram settings
  const handleSaveInstagramSettings = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/platforms/instagram/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(instagramSettings)
      });
      
      if (response.ok) {
        alert('Configurações do Instagram salvas com sucesso!');
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving Instagram settings:', error);
      alert('Erro ao salvar configurações do Instagram');
    }
  };

  const metrics = {
    followers: 15420,
    engagement: 8.7,
    reach: 45230,
    impressions: 89450,
    profileVisits: 2340,
    websiteClicks: 567
  };

  const posts = [
    {
      id: 1,
      type: 'image',
      caption: 'Transforme seu negócio com nossa nova solução de IA! 🚀',
      likes: 234,
      comments: 45,
      shares: 12,
      reach: 3420,
      engagement: 9.2,
      timestamp: '2 horas atrás',
      campaign: 'Black Friday 2024',
      status: 'published'
    },
    {
      id: 2,
      type: 'video',
      caption: 'Veja como nossos clientes estão obtendo resultados incríveis! 📈',
      likes: 567,
      comments: 89,
      shares: 34,
      reach: 8950,
      engagement: 12.4,
      timestamp: '1 dia atrás',
      campaign: 'Casos de Sucesso',
      status: 'published'
    },
    {
      id: 3,
      type: 'carousel',
      caption: 'Dicas essenciais para marketing digital em 2024 💡',
      likes: 189,
      comments: 23,
      shares: 8,
      reach: 2340,
      engagement: 7.8,
      timestamp: '3 dias atrás',
      campaign: 'Conteúdo Educativo',
      status: 'published'
    }
  ];

  const stories = [
    {
      id: 1,
      type: 'image',
      views: 1234,
      replies: 23,
      timestamp: '4 horas atrás',
      campaign: 'Black Friday 2024'
    },
    {
      id: 2,
      type: 'video',
      views: 2456,
      replies: 45,
      timestamp: '8 horas atrás',
      campaign: 'Lançamento Produto'
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Black Friday 2024',
      status: 'active',
      posts: 12,
      reach: 45230,
      engagement: 8.7,
      budget: 2500,
      spent: 1890,
      conversions: 23
    },
    {
      id: 2,
      name: 'Lançamento Produto X',
      status: 'paused',
      posts: 8,
      reach: 23450,
      engagement: 6.4,
      budget: 1500,
      spent: 1200,
      conversions: 15
    },
    {
      id: 3,
      name: 'Conteúdo Educativo',
      status: 'active',
      posts: 15,
      reach: 12340,
      engagement: 9.2,
      budget: 800,
      spent: 650,
      conversions: 8
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

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'carousel': return <Image className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seguidores</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.followers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5.2%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Engajamento</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.engagement}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+1.3%</span>
            <span className="text-gray-500 ml-1">vs. semana anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alcance</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.reach.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Impressões</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.impressions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
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
              <p className="text-sm font-medium text-gray-600">Visitas ao Perfil</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.profileVisits.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15%</span>
            <span className="text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cliques no Site</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.websiteClicks}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+22%</span>
            <span className="text-gray-500 ml-1">vs. semana anterior</span>
          </div>
        </div>
      </div>

      {/* Campanhas Ativas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Campanhas Ativas no Instagram</h3>
          <button className="text-primary hover:text-blue-700 text-sm font-medium">
            Ver todas
          </button>
        </div>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Instagram className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">{campaign.posts} posts publicados</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{campaign.reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Alcance</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{campaign.engagement}%</p>
                  <p className="text-xs text-gray-500">Engajamento</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">R$ {campaign.spent}</p>
                  <p className="text-xs text-gray-500">Gasto</p>
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

      {/* Stories Recentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Stories Recentes</h3>
          <button 
            onClick={() => handleNewStory()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Story
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((story) => (
            <div key={story.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPostTypeIcon(story.type)}
                  <span className="text-sm font-medium text-gray-900">
                    {story.type === 'image' ? 'Imagem' : 'Vídeo'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{story.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{story.views}</p>
                    <p className="text-xs text-gray-500">Visualizações</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{story.replies}</p>
                    <p className="text-xs text-gray-500">Respostas</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{story.campaign}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar posts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos os posts</option>
              <option value="image">Imagens</option>
              <option value="video">Vídeos</option>
              <option value="carousel">Carrossel</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleSchedule()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agendar
            </button>
            <button 
              onClick={() => handleNewPost()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Post
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Posts Publicados</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    {getPostTypeIcon(post.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {post.type === 'image' && 'Imagem'}
                        {post.type === 'video' && 'Vídeo'}
                        {post.type === 'carousel' && 'Carrossel'}
                      </span>
                      <span className="text-xs text-gray-500">{post.timestamp}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        Publicado
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{post.caption}</p>
                    <p className="text-xs text-gray-500">Campanha: {post.campaign}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-900">{post.likes}</span>
                  </div>
                  <p className="text-xs text-gray-500">Curtidas</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">{post.comments}</span>
                  </div>
                  <p className="text-xs text-gray-500">Comentários</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Share className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">{post.shares}</span>
                  </div>
                  <p className="text-xs text-gray-500">Compartilhamentos</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900">{post.reach}</span>
                  </div>
                  <p className="text-xs text-gray-500">Alcance</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-900">{post.engagement}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Engajamento</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Detalhado - Instagram</h3>
        
        {/* Gráfico de Performance */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Gráfico de crescimento de seguidores</p>
            <p className="text-sm text-gray-500">Últimos 30 dias</p>
          </div>
        </div>

        {/* Métricas de Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-sm font-medium text-pink-900">Posts Mais Curtidos</p>
            <p className="text-2xl font-bold text-pink-600">567</p>
            <p className="text-xs text-pink-700">Média de curtidas</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Melhor Horário</p>
            <p className="text-2xl font-bold text-blue-600">19h</p>
            <p className="text-xs text-blue-700">Para publicar</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-900">Hashtags Top</p>
            <p className="text-2xl font-bold text-purple-600">#marketing</p>
            <p className="text-xs text-purple-700">Mais engajamento</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">Taxa de Salvamento</p>
            <p className="text-2xl font-bold text-green-600">4.2%</p>
            <p className="text-xs text-green-700">Dos posts</p>
          </div>
        </div>

        {/* Análise de Audiência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Demografia da Audiência</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">18-24 anos</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-2 bg-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">25-34 anos</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/2 h-2 bg-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">28%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">35-44 anos</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/3 h-2 bg-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">22%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Localização da Audiência</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">São Paulo, SP</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rio de Janeiro, RJ</span>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Belo Horizonte, MG</span>
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outros</span>
                <span className="text-sm font-medium">28%</span>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Instagram</h3>
        
        <div className="space-y-6">
          {/* Configuração da Conta */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Conta do Instagram</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="@seuusuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token de Acesso
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Token da API do Instagram"
                />
              </div>
            </div>
          </div>

          {/* Configurações de Publicação */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Configurações de Publicação</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Publicação Automática</p>
                  <p className="text-sm text-gray-500">Permitir publicações automáticas via campanhas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Stories Automáticos</p>
                  <p className="text-sm text-gray-500">Publicar stories automaticamente</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Hashtags Padrão */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Hashtags Padrão</h4>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="#marketing #digitalmarketing #business #entrepreneur #success"
            />
            <p className="text-sm text-gray-500 mt-2">Hashtags que serão adicionadas automaticamente aos posts</p>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button 
              onClick={() => handleSaveInstagramSettings()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="p-3 bg-pink-100 rounded-lg">
            <Instagram className="w-8 h-8 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instagram Business</h1>
            <p className="text-gray-600">Gerencie suas campanhas e conteúdo no Instagram</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={() => handleUpload()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button 
            onClick={() => handleNewPost()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Post
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'posts', label: 'Posts', icon: Image },
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
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default InstagramManager;

