import os
import json
import openai
from datetime import datetime
from typing import Dict, List, Optional, Any
from src.models.mcp_agent import MCPAgent, AgentKnowledge, ConversationFlow
from src.models.campaign import SalesInteraction, Campaign, ProductDatabase

class MCPAgentService:
    """
    Multi-Channel Platform AI Agent Service
    
    This service provides a modular, reusable AI agent for sales automation
    across multiple platforms (WhatsApp, Instagram, Facebook, TikTok).
    """
    
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            self.openai_client = openai.OpenAI(
                api_key=api_key,
                base_url=os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1')
            )
        else:
            self.openai_client = None
        
    def create_agent(self, user_id: int, config: Dict[str, Any]) -> MCPAgent:
        """Create a new MCP AI agent with specified configuration."""
        
        # Default system prompt for sales agent
        default_system_prompt = """
        Você é um assistente de vendas especializado em marketing digital brasileiro.
        Sua missão é ajudar clientes a encontrar as melhores soluções para suas necessidades.
        
        PERSONALIDADE:
        - Profissional, mas amigável e acessível
        - Focado em resultados e soluções
        - Paciente e educativo
        - Sempre honesto sobre limitações
        
        ABORDAGEM DE VENDAS:
        - Faça perguntas qualificadoras para entender necessidades
        - Apresente soluções baseadas em benefícios, não apenas recursos
        - Use dados e casos de sucesso quando relevante
        - Sempre ofereça próximos passos claros
        
        DIRETRIZES:
        - Responda sempre em português brasileiro
        - Mantenha respostas concisas mas informativas
        - Use emojis moderadamente para humanizar a conversa
        - Nunca prometa algo que não pode entregar
        - Sempre termine com uma pergunta ou call-to-action
        """
        
        agent = MCPAgent(
            user_id=user_id,
            name=config.get('name', 'Agente de Vendas IA'),
            description=config.get('description', 'Agente inteligente para automação de vendas'),
            personality=json.dumps(config.get('personality', {})),
            sales_approach=config.get('sales_approach', 'consultative'),
            language=config.get('language', 'pt-BR'),
            supported_platforms=json.dumps(config.get('supported_platforms', ['whatsapp', 'instagram', 'facebook'])),
            model_name=config.get('model_name', 'gpt-4'),
            temperature=config.get('temperature', 0.7),
            max_tokens=config.get('max_tokens', 1000),
            system_prompt=config.get('system_prompt', default_system_prompt)
        )
        
        return agent
    
    def process_message(self, agent: MCPAgent, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process an incoming message and generate AI response.
        
        Args:
            agent: The MCP agent instance
            message: The incoming message from customer
            context: Additional context (platform, customer info, campaign, etc.)
            
        Returns:
            Dict containing AI response and metadata
        """
        
        try:
            # Build conversation context
            conversation_context = self._build_conversation_context(agent, context)
            
            # Get relevant knowledge
            relevant_knowledge = self._get_relevant_knowledge(agent.id, message, context)
            
            # Build messages for OpenAI
            messages = [
                {"role": "system", "content": agent.system_prompt},
                {"role": "system", "content": f"Contexto da conversa: {conversation_context}"},
                {"role": "system", "content": f"Conhecimento relevante: {relevant_knowledge}"},
                {"role": "user", "content": message}
            ]
            
            # Generate AI response
            response = self.openai_client.chat.completions.create(
                model=agent.model_name,
                messages=messages,
                temperature=agent.temperature,
                max_tokens=agent.max_tokens
            )
            
            ai_response = response.choices[0].message.content
            
            # Analyze sentiment and stage
            analysis = self._analyze_interaction(message, ai_response)
            
            # Update agent metrics
            self._update_agent_metrics(agent, analysis)
            
            return {
                'response': ai_response,
                'sentiment': analysis['sentiment'],
                'stage': analysis['stage'],
                'confidence': analysis['confidence'],
                'suggested_actions': analysis['suggested_actions'],
                'metadata': {
                    'model_used': agent.model_name,
                    'tokens_used': response.usage.total_tokens,
                    'response_time': datetime.utcnow().isoformat()
                }
            }
            
        except Exception as e:
            return {
                'response': 'Desculpe, ocorreu um erro técnico. Nossa equipe foi notificada e entrará em contato em breve.',
                'error': str(e),
                'sentiment': 'neutral',
                'stage': 'error',
                'confidence': 0.0
            }
    
    def handle_sales_interaction(self, campaign_id: int, platform: str, customer_data: Dict[str, Any], message: str) -> Dict[str, Any]:
        """
        Handle a complete sales interaction for a specific campaign.
        
        Args:
            campaign_id: ID of the campaign
            platform: Platform where interaction occurred
            customer_data: Customer information
            message: Customer message
            
        Returns:
            Dict containing response and interaction data
        """
        
        # Get campaign and agent
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return {'error': 'Campaign not found'}
        
        # Get or create agent for this campaign
        agent = self._get_campaign_agent(campaign)
        
        # Build context for this interaction
        context = {
            'campaign': campaign.to_dict(),
            'platform': platform,
            'customer': customer_data,
            'sales_strategy': campaign.sales_strategy,
            'product_database': self._get_product_database(campaign.product_database_id)
        }
        
        # Process the message
        ai_result = self.process_message(agent, message, context)
        
        # Save interaction to database
        interaction = SalesInteraction(
            campaign_id=campaign_id,
            platform=platform,
            customer_id=customer_data.get('id'),
            customer_name=customer_data.get('name'),
            customer_phone=customer_data.get('phone'),
            customer_email=customer_data.get('email'),
            interaction_type=self._determine_interaction_type(context, message),
            message_content=message,
            ai_response=ai_result['response'],
            sentiment=ai_result['sentiment'],
            stage=ai_result['stage'],
            conversion_probability=ai_result.get('confidence', 0.0)
        )
        
        # Save to database (would need db session here)
        # db.session.add(interaction)
        # db.session.commit()
        
        return {
            'response': ai_result['response'],
            'interaction_id': interaction.id if hasattr(interaction, 'id') else None,
            'metadata': ai_result.get('metadata', {}),
            'suggested_actions': ai_result.get('suggested_actions', [])
        }
    
    def _build_conversation_context(self, agent: MCPAgent, context: Dict[str, Any]) -> str:
        """Build conversation context string for the AI."""
        
        context_parts = []
        
        if 'campaign' in context:
            campaign = context['campaign']
            context_parts.append(f"Campanha: {campaign['name']} (Objetivo: {campaign['objective']})")
        
        if 'platform' in context:
            context_parts.append(f"Plataforma: {context['platform']}")
        
        if 'customer' in context:
            customer = context['customer']
            context_parts.append(f"Cliente: {customer.get('name', 'Não identificado')}")
        
        if 'sales_strategy' in context:
            context_parts.append(f"Estratégia de vendas: {context['sales_strategy']}")
        
        return " | ".join(context_parts)
    
    def _get_relevant_knowledge(self, agent_id: int, message: str, context: Dict[str, Any]) -> str:
        """Get relevant knowledge base entries for the current interaction."""
        
        # This would query the AgentKnowledge table based on message content and context
        # For now, return a placeholder
        return "Base de conhecimento: Produtos e serviços de marketing digital disponíveis."
    
    def _analyze_interaction(self, message: str, response: str) -> Dict[str, Any]:
        """Analyze the interaction to determine sentiment, stage, and suggested actions."""
        
        # Simple sentiment analysis (could be enhanced with ML models)
        positive_words = ['ótimo', 'excelente', 'perfeito', 'interessante', 'quero', 'sim', 'gostei']
        negative_words = ['não', 'ruim', 'caro', 'difícil', 'complicado', 'problema']
        
        message_lower = message.lower()
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if positive_count > negative_count:
            sentiment = 'positive'
            confidence = min(0.8, 0.5 + (positive_count * 0.1))
        elif negative_count > positive_count:
            sentiment = 'negative'
            confidence = min(0.8, 0.5 + (negative_count * 0.1))
        else:
            sentiment = 'neutral'
            confidence = 0.5
        
        # Determine conversation stage
        if any(word in message_lower for word in ['olá', 'oi', 'bom dia', 'boa tarde']):
            stage = 'awareness'
        elif any(word in message_lower for word in ['preço', 'valor', 'quanto custa']):
            stage = 'consideration'
        elif any(word in message_lower for word in ['quero', 'comprar', 'fechar']):
            stage = 'purchase'
        else:
            stage = 'interest'
        
        # Suggest actions based on analysis
        suggested_actions = []
        if sentiment == 'positive' and stage == 'consideration':
            suggested_actions.append('send_proposal')
        elif sentiment == 'negative':
            suggested_actions.append('address_objection')
        elif stage == 'purchase':
            suggested_actions.append('close_deal')
        
        return {
            'sentiment': sentiment,
            'stage': stage,
            'confidence': confidence,
            'suggested_actions': suggested_actions
        }
    
    def _update_agent_metrics(self, agent: MCPAgent, analysis: Dict[str, Any]):
        """Update agent performance metrics."""
        
        agent.total_interactions += 1
        
        # Update other metrics based on analysis
        if analysis['sentiment'] == 'positive':
            agent.customer_satisfaction = (agent.customer_satisfaction + analysis['confidence']) / 2
        
        # Would save to database here
        # db.session.commit()
    
    def _get_campaign_agent(self, campaign: Campaign) -> MCPAgent:
        """Get or create an agent for the specified campaign."""
        
        # For now, create a default agent
        # In production, this would check if campaign has a specific agent assigned
        return MCPAgent(
            id=1,
            name=f"Agente {campaign.name}",
            sales_approach=campaign.sales_strategy or 'consultative',
            model_name='gpt-4',
            temperature=0.7,
            max_tokens=1000,
            system_prompt="Você é um assistente de vendas especializado."
        )
    
    def _get_product_database(self, product_db_id: Optional[int]) -> Optional[Dict[str, Any]]:
        """Get product database for the campaign."""
        
        if not product_db_id:
            return None
        
        # Would query ProductDatabase table
        return {
            'products': [
                {'name': 'Produto Exemplo', 'price': 99.90, 'description': 'Descrição do produto'}
            ]
        }
    
    def _determine_interaction_type(self, context: Dict[str, Any], message: str) -> str:
        """Determine the type of interaction based on context and message."""
        
        # Simple logic to determine interaction type
        if 'olá' in message.lower() or 'oi' in message.lower():
            return 'initial_contact'
        elif 'preço' in message.lower() or 'valor' in message.lower():
            return 'pricing_inquiry'
        elif 'quero' in message.lower() or 'comprar' in message.lower():
            return 'purchase_intent'
        else:
            return 'follow_up'

# Singleton instance
mcp_agent_service = MCPAgentService()

