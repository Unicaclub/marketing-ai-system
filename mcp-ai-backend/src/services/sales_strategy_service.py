import json
import openai
import os
from typing import Dict, List, Any, Optional
from datetime import datetime

class SalesStrategyService:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            self.openai_client = openai.OpenAI(
                api_key=api_key,
                base_url=os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1')
            )
        else:
            self.openai_client = None
    
    def analyze_product_database(self, products: List[Dict]) -> Dict[str, Any]:
        """
        Analisa o banco de dados de produtos/serviços e gera insights para estratégias de vendas.
        """
        try:
            # Preparar dados dos produtos para análise
            product_summary = self._prepare_product_summary(products)
            
            # Prompt para análise de produtos
            analysis_prompt = f"""
            Analise o seguinte banco de dados de produtos/serviços e forneça insights estratégicos para vendas:

            PRODUTOS/SERVIÇOS:
            {product_summary}

            Por favor, forneça uma análise detalhada incluindo:
            1. Categorização dos produtos por tipo e valor
            2. Identificação de produtos âncora (high-ticket)
            3. Produtos de entrada (low-ticket) para aquisição de clientes
            4. Oportunidades de upsell e cross-sell
            5. Segmentação de público-alvo por produto
            6. Estratégias de precificação recomendadas
            7. Argumentos de vendas únicos para cada categoria

            Responda em formato JSON estruturado em português brasileiro.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Você é um especialista em estratégias de vendas e marketing digital. Analise produtos e forneça insights estratégicos detalhados."},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Tentar parsear a resposta como JSON
            try:
                analysis_result = json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Se não for JSON válido, estruturar a resposta
                analysis_result = {
                    "analysis": response.choices[0].message.content,
                    "timestamp": datetime.now().isoformat(),
                    "status": "success"
                }
            
            return {
                "success": True,
                "analysis": analysis_result,
                "products_analyzed": len(products),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Erro na análise de produtos: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
    
    def generate_sales_strategies(self, product_analysis: Dict, target_audience: Dict, campaign_objective: str) -> List[Dict]:
        """
        Gera estratégias de vendas personalizadas baseadas na análise de produtos e público-alvo.
        """
        try:
            strategy_prompt = f"""
            Com base na análise de produtos e informações do público-alvo, crie estratégias de vendas específicas:

            ANÁLISE DE PRODUTOS:
            {json.dumps(product_analysis, indent=2, ensure_ascii=False)}

            PÚBLICO-ALVO:
            {json.dumps(target_audience, indent=2, ensure_ascii=False)}

            OBJETIVO DA CAMPANHA: {campaign_objective}

            Crie 5 estratégias de vendas diferentes, cada uma com:
            1. Nome da estratégia
            2. Descrição detalhada
            3. Público-alvo específico
            4. Produtos/serviços recomendados
            5. Canais de comunicação ideais (WhatsApp, Instagram, Facebook, etc.)
            6. Sequência de mensagens/abordagem
            7. Métricas de sucesso esperadas
            8. Investimento recomendado
            9. Cronograma sugerido
            10. Argumentos de vendas principais

            Responda em formato JSON com array de estratégias em português brasileiro.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Você é um especialista em estratégias de vendas multicanal. Crie estratégias detalhadas e práticas para diferentes plataformas digitais."},
                    {"role": "user", "content": strategy_prompt}
                ],
                temperature=0.8,
                max_tokens=3000
            )
            
            try:
                strategies = json.loads(response.choices[0].message.content)
                if isinstance(strategies, dict) and 'strategies' in strategies:
                    strategies = strategies['strategies']
                elif not isinstance(strategies, list):
                    strategies = [strategies]
            except json.JSONDecodeError:
                # Fallback para estratégias padrão
                strategies = self._generate_default_strategies(campaign_objective)
            
            # Adicionar IDs únicos e timestamps
            for i, strategy in enumerate(strategies):
                strategy['id'] = f"strategy_{i+1}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                strategy['created_at'] = datetime.now().isoformat()
                strategy['status'] = 'draft'
            
            return strategies
            
        except Exception as e:
            # Retornar estratégias padrão em caso de erro
            return self._generate_default_strategies(campaign_objective)
    
    def optimize_strategy_for_platform(self, strategy: Dict, platform: str) -> Dict:
        """
        Otimiza uma estratégia específica para uma plataforma (WhatsApp, Instagram, Facebook, etc.).
        """
        try:
            platform_prompt = f"""
            Otimize a seguinte estratégia de vendas especificamente para a plataforma {platform}:

            ESTRATÉGIA ORIGINAL:
            {json.dumps(strategy, indent=2, ensure_ascii=False)}

            PLATAFORMA: {platform}

            Adapte a estratégia considerando:
            1. Características únicas da plataforma {platform}
            2. Comportamento do usuário na plataforma
            3. Formatos de conteúdo mais eficazes
            4. Limitações e oportunidades específicas
            5. Melhores práticas de engajamento
            6. Timing ideal para interações
            7. Personalização de mensagens
            8. Automações possíveis

            Retorne a estratégia otimizada em formato JSON em português brasileiro.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"Você é um especialista em marketing e vendas na plataforma {platform}. Otimize estratégias para maximizar conversões nesta plataforma específica."},
                    {"role": "user", "content": platform_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            try:
                optimized_strategy = json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Manter estratégia original se não conseguir otimizar
                optimized_strategy = strategy.copy()
                optimized_strategy['platform_optimization'] = response.choices[0].message.content
            
            optimized_strategy['optimized_for'] = platform
            optimized_strategy['optimization_timestamp'] = datetime.now().isoformat()
            
            return optimized_strategy
            
        except Exception as e:
            # Retornar estratégia original em caso de erro
            strategy_copy = strategy.copy()
            strategy_copy['optimization_error'] = str(e)
            return strategy_copy
    
    def create_conversation_flow(self, strategy: Dict, platform: str) -> Dict:
        """
        Cria um fluxo de conversa detalhado para uma estratégia específica.
        """
        try:
            flow_prompt = f"""
            Crie um fluxo de conversa detalhado para a estratégia de vendas na plataforma {platform}:

            ESTRATÉGIA:
            {json.dumps(strategy, indent=2, ensure_ascii=False)}

            PLATAFORMA: {platform}

            Crie um fluxo de conversa que inclua:
            1. Mensagem de abertura/primeiro contato
            2. Sequência de follow-up (3-5 mensagens)
            3. Tratamento de objeções comuns
            4. Mensagens de fechamento/call-to-action
            5. Mensagens de pós-venda/relacionamento
            6. Triggers para automação
            7. Pontos de escalação para humano
            8. Personalização baseada em respostas

            Para cada mensagem, inclua:
            - Texto da mensagem
            - Timing sugerido
            - Condições para envio
            - Possíveis respostas do cliente
            - Próximos passos

            Responda em formato JSON estruturado em português brasileiro.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"Você é um especialista em criação de fluxos de conversa para vendas automatizadas na plataforma {platform}. Crie fluxos detalhados e eficazes."},
                    {"role": "user", "content": flow_prompt}
                ],
                temperature=0.7,
                max_tokens=3000
            )
            
            try:
                conversation_flow = json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Criar fluxo básico se não conseguir parsear
                conversation_flow = self._create_basic_flow(strategy, platform)
            
            conversation_flow['strategy_id'] = strategy.get('id', 'unknown')
            conversation_flow['platform'] = platform
            conversation_flow['created_at'] = datetime.now().isoformat()
            
            return conversation_flow
            
        except Exception as e:
            return self._create_basic_flow(strategy, platform)
    
    def evaluate_strategy_performance(self, strategy_id: str, metrics: Dict) -> Dict:
        """
        Avalia a performance de uma estratégia e sugere otimizações.
        """
        try:
            evaluation_prompt = f"""
            Avalie a performance da estratégia de vendas com base nas métricas fornecidas:

            MÉTRICAS:
            {json.dumps(metrics, indent=2, ensure_ascii=False)}

            Forneça uma avaliação detalhada incluindo:
            1. Análise de performance geral
            2. Pontos fortes identificados
            3. Áreas de melhoria
            4. Sugestões de otimização específicas
            5. Ajustes recomendados na estratégia
            6. Previsões de melhoria
            7. Próximos passos recomendados

            Responda em formato JSON estruturado em português brasileiro.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Você é um analista de performance de vendas. Avalie métricas e forneça insights acionáveis para otimização."},
                    {"role": "user", "content": evaluation_prompt}
                ],
                temperature=0.6,
                max_tokens=2000
            )
            
            try:
                evaluation = json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                evaluation = {
                    "analysis": response.choices[0].message.content,
                    "performance_score": self._calculate_performance_score(metrics)
                }
            
            evaluation['strategy_id'] = strategy_id
            evaluation['evaluation_date'] = datetime.now().isoformat()
            evaluation['metrics_analyzed'] = metrics
            
            return evaluation
            
        except Exception as e:
            return {
                "error": f"Erro na avaliação: {str(e)}",
                "strategy_id": strategy_id,
                "evaluation_date": datetime.now().isoformat()
            }
    
    def _prepare_product_summary(self, products: List[Dict]) -> str:
        """Prepara um resumo dos produtos para análise."""
        summary = []
        for product in products:
            product_info = f"- {product.get('name', 'Produto sem nome')}"
            if 'price' in product:
                product_info += f" (R$ {product['price']})"
            if 'description' in product:
                product_info += f": {product['description'][:100]}..."
            if 'category' in product:
                product_info += f" [Categoria: {product['category']}]"
            summary.append(product_info)
        
        return "\n".join(summary[:20])  # Limitar a 20 produtos para não exceder tokens
    
    def _generate_default_strategies(self, objective: str) -> List[Dict]:
        """Gera estratégias padrão quando a IA falha."""
        base_strategies = [
            {
                "name": "Estratégia de Nutrição Progressiva",
                "description": "Abordagem gradual focada em educar o cliente antes da venda",
                "target_audience": "Clientes em fase de consideração",
                "recommended_channels": ["WhatsApp", "Instagram"],
                "investment_level": "Baixo a Médio",
                "expected_conversion": "15-25%"
            },
            {
                "name": "Estratégia de Urgência e Escassez",
                "description": "Criação de senso de urgência com ofertas limitadas",
                "target_audience": "Clientes prontos para comprar",
                "recommended_channels": ["Facebook", "WhatsApp"],
                "investment_level": "Médio",
                "expected_conversion": "20-35%"
            },
            {
                "name": "Estratégia de Relacionamento e Confiança",
                "description": "Foco em construir relacionamento de longo prazo",
                "target_audience": "Clientes de alto valor",
                "recommended_channels": ["WhatsApp", "Instagram"],
                "investment_level": "Alto",
                "expected_conversion": "25-40%"
            }
        ]
        
        # Personalizar para o objetivo específico
        for strategy in base_strategies:
            strategy['objective'] = objective
            strategy['id'] = f"default_{strategy['name'].lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            strategy['created_at'] = datetime.now().isoformat()
            strategy['status'] = 'draft'
        
        return base_strategies
    
    def _create_basic_flow(self, strategy: Dict, platform: str) -> Dict:
        """Cria um fluxo básico quando a IA falha."""
        return {
            "flow_name": f"Fluxo Básico - {strategy.get('name', 'Estratégia')}",
            "platform": platform,
            "steps": [
                {
                    "step": 1,
                    "type": "opening",
                    "message": "Olá! Vi que você tem interesse em nossos produtos. Como posso ajudar?",
                    "timing": "Imediato"
                },
                {
                    "step": 2,
                    "type": "qualification",
                    "message": "Para oferecer a melhor solução, pode me contar um pouco sobre sua necessidade?",
                    "timing": "Após resposta inicial"
                },
                {
                    "step": 3,
                    "type": "presentation",
                    "message": "Baseado no que você me contou, acredito que temos a solução perfeita!",
                    "timing": "Após qualificação"
                },
                {
                    "step": 4,
                    "type": "closing",
                    "message": "Que tal agendar uma conversa para detalhar como podemos ajudar?",
                    "timing": "Após apresentação"
                }
            ],
            "created_at": datetime.now().isoformat()
        }
    
    def _calculate_performance_score(self, metrics: Dict) -> float:
        """Calcula um score de performance básico."""
        try:
            conversion_rate = metrics.get('conversion_rate', 0)
            engagement_rate = metrics.get('engagement_rate', 0)
            response_rate = metrics.get('response_rate', 0)
            
            # Score ponderado
            score = (conversion_rate * 0.5) + (engagement_rate * 0.3) + (response_rate * 0.2)
            return min(100, max(0, score))
        except:
            return 0.0

# Instância global do serviço
sales_strategy_service = SalesStrategyService()

