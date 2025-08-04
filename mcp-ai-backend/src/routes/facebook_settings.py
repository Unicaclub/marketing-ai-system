import os
import json
from flask import Blueprint, request, jsonify
from src.models.db_instance import db
from sqlalchemy import Column, Integer, String, Boolean

facebook_settings_bp = Blueprint('facebook_settings_bp', __name__)
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), '../../facebook_settings.json')

class FacebookSettings(db.Model):
    __tablename__ = 'facebook_settings'
    id = db.Column(db.Integer, primary_key=True)
    ad_account_id = db.Column(db.String(100))
    pixel_id = db.Column(db.String(100))
    auto_optimization = db.Column(db.Boolean)
    pause_low_ctr = db.Column(db.Boolean)
    report_frequency = db.Column(db.String(20))
    report_email = db.Column(db.String(120))

@facebook_settings_bp.route('/api/platforms/facebook/settings', methods=['POST'])
def save_facebook_settings():
    data = request.get_json()
    # Salvar em arquivo JSON
    try:
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao salvar arquivo: {str(e)}'}), 500
    # Salvar no banco de dados (apenas 1 registro, sobrescreve)
    try:
        settings = FacebookSettings.query.first()
        if not settings:
            settings = FacebookSettings()
            db.session.add(settings)
        settings.ad_account_id = data.get('ad_account_id')
        settings.pixel_id = data.get('pixel_id')
        settings.auto_optimization = data.get('auto_optimization', True)
        settings.pause_low_ctr = data.get('pause_low_ctr', False)
        settings.report_frequency = data.get('report_frequency', 'daily')
        settings.report_email = data.get('report_email')
        db.session.commit()
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao salvar no banco: {str(e)}'}), 500
    return jsonify({'success': True, 'message': 'Configurações do Facebook salvas!'}), 200

@facebook_settings_bp.route('/api/platforms/facebook/settings', methods=['GET'])
def get_facebook_settings():
    settings = FacebookSettings.query.first()
    if settings:
        return jsonify({
            'ad_account_id': settings.ad_account_id,
            'pixel_id': settings.pixel_id,
            'auto_optimization': settings.auto_optimization,
            'pause_low_ctr': settings.pause_low_ctr,
            'report_frequency': settings.report_frequency,
            'report_email': settings.report_email
        })
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    return jsonify({})
