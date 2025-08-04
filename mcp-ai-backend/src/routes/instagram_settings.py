import os
import json
from flask import Blueprint, request, jsonify
from src.models.db_instance import db
from sqlalchemy import Column, Integer, String, Boolean, Text

instagram_settings_bp = Blueprint('instagram_settings_bp', __name__)
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), '../../instagram_settings.json')

class InstagramSettings(db.Model):
    __tablename__ = 'instagram_settings'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    access_token = db.Column(db.String(500))
    page_id = db.Column(db.String(100))
    auto_post = db.Column(db.Boolean, default=True)
    auto_stories = db.Column(db.Boolean, default=False)
    default_hashtags = db.Column(db.Text)

@instagram_settings_bp.route('/api/platforms/instagram/settings', methods=['POST'])
def save_instagram_settings():
    data = request.get_json()
    # Salvar em arquivo JSON
    try:
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao salvar arquivo: {str(e)}'}), 500
    
    # Salvar no banco de dados (apenas 1 registro, sobrescreve)
    try:
        settings = InstagramSettings.query.first()
        if not settings:
            settings = InstagramSettings()
            db.session.add(settings)
        
        settings.username = data.get('username')
        settings.access_token = data.get('access_token')
        settings.page_id = data.get('page_id')
        settings.auto_post = data.get('auto_post', True)
        settings.auto_stories = data.get('auto_stories', False)
        settings.default_hashtags = data.get('default_hashtags', '')
        
        db.session.commit()
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao salvar no banco: {str(e)}'}), 500
    
    return jsonify({'success': True, 'message': 'Configurações do Instagram salvas!'}), 200

@instagram_settings_bp.route('/api/platforms/instagram/settings', methods=['GET'])
def get_instagram_settings():
    # Tenta buscar do banco de dados primeiro
    settings = InstagramSettings.query.first()
    if settings:
        return jsonify({
            'username': settings.username,
            'access_token': settings.access_token,
            'page_id': settings.page_id,
            'auto_post': settings.auto_post,
            'auto_stories': settings.auto_stories,
            'default_hashtags': settings.default_hashtags
        })
    
    # Se não houver, tenta do arquivo
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    
    return jsonify({})