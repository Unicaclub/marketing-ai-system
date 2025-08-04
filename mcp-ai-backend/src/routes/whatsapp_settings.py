import os
import json
from flask import Blueprint, request, jsonify
from src.models.db_instance import db

whatsapp_settings_bp = Blueprint('whatsapp_settings_bp', __name__)
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), '../../whatsapp_settings.json')

# Modelo simples para banco de dados (opcional, pode ser expandido)
from sqlalchemy import Column, Integer, String, Boolean
class WhatsAppSettings(db.Model):
    __tablename__ = 'whatsapp_settings'
    id = db.Column(db.Integer, primary_key=True)
    whatsapp_token = db.Column(db.String(255))
    whatsapp_number = db.Column(db.String(50))
    webhook_url = db.Column(db.String(255))
    verification_token = db.Column(db.String(255))
    auto_reply = db.Column(db.Boolean)
    continuous_learning = db.Column(db.Boolean)

@whatsapp_settings_bp.route('/api/platforms/whatsapp/settings', methods=['POST'])
def save_whatsapp_settings():
    data = request.get_json()
    # Salvar em arquivo JSON
    try:
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao salvar arquivo: {str(e)}'}), 500
    # Salvar no banco de dados (apenas 1 registro, sobrescreve)
    try:
        settings = WhatsAppSettings.query.first()
        if not settings:
            settings = WhatsAppSettings()
            db.session.add(settings)
        settings.whatsapp_token = data.get('whatsapp_token')
        settings.whatsapp_number = data.get('whatsapp_number')
        settings.webhook_url = data.get('webhook_url')
        settings.verification_token = data.get('verification_token')
        settings.auto_reply = data.get('auto_reply', True)
        settings.continuous_learning = data.get('continuous_learning', True)
        db.session.commit()
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao salvar no banco: {str(e)}'}), 500
    return jsonify({'success': True, 'message': 'Configurações do WhatsApp salvas!'}), 200

@whatsapp_settings_bp.route('/api/platforms/whatsapp/settings', methods=['GET'])
def get_whatsapp_settings():
    # Tenta buscar do banco de dados primeiro
    settings = WhatsAppSettings.query.first()
    if settings:
        return jsonify({
            'whatsapp_token': settings.whatsapp_token,
            'whatsapp_number': settings.whatsapp_number,
            'webhook_url': settings.webhook_url,
            'verification_token': settings.verification_token,
            'auto_reply': settings.auto_reply,
            'continuous_learning': settings.continuous_learning
        })
    # Se não houver, tenta do arquivo
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    return jsonify({})
