from flask import Blueprint, request, jsonify
from src.models.sales_agent import SalesAgent, SalesAgentProduct, SalesAgentPlatform
from src.models.db_instance import db

sales_agent_bp = Blueprint('sales_agent', __name__)

# Criar ou ativar agente global de vendas para o usuário
@sales_agent_bp.route('/sales_agent', methods=['POST'])
def create_or_activate_agent():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name', 'Agente Global de Vendas')
    if not user_id:
        return jsonify({'error': 'user_id é obrigatório'}), 400
    agent = SalesAgent.query.filter_by(user_id=user_id).first()
    if not agent:
        agent = SalesAgent(user_id=user_id, name=name, active=True)
        db.session.add(agent)
    else:
        agent.active = True
    db.session.commit()
    return jsonify({'agent_id': agent.id, 'active': agent.active})

# Associar produtos ao agente
@sales_agent_bp.route('/sales_agent/<int:agent_id>/products', methods=['POST'])
def set_agent_products(agent_id):
    data = request.get_json()
    product_ids = data.get('product_ids', [])
    SalesAgentProduct.query.filter_by(agent_id=agent_id).delete()
    for pid in product_ids:
        db.session.add(SalesAgentProduct(agent_id=agent_id, product_id=pid))
    db.session.commit()
    return jsonify({'success': True})

# Ativar/desativar agente em plataformas
@sales_agent_bp.route('/sales_agent/<int:agent_id>/platforms', methods=['POST'])
def set_agent_platforms(agent_id):
    data = request.get_json()
    platforms = data.get('platforms', [])  # lista de dicts: {platform, active}
    SalesAgentPlatform.query.filter_by(agent_id=agent_id).delete()
    for p in platforms:
        db.session.add(SalesAgentPlatform(agent_id=agent_id, platform=p['platform'], active=p.get('active', True)))
    db.session.commit()
    return jsonify({'success': True})

# Consultar status/configuração do agente
@sales_agent_bp.route('/sales_agent/<int:user_id>', methods=['GET'])
def get_agent_status(user_id):
    agent = SalesAgent.query.filter_by(user_id=user_id).first()
    if not agent:
        return jsonify({'active': False})
    products = [ap.product_id for ap in SalesAgentProduct.query.filter_by(agent_id=agent.id)]
    platforms = [ap.platform for ap in SalesAgentPlatform.query.filter_by(agent_id=agent.id, active=True)]
    return jsonify({'agent_id': agent.id, 'active': agent.active, 'products': products, 'platforms': platforms})
