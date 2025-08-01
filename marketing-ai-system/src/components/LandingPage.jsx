import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: 'IA Avançada',
      description: 'Automação inteligente com GPT para criação de campanhas personalizadas'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: 'Integração Total',
      description: 'WhatsApp, Instagram e Facebook em uma única plataforma'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: 'Analytics Avançado',
      description: 'Métricas em tempo real com insights acionáveis'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: 'Chat Inteligente',
      description: 'Gerencie campanhas através de conversas naturais'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Segurança Total',
      description: 'Proteção avançada de dados e APIs criptografadas'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: 'Mobile First',
      description: 'Interface responsiva otimizada para todos os dispositivos'
    }
  ];

  const benefits = [
    'Aumento de 300% na eficiência das campanhas',
    'Redução de 80% no tempo de criação de conteúdo',
    'ROI médio de 450% em campanhas automatizadas',
    'Integração com mais de 20 plataformas',
    'Suporte 24/7 com IA especializada'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Marketing AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Entrar
              </Link>
              <Link 
                to="/register" 
                className="btn-primary-gradient text-white px-6 py-2 rounded-lg font-medium"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Automatize suas
              <span className="text-gradient block">Campanhas Digitais</span>
              com Inteligência Artificial
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma completa para gerenciar campanhas no WhatsApp, Instagram e Facebook 
              com automação inteligente e resultados comprovados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="btn-primary-gradient text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 group"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors">
                <Play className="w-5 h-5" />
                Ver Demonstração
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para dominar o marketing digital
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-hover bg-white p-8 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Resultados Comprovados
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Mais de 10.000 empresas já transformaram seus resultados com nossa plataforma.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">450%</div>
                <div className="text-blue-200 mb-6">ROI Médio</div>
                <div className="flex justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100">
                  "Revolucionou nossa estratégia de marketing digital. 
                  Resultados incríveis em apenas 30 dias!"
                </p>
                <p className="text-sm text-blue-200 mt-4">
                  - Maria Silva, CEO TechStart
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Pronto para Transformar seu Marketing?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de empresas que já estão obtendo resultados extraordinários.
          </p>
          <Link 
            to="/register" 
            className="btn-primary-gradient text-white px-12 py-4 rounded-lg font-semibold text-xl inline-flex items-center gap-3"
          >
            Começar Agora - É Grátis
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Sem cartão de crédito • Configuração em 5 minutos • Suporte 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Marketing AI System</span>
            </div>
            <p className="text-gray-400 mb-6">
              A plataforma mais avançada para automação de marketing digital
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">
                © 2024 Marketing AI System. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

