
import json
from flask import Blueprint, request, jsonify
from src.models.campaign import SalesInteraction
from src.models.db_instance import db

sales_interaction_bp = Blueprint('sales_interaction', __name__)

@sales_interaction_bp.route('/sales_interactions/<int:interaction_id>', methods=['PUT'])
def update_sales_interaction(interaction_id):
    interaction = SalesInteraction.query.get_or_404(interaction_id)
    data = request.get_json()
    interaction.campaign_id = data.get('campaign_id', interaction.campaign_id)
    interaction.platform = data.get('platform', interaction.platform)
    interaction.customer_id = data.get('customer', {}).get('id', interaction.customer_id)
    interaction.customer_name = data.get('customer', {}).get('name', interaction.customer_name)
    interaction.customer_phone = data.get('customer', {}).get('phone', interaction.customer_phone)
    interaction.customer_email = data.get('customer', {}).get('email', interaction.customer_email)
    interaction.interaction_type = data.get('interaction', {}).get('type', interaction.interaction_type)
    interaction.message_content = data.get('interaction', {}).get('message', interaction.message_content)
    interaction.ai_response = data.get('interaction', {}).get('ai_response', interaction.ai_response)
    interaction.sentiment = data.get('interaction', {}).get('sentiment', interaction.sentiment)
    interaction.stage = data.get('interaction', {}).get('stage', interaction.stage)
    interaction.product_interest = json.dumps(data.get('sales', {}).get('product_interest', json.loads(interaction.product_interest) if interaction.product_interest else []))
    interaction.conversion_probability = data.get('sales', {}).get('conversion_probability', interaction.conversion_probability)
    interaction.deal_value = data.get('sales', {}).get('deal_value', interaction.deal_value)
    interaction.status = data.get('sales', {}).get('status', interaction.status)
    db.session.commit()
    return jsonify(interaction.to_dict())

@sales_interaction_bp.route('/sales_interactions/<int:interaction_id>', methods=['DELETE'])
def delete_sales_interaction(interaction_id):
    interaction = SalesInteraction.query.get_or_404(interaction_id)
    db.session.delete(interaction)
    db.session.commit()
    return '', 204

@sales_interaction_bp.route('/sales_interactions', methods=['POST'])
def create_sales_interaction():
    data = request.get_json()
    try:
        interaction = SalesInteraction(
            campaign_id=data.get('campaign_id'),
            platform=data.get('platform'),
            customer_id=data.get('customer', {}).get('id'),
            customer_name=data.get('customer', {}).get('name'),
            customer_phone=data.get('customer', {}).get('phone'),
            customer_email=data.get('customer', {}).get('email'),
            interaction_type=data.get('interaction', {}).get('type'),
            message_content=data.get('interaction', {}).get('message'),
            ai_response=data.get('interaction', {}).get('ai_response'),
            sentiment=data.get('interaction', {}).get('sentiment'),
            stage=data.get('interaction', {}).get('stage'),
            product_interest=json.dumps(data.get('sales', {}).get('product_interest', [])),
            conversion_probability=data.get('sales', {}).get('conversion_probability', 0.0),
            deal_value=data.get('sales', {}).get('deal_value', 0.0),
            status=data.get('sales', {}).get('status', 'active')
        )
        db.session.add(interaction)
        db.session.commit()
        return jsonify(interaction.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@sales_interaction_bp.route('/sales_interactions', methods=['GET'])
def get_sales_interactions():
    interactions = SalesInteraction.query.all()
    return jsonify([i.to_dict() for i in interactions])

@sales_interaction_bp.route('/sales_interactions/<int:interaction_id>', methods=['GET'])
def get_sales_interaction(interaction_id):
    interaction = SalesInteraction.query.get_or_404(interaction_id)
    return jsonify(interaction.to_dict())
