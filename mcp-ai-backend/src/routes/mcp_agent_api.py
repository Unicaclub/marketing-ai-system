
import json
from flask import Blueprint, request, jsonify
from src.models.mcp_agent import MCPAgent
from src.models.db_instance import db

mcp_agent_api_bp = Blueprint('mcp_agent_api', __name__)

@mcp_agent_api_bp.route('/mcp_agents/<int:agent_id>', methods=['PUT'])
def update_mcp_agent(agent_id):
    agent = MCPAgent.query.get_or_404(agent_id)
    data = request.get_json()
    agent.name = data.get('name', agent.name)
    agent.description = data.get('description', agent.description)
    agent.personality = json.dumps(data.get('personality', json.loads(agent.personality) if agent.personality else {}))
    agent.sales_approach = data.get('sales_approach', agent.sales_approach)
    agent.language = data.get('language', agent.language)
    agent.supported_platforms = json.dumps(data.get('supported_platforms', json.loads(agent.supported_platforms) if agent.supported_platforms else []))
    agent.model_name = data.get('model_name', agent.model_name)
    agent.temperature = data.get('temperature', agent.temperature)
    agent.max_tokens = data.get('max_tokens', agent.max_tokens)
    agent.system_prompt = data.get('system_prompt', agent.system_prompt)
    agent.is_active = data.get('is_active', agent.is_active)
    agent.is_learning = data.get('is_learning', agent.is_learning)
    db.session.commit()
    return jsonify(agent.to_dict())

@mcp_agent_api_bp.route('/mcp_agents/<int:agent_id>', methods=['DELETE'])
def delete_mcp_agent(agent_id):
    agent = MCPAgent.query.get_or_404(agent_id)
    db.session.delete(agent)
    db.session.commit()
    return '', 204

@mcp_agent_api_bp.route('/mcp_agents', methods=['POST'])
def create_mcp_agent():
    data = request.get_json()
    try:
        agent = MCPAgent(
            name=data.get('name'),
            description=data.get('description'),
            personality=json.dumps(data.get('personality', {})),
            sales_approach=data.get('sales_approach'),
            language=data.get('language', 'pt-BR'),
            supported_platforms=json.dumps(data.get('supported_platforms', [])),
            model_name=data.get('model_name', 'gpt-4'),
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1000),
            system_prompt=data.get('system_prompt'),
            is_active=data.get('is_active', True),
            is_learning=data.get('is_learning', True)
        )
        db.session.add(agent)
        db.session.commit()
        return jsonify(agent.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@mcp_agent_api_bp.route('/mcp_agents', methods=['GET'])
def get_mcp_agents():
    agents = MCPAgent.query.all()
    return jsonify([a.to_dict() for a in agents])

@mcp_agent_api_bp.route('/mcp_agents/<int:agent_id>', methods=['GET'])
def get_mcp_agent(agent_id):
    agent = MCPAgent.query.get_or_404(agent_id)
    return jsonify(agent.to_dict())
