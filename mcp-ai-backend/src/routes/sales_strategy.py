from flask import Blueprint, request, jsonify
from src.services.sales_strategy_service import sales_strategy_service
import json

sales_strategy_bp = Blueprint('sales_strategy', __name__)

@sales_strategy_bp.route('/analyze-products', methods=['POST'])
def analyze_products():
    """Analisa banco de dados de produtos e gera insights."""
    try:
        data = request.get_json()
        
        if not data or 'products' not in data:
            return jsonify({
                'success': False,
                'error': 'Lista de produtos é obrigatória'
            }), 400
        
        products = data['products']
        if not isinstance(products, list) or len(products) == 0:
            return jsonify({
                'success': False,
                'error': 'Lista de produtos deve conter pelo menos um item'
            }), 400
        
        # Analisar produtos
        analysis_result = sales_strategy_service.analyze_product_database(products)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@sales_strategy_bp.route('/generate-strategies', methods=['POST'])
def generate_strategies():
    """Gera estratégias de vendas baseadas em análise de produtos e público-alvo."""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['product_analysis', 'target_audience', 'campaign_objective']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo {field} é obrigatório'
                }), 400
        
        # Gerar estratégias
        strategies = sales_strategy_service.generate_sales_strategies(
            product_analysis=data['product_analysis'],
            target_audience=data['target_audience'],
            campaign_objective=data['campaign_objective']
        )
        
        return jsonify({
            'success': True,
            'strategies': strategies,
            'total_strategies': len(strategies),
            'message': 'Estratégias geradas com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao gerar estratégias: {str(e)}'
        }), 500

@sales_strategy_bp.route('/optimize-strategy', methods=['POST'])
def optimize_strategy():
    """Otimiza uma estratégia para uma plataforma específica."""
    try:
        data = request.get_json()
        
        if not data or 'strategy' not in data or 'platform' not in data:
            return jsonify({
                'success': False,
                'error': 'Estratégia e plataforma são obrigatórias'
            }), 400
        
        strategy = data['strategy']
        platform = data['platform']
        
        # Validar plataforma
        valid_platforms = ['whatsapp', 'instagram', 'facebook', 'tiktok', 'linkedin', 'email']
        if platform.lower() not in valid_platforms:
            return jsonify({
                'success': False,
                'error': f'Plataforma deve ser uma das seguintes: {", ".join(valid_platforms)}'
            }), 400
        
        # Otimizar estratégia
        optimized_strategy = sales_strategy_service.optimize_strategy_for_platform(
            strategy=strategy,
            platform=platform
        )
        
        return jsonify({
            'success': True,
            'optimized_strategy': optimized_strategy,
            'platform': platform,
            'message': f'Estratégia otimizada para {platform} com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao otimizar estratégia: {str(e)}'
        }), 500

@sales_strategy_bp.route('/create-conversation-flow', methods=['POST'])
def create_conversation_flow():
    """Cria um fluxo de conversa para uma estratégia específica."""
    try:
        data = request.get_json()
        
        if not data or 'strategy' not in data or 'platform' not in data:
            return jsonify({
                'success': False,
                'error': 'Estratégia e plataforma são obrigatórias'
            }), 400
        
        strategy = data['strategy']
        platform = data['platform']
        
        # Criar fluxo de conversa
        conversation_flow = sales_strategy_service.create_conversation_flow(
            strategy=strategy,
            platform=platform
        )
        
        return jsonify({
            'success': True,
            'conversation_flow': conversation_flow,
            'message': 'Fluxo de conversa criado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao criar fluxo de conversa: {str(e)}'
        }), 500

@sales_strategy_bp.route('/evaluate-performance', methods=['POST'])
def evaluate_performance():
    """Avalia a performance de uma estratégia."""
    try:
        data = request.get_json()
        
        if not data or 'strategy_id' not in data or 'metrics' not in data:
            return jsonify({
                'success': False,
                'error': 'ID da estratégia e métricas são obrigatórias'
            }), 400
        
        strategy_id = data['strategy_id']
        metrics = data['metrics']
        
        # Avaliar performance
        evaluation = sales_strategy_service.evaluate_strategy_performance(
            strategy_id=strategy_id,
            metrics=metrics
        )
        
        return jsonify({
            'success': True,
            'evaluation': evaluation,
            'message': 'Avaliação de performance concluída!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao avaliar performance: {str(e)}'
        }), 500

@sales_strategy_bp.route('/strategies/templates', methods=['GET'])
def get_strategy_templates():
    """Retorna templates de estratégias pré-definidas."""
    try:
        templates = [
            {
                "id": "template_nurturing",
                "name": "Nutrição Progressiva",
                "description": "Estratégia focada em educar o cliente gradualmente",
                "category": "relationship",
                "platforms": ["whatsapp", "instagram", "email"],
                "target_audience": "Clientes em consideração",
                "expected_duration": "7-14 dias",
                "conversion_rate": "15-25%",
                "investment_level": "baixo"
            },
            {
                "id": "template_urgency",
                "name": "Urgência e Escassez",
                "description": "Criação de senso de urgência com ofertas limitadas",
                "category": "conversion",
                "platforms": ["facebook", "whatsapp", "instagram"],
                "target_audience": "Clientes prontos para comprar",
                "expected_duration": "3-7 dias",
                "conversion_rate": "20-35%",
                "investment_level": "medio"
            },
            {
                "id": "template_relationship",
                "name": "Relacionamento VIP",
                "description": "Construção de relacionamento de longo prazo",
                "category": "retention",
                "platforms": ["whatsapp", "instagram"],
                "target_audience": "Clientes de alto valor",
                "expected_duration": "30+ dias",
                "conversion_rate": "25-40%",
                "investment_level": "alto"
            },
            {
                "id": "template_social_proof",
                "name": "Prova Social",
                "description": "Uso de depoimentos e casos de sucesso",
                "category": "trust",
                "platforms": ["instagram", "facebook", "linkedin"],
                "target_audience": "Clientes céticos",
                "expected_duration": "5-10 dias",
                "conversion_rate": "18-28%",
                "investment_level": "medio"
            },
            {
                "id": "template_consultation",
                "name": "Consultoria Gratuita",
                "description": "Oferta de consultoria para gerar leads qualificados",
                "category": "lead_generation",
                "platforms": ["linkedin", "facebook", "whatsapp"],
                "target_audience": "Empresários e gestores",
                "expected_duration": "10-21 dias",
                "conversion_rate": "30-45%",
                "investment_level": "alto"
            }
        ]
        
        return jsonify({
            'success': True,
            'templates': templates,
            'total_templates': len(templates),
            'message': 'Templates de estratégias carregados com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao carregar templates: {str(e)}'
        }), 500

@sales_strategy_bp.route('/strategies/best-practices', methods=['GET'])
def get_best_practices():
    """Retorna melhores práticas por plataforma."""
    try:
        platform = request.args.get('platform', 'all')
        
        best_practices = {
            "whatsapp": {
                "platform": "WhatsApp",
                "practices": [
                    "Use mensagens personalizadas com o nome do cliente",
                    "Evite mensagens muito longas (máximo 160 caracteres)",
                    "Responda rapidamente (idealmente em até 5 minutos)",
                    "Use emojis com moderação para humanizar a conversa",
                    "Sempre peça permissão antes de enviar materiais",
                    "Crie grupos VIP para clientes especiais",
                    "Use áudios para criar mais proximidade",
                    "Implemente chatbots para respostas automáticas"
                ],
                "timing": {
                    "best_hours": "9h-12h e 14h-18h",
                    "avoid_hours": "22h-8h e fins de semana",
                    "response_time": "Máximo 5 minutos"
                }
            },
            "instagram": {
                "platform": "Instagram",
                "practices": [
                    "Use stories para criar urgência e proximidade",
                    "Poste conteúdo visual de alta qualidade",
                    "Interaja genuinamente com comentários",
                    "Use hashtags relevantes (máximo 30)",
                    "Crie conteúdo educativo e de valor",
                    "Faça parcerias com influenciadores",
                    "Use reels para maior alcance orgânico",
                    "Implemente call-to-actions claros"
                ],
                "timing": {
                    "best_hours": "18h-21h",
                    "best_days": "Terça a quinta-feira",
                    "posting_frequency": "1-2 posts por dia"
                }
            },
            "facebook": {
                "platform": "Facebook",
                "practices": [
                    "Segmente audiências com precisão",
                    "Use vídeos para maior engajamento",
                    "Teste diferentes formatos de anúncios",
                    "Implemente pixel de conversão",
                    "Crie lookalike audiences",
                    "Use prova social em anúncios",
                    "Otimize para conversões, não cliques",
                    "Monitore frequência de anúncios"
                ],
                "timing": {
                    "best_hours": "13h-15h e 20h-22h",
                    "best_days": "Terça a quinta-feira",
                    "campaign_duration": "Mínimo 7 dias"
                }
            }
        }
        
        if platform == 'all':
            result = best_practices
        elif platform in best_practices:
            result = {platform: best_practices[platform]}
        else:
            return jsonify({
                'success': False,
                'error': f'Plataforma {platform} não encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'best_practices': result,
            'message': 'Melhores práticas carregadas com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao carregar melhores práticas: {str(e)}'
        }), 500

@sales_strategy_bp.route('/strategies/metrics', methods=['GET'])
def get_strategy_metrics():
    """Retorna métricas padrão para avaliação de estratégias."""
    try:
        metrics_definition = {
            "conversion_metrics": {
                "conversion_rate": {
                    "name": "Taxa de Conversão",
                    "description": "Percentual de leads que se tornaram clientes",
                    "formula": "(Vendas / Leads) * 100",
                    "benchmark": "2-5% (B2C), 1-3% (B2B)",
                    "unit": "percentage"
                },
                "cost_per_acquisition": {
                    "name": "Custo por Aquisição (CPA)",
                    "description": "Custo médio para adquirir um cliente",
                    "formula": "Investimento Total / Número de Clientes",
                    "benchmark": "< 30% do LTV",
                    "unit": "currency"
                },
                "return_on_investment": {
                    "name": "Retorno sobre Investimento (ROI)",
                    "description": "Retorno financeiro do investimento",
                    "formula": "((Receita - Investimento) / Investimento) * 100",
                    "benchmark": "> 300%",
                    "unit": "percentage"
                }
            },
            "engagement_metrics": {
                "response_rate": {
                    "name": "Taxa de Resposta",
                    "description": "Percentual de mensagens que receberam resposta",
                    "formula": "(Respostas / Mensagens Enviadas) * 100",
                    "benchmark": "20-40%",
                    "unit": "percentage"
                },
                "engagement_rate": {
                    "name": "Taxa de Engajamento",
                    "description": "Nível de interação com o conteúdo",
                    "formula": "(Interações / Alcance) * 100",
                    "benchmark": "3-6%",
                    "unit": "percentage"
                },
                "click_through_rate": {
                    "name": "Taxa de Cliques (CTR)",
                    "description": "Percentual de cliques em links/CTAs",
                    "formula": "(Cliques / Impressões) * 100",
                    "benchmark": "2-5%",
                    "unit": "percentage"
                }
            },
            "quality_metrics": {
                "lead_quality_score": {
                    "name": "Score de Qualidade do Lead",
                    "description": "Pontuação baseada no perfil do lead",
                    "formula": "Soma ponderada de critérios de qualificação",
                    "benchmark": "> 70 pontos",
                    "unit": "score"
                },
                "customer_satisfaction": {
                    "name": "Satisfação do Cliente",
                    "description": "Nível de satisfação pós-venda",
                    "formula": "Média das avaliações dos clientes",
                    "benchmark": "> 4.0/5.0",
                    "unit": "rating"
                },
                "time_to_conversion": {
                    "name": "Tempo para Conversão",
                    "description": "Tempo médio do primeiro contato até a venda",
                    "formula": "Média dos tempos de conversão",
                    "benchmark": "< 30 dias",
                    "unit": "days"
                }
            }
        }
        
        return jsonify({
            'success': True,
            'metrics_definition': metrics_definition,
            'message': 'Definições de métricas carregadas com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao carregar métricas: {str(e)}'
        }), 500

