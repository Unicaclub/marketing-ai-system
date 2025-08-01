import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Paperclip,
  Mic,
  MicOff,
  Image,
  FileText,
  Zap,
  Sparkles
} from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Olá! Sou sua assistente de marketing digital com IA. Como posso ajudá-lo hoje? Posso criar campanhas, analisar métricas, sugerir estratégias e muito mais!',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 2,
      type: 'ai',
      content: 'Algumas coisas que posso fazer por você:\n\n• Criar campanhas personalizadas\n• Analisar performance de campanhas existentes\n• Sugerir melhorias de ROI\n• Gerar conteúdo criativo\n• Configurar automações\n• Relatórios detalhados',
      timestamp: new Date(Date.now() - 30000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('campanha') || input.includes('criar')) {
      return 'Perfeito! Vou ajudá-lo a criar uma nova campanha. Preciso de algumas informações:\n\n1. Qual é o objetivo da campanha? (vendas, awareness, engajamento)\n2. Qual plataforma deseja usar? (Instagram, Facebook, WhatsApp)\n3. Qual é o público-alvo?\n4. Qual o orçamento disponível?\n\nCom essas informações, posso criar uma campanha otimizada para seus objetivos!';
    }
    
    if (input.includes('analytics') || input.includes('métricas') || input.includes('relatório')) {
      return 'Vou analisar as métricas das suas campanhas ativas:\n\n📊 **Resumo Geral:**\n• ROI médio: 450%\n• CTR: 3.2%\n• Conversões: 1,847\n• Alcance total: 45,230\n\n🎯 **Recomendações:**\n• Aumente o orçamento da campanha "Black Friday" (+23% performance)\n• Ajuste o público da campanha "Verão" (baixo engajamento)\n• Teste novos criativos para melhorar CTR\n\nQuer que eu detalhe alguma campanha específica?';
    }
    
    if (input.includes('roi') || input.includes('performance')) {
      return 'Excelente pergunta sobre ROI! Baseado nos dados das suas campanhas:\n\n💰 **ROI Atual: 450%**\n\n**Campanhas com melhor performance:**\n1. Campanha Verão: 510% ROI\n2. Lançamento Produto X: 420% ROI\n3. Black Friday 2024: 380% ROI\n\n**Dicas para melhorar:**\n• Realoque orçamento para campanhas de alto ROI\n• Teste A/B em criativos\n• Otimize segmentação de público\n• Ajuste horários de publicação\n\nQuer que eu implemente alguma dessas otimizações?';
    }
    
    if (input.includes('whatsapp') || input.includes('instagram') || input.includes('facebook')) {
      return 'Ótimo! Posso ajudar com integrações das plataformas sociais:\n\n📱 **WhatsApp Business API:**\n• Automação de mensagens\n• Chatbots inteligentes\n• Campanhas de remarketing\n\n📸 **Instagram:**\n• Posts automatizados\n• Stories programados\n• Análise de hashtags\n\n👥 **Facebook:**\n• Ads otimizados\n• Pixel de conversão\n• Lookalike audiences\n\nQual plataforma gostaria de configurar primeiro?';
    }
    
    return 'Entendi! Posso ajudá-lo com isso. Como assistente de marketing com IA, tenho acesso a todas as funcionalidades da plataforma:\n\n✨ **Posso fazer:**\n• Criar e otimizar campanhas\n• Analisar dados e métricas\n• Gerar conteúdo criativo\n• Configurar automações\n• Integrar plataformas\n• Relatórios personalizados\n\nPoderia ser mais específico sobre o que precisa? Assim posso dar uma resposta mais direcionada!';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: 'Criar nova campanha', icon: <Zap className="w-4 h-4" /> },
    { text: 'Analisar métricas', icon: <Sparkles className="w-4 h-4" /> },
    { text: 'Otimizar ROI', icon: <Bot className="w-4 h-4" /> },
    { text: 'Configurar integração', icon: <FileText className="w-4 h-4" /> }
  ];

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Assistente IA</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary' 
                    : 'bg-gray-200'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'chat-bubble-user'
                    : 'chat-bubble-ai'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="chat-bubble-ai px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="mb-3">
            <span className="text-sm text-gray-500">Ações rápidas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.text)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                {action.icon}
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-xl">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Image className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none max-h-32"
              rows="1"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="btn-primary-gradient text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

