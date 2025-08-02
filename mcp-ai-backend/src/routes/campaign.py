
import json
from flask import Blueprint, request, jsonify
from src.models.campaign import Campaign
from src.models.db_instance import db

campaign_bp = Blueprint('campaign', __name__)

@campaign_bp.route('/campaigns/<int:campaign_id>', methods=['PUT'])
def update_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    data = request.get_json()
    campaign.name = data.get('name', campaign.name)
    campaign.objective = data.get('objective', campaign.objective)
    campaign.status = data.get('status', campaign.status)
    campaign.platforms = json.dumps(data.get('platforms', json.loads(campaign.platforms) if campaign.platforms else []))
    campaign.target_audience = json.dumps(data.get('target_audience', json.loads(campaign.target_audience) if campaign.target_audience else {}))
    campaign.budget_type = data.get('budget', {}).get('type', campaign.budget_type)
    campaign.budget_amount = data.get('budget', {}).get('amount', campaign.budget_amount)
    campaign.budget_duration = data.get('budget', {}).get('duration', campaign.budget_duration)
    campaign.content_headline = data.get('content', {}).get('headline', campaign.content_headline)
    campaign.content_description = data.get('content', {}).get('description', campaign.content_description)
    campaign.content_cta = data.get('content', {}).get('cta', campaign.content_cta)
    campaign.content_media = json.dumps(data.get('content', {}).get('media', json.loads(campaign.content_media) if campaign.content_media else []))
    campaign.start_date = data.get('schedule', {}).get('start_date', campaign.start_date)
    campaign.end_date = data.get('schedule', {}).get('end_date', campaign.end_date)
    campaign.timezone = data.get('schedule', {}).get('timezone', campaign.timezone)
    campaign.sales_strategy = data.get('sales_strategy', campaign.sales_strategy)
    campaign.user_id = data.get('user_id', campaign.user_id)
    campaign.product_database_id = data.get('product_database_id', campaign.product_database_id)
    db.session.commit()
    return jsonify(campaign.to_dict())

@campaign_bp.route('/campaigns/<int:campaign_id>', methods=['DELETE'])
def delete_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    db.session.delete(campaign)
    db.session.commit()
    return '', 204

@campaign_bp.route('/campaigns', methods=['POST'])
def create_campaign():
    data = request.get_json()
    try:
        campaign = Campaign(
            name=data.get('name'),
            objective=data.get('objective'),
            status=data.get('status', 'draft'),
            platforms=json.dumps(data.get('platforms', [])),
            target_audience=json.dumps(data.get('target_audience', {})),
            budget_type=data.get('budget', {}).get('type'),
            budget_amount=data.get('budget', {}).get('amount'),
            budget_duration=data.get('budget', {}).get('duration'),
            content_headline=data.get('content', {}).get('headline'),
            content_description=data.get('content', {}).get('description'),
            content_cta=data.get('content', {}).get('cta'),
            content_media=json.dumps(data.get('content', {}).get('media', [])),
            start_date=data.get('schedule', {}).get('start_date'),
            end_date=data.get('schedule', {}).get('end_date'),
            timezone=data.get('schedule', {}).get('timezone'),
            sales_strategy=data.get('sales_strategy'),
            user_id=data.get('user_id'),
            product_database_id=data.get('product_database_id')
        )
        db.session.add(campaign)
        db.session.commit()
        return jsonify(campaign.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@campaign_bp.route('/campaigns', methods=['GET'])
def get_campaigns():
    campaigns = Campaign.query.all()
    return jsonify([c.to_dict() for c in campaigns])

@campaign_bp.route('/campaigns/<int:campaign_id>', methods=['GET'])
def get_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    return jsonify(campaign.to_dict())
