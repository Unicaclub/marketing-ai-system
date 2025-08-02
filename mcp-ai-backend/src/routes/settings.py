import os
import json
from flask import Blueprint, request, jsonify

settings_bp = Blueprint('settings_bp', __name__)
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), '../../settings.json')

@settings_bp.route('/api/settings', methods=['POST'])
def save_settings():
    data = request.get_json()
    try:
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return jsonify({'success': True, 'message': 'Configurações salvas com sucesso!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@settings_bp.route('/api/settings', methods=['GET'])
def get_settings():
    if not os.path.exists(SETTINGS_FILE):
        return jsonify({})
    with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)
