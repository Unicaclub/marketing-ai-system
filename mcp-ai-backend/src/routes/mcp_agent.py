from flask import Blueprint, request, jsonify
from src.services.mcp_agent_service import mcp_agent_service
from src.models.mcp_agent import MCPAgent, AgentKnowledge, ConversationFlow
from src.models.campaign import Campaign, SalesInteraction
import json

mcp_agent_bp = Blueprint('mcp_agent', __name__)

@mcp_agent_bp.route('/agents', methods=['GET'])
def get_agents():
    """Get all MCP agents for the current user."""
    try:
        # In production, would filter by user_id from session/token
        agents = MCPAgent.query.all()
        return jsonify({
            'success': True,
            'agents': [agent.to_dict() for agent in agents]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents', methods=['POST'])
def create_agent():
    """Create a new MCP agent."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'success': False, 'error': 'Nome é obrigatório'}), 400
        
        # Create agent configuration
        config = {
            'name': data['name'],
            'description': data.get('description', ''),
            'sales_approach': data.get('sales_approach', 'consultative'),
            'supported_platforms': data.get('supported_platforms', ['whatsapp', 'instagram', 'facebook']),
            'personality': data.get('personality', {}),
            'model_name': data.get('model_name', 'gpt-4'),
            'temperature': data.get('temperature', 0.7),
            'max_tokens': data.get('max_tokens', 1000),
            'system_prompt': data.get('system_prompt')
        }
        
        # Create agent using service
        agent = mcp_agent_service.create_agent(
            user_id=1,  # In production, get from session/token
            config=config
        )
        
        # Save to database (would need db session here)
        # db.session.add(agent)
        # db.session.commit()
        
        return jsonify({
            'success': True,
            'agent': agent.to_dict(),
            'message': 'Agente criado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get specific agent details."""
    try:
        agent = MCPAgent.query.get(agent_id)
        if not agent:
            return jsonify({'success': False, 'error': 'Agente não encontrado'}), 404
        
        return jsonify({
            'success': True,
            'agent': agent.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    """Update agent configuration."""
    try:
        agent = MCPAgent.query.get(agent_id)
        if not agent:
            return jsonify({'success': False, 'error': 'Agente não encontrado'}), 404
        
        data = request.get_json()
        
        # Update agent fields
        if 'name' in data:
            agent.name = data['name']
        if 'description' in data:
            agent.description = data['description']
        if 'sales_approach' in data:
            agent.sales_approach = data['sales_approach']
        if 'supported_platforms' in data:
            agent.supported_platforms = json.dumps(data['supported_platforms'])
        if 'personality' in data:
            agent.personality = json.dumps(data['personality'])
        if 'model_name' in data:
            agent.model_name = data['model_name']
        if 'temperature' in data:
            agent.temperature = data['temperature']
        if 'max_tokens' in data:
            agent.max_tokens = data['max_tokens']
        if 'system_prompt' in data:
            agent.system_prompt = data['system_prompt']
        if 'is_active' in data:
            agent.is_active = data['is_active']
        
        # Save changes (would need db session here)
        # db.session.commit()
        
        return jsonify({
            'success': True,
            'agent': agent.to_dict(),
            'message': 'Agente atualizado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>/chat', methods=['POST'])
def chat_with_agent():
    """Send a message to the agent and get AI response."""
    try:
        data = request.get_json()
        
        if not data.get('message'):
            return jsonify({'success': False, 'error': 'Mensagem é obrigatória'}), 400
        
        agent = MCPAgent.query.get(agent_id)
        if not agent:
            return jsonify({'success': False, 'error': 'Agente não encontrado'}), 404
        
        # Build context from request
        context = {
            'platform': data.get('platform', 'web'),
            'customer': data.get('customer', {}),
            'campaign': data.get('campaign', {}),
            'conversation_history': data.get('conversation_history', [])
        }
        
        # Process message with agent
        result = mcp_agent_service.process_message(
            agent=agent,
            message=data['message'],
            context=context
        )
        
        return jsonify({
            'success': True,
            'response': result['response'],
            'sentiment': result['sentiment'],
            'stage': result['stage'],
            'confidence': result['confidence'],
            'suggested_actions': result.get('suggested_actions', []),
            'metadata': result.get('metadata', {})
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/sales/interaction', methods=['POST'])
def handle_sales_interaction():
    """Handle a sales interaction for a specific campaign."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['campaign_id', 'platform', 'customer', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'{field} é obrigatório'}), 400
        
        # Handle the interaction
        result = mcp_agent_service.handle_sales_interaction(
            campaign_id=data['campaign_id'],
            platform=data['platform'],
            customer_data=data['customer'],
            message=data['message']
        )
        
        if 'error' in result:
            return jsonify({'success': False, 'error': result['error']}), 400
        
        return jsonify({
            'success': True,
            'response': result['response'],
            'interaction_id': result.get('interaction_id'),
            'metadata': result.get('metadata', {}),
            'suggested_actions': result.get('suggested_actions', [])
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/sales/interactions/<int:campaign_id>', methods=['GET'])
def get_campaign_interactions(campaign_id):
    """Get all sales interactions for a specific campaign."""
    try:
        interactions = SalesInteraction.query.filter_by(campaign_id=campaign_id).all()
        
        return jsonify({
            'success': True,
            'interactions': [interaction.to_dict() for interaction in interactions],
            'total': len(interactions)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>/knowledge', methods=['GET'])
def get_agent_knowledge(agent_id):
    """Get knowledge base entries for an agent."""
    try:
        knowledge_entries = AgentKnowledge.query.filter_by(agent_id=agent_id).all()
        
        return jsonify({
            'success': True,
            'knowledge': [entry.to_dict() for entry in knowledge_entries]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>/knowledge', methods=['POST'])
def add_agent_knowledge(agent_id):
    """Add knowledge entry to an agent."""
    try:
        data = request.get_json()
        
        if not all(field in data for field in ['category', 'title', 'content']):
            return jsonify({'success': False, 'error': 'Categoria, título e conteúdo são obrigatórios'}), 400
        
        knowledge = AgentKnowledge(
            agent_id=agent_id,
            category=data['category'],
            title=data['title'],
            content=data['content'],
            tags=json.dumps(data.get('tags', [])),
            priority=data.get('priority', 1)
        )
        
        # Save to database (would need db session here)
        # db.session.add(knowledge)
        # db.session.commit()
        
        return jsonify({
            'success': True,
            'knowledge': knowledge.to_dict(),
            'message': 'Conhecimento adicionado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>/flows', methods=['GET'])
def get_conversation_flows(agent_id):
    """Get conversation flows for an agent."""
    try:
        flows = ConversationFlow.query.filter_by(agent_id=agent_id).all()
        
        return jsonify({
            'success': True,
            'flows': [flow.to_dict() for flow in flows]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/agents/<int:agent_id>/flows', methods=['POST'])
def create_conversation_flow(agent_id):
    """Create a new conversation flow for an agent."""
    try:
        data = request.get_json()
        
        if not all(field in data for field in ['name', 'flow_steps']):
            return jsonify({'success': False, 'error': 'Nome e passos do fluxo são obrigatórios'}), 400
        
        flow = ConversationFlow(
            agent_id=agent_id,
            name=data['name'],
            description=data.get('description', ''),
            trigger_conditions=json.dumps(data.get('trigger_conditions', {})),
            flow_steps=json.dumps(data['flow_steps'])
        )
        
        # Save to database (would need db session here)
        # db.session.add(flow)
        # db.session.commit()
        
        return jsonify({
            'success': True,
            'flow': flow.to_dict(),
            'message': 'Fluxo de conversa criado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mcp_agent_bp.route('/test/openai', methods=['POST'])
def test_openai_connection():
    """Test OpenAI API connection."""
    try:
        data = request.get_json()
        message = data.get('message', 'Olá, este é um teste de conexão.')
        
        # Create a simple test agent
        test_agent = MCPAgent(
            name='Agente Teste',
            model_name='gpt-4',
            temperature=0.7,
            max_tokens=100,
            system_prompt='Você é um assistente de teste. Responda de forma breve e amigável.'
        )
        
        # Test the connection
        result = mcp_agent_service.process_message(
            agent=test_agent,
            message=message,
            context={'platform': 'test'}
        )
        
        return jsonify({
            'success': True,
            'test_message': message,
            'ai_response': result['response'],
            'metadata': result.get('metadata', {}),
            'message': 'Conexão com OpenAI funcionando corretamente!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Erro na conexão com OpenAI. Verifique as configurações.'
        }), 500

