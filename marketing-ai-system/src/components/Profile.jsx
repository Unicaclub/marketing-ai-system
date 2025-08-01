import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  Key,
  Bell,
  Activity,
  Award,
  TrendingUp
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    website: ''
  });

  const [stats] = useState({
    totalCampaigns: 12,
    activeCampaigns: 8,
    totalReach: 45230,
    avgROI: 450,
    joinDate: '2024-01-01',
    lastLogin: new Date().toISOString()
  });

  const [achievements] = useState([
    {
      id: 1,
      title: 'Primeiro Milhão',
      description: 'Alcançou 1 milhão de impressões',
      icon: <TrendingUp className="w-6 h-6" />,
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'ROI Master',
      description: 'Conseguiu ROI acima de 400%',
      icon: <Award className="w-6 h-6" />,
      earned: true,
      date: '2024-01-20'
    },
    {
      id: 3,
      title: 'Campanha Perfeita',
      description: 'Criou uma campanha com 100% de sucesso',
      icon: <Shield className="w-6 h-6" />,
      earned: false,
      date: null
    }
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
      company: '',
      website: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.name || 'Usuário'}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Membro desde {new Date(stats.joinDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" />
                  Último acesso: {new Date(stats.lastLogin).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Campanhas Totais</span>
                <span className="font-semibold text-gray-900">{stats.totalCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Campanhas Ativas</span>
                <span className="font-semibold text-green-600">{stats.activeCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Alcance Total</span>
                <span className="font-semibold text-gray-900">{stats.totalReach.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROI Médio</span>
                <span className="font-semibold text-blue-600">{stats.avgROI}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{formData.name || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{formData.email || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{formData.phone || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="São Paulo, SP"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{formData.location || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Nome da empresa"
                    />
                  ) : (
                    <div className="py-2">
                      <span className="text-gray-900">{formData.company || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://seusite.com"
                    />
                  ) : (
                    <div className="py-2">
                      <span className="text-gray-900">{formData.website || 'Não informado'}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conquistas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-green-600 mt-1">
                          Conquistado em {new Date(achievement.date).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Alterar Senha</div>
                    <div className="text-sm text-gray-600">Última alteração há 30 dias</div>
                  </div>
                </div>
                <button className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                  Alterar
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Autenticação de Dois Fatores</div>
                    <div className="text-sm text-gray-600">Adicione uma camada extra de segurança</div>
                  </div>
                </div>
                <button className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                  Configurar
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Alertas de Segurança</div>
                    <div className="text-sm text-gray-600">Receba notificações sobre atividades suspeitas</div>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

