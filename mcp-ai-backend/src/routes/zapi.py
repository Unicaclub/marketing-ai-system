from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.zapi_credentials import ZapiCredentials
from src.models.db_instance import db
import requests

zapi_bp = Blueprint('zapi', __name__)

@zapi_bp.route('/api/zapi/credentials', methods=['POST'])
@jwt_required()
def save_zapi_credentials():
    user_id = get_jwt_identity()
    data = request.get_json()
    instance_id = data.get('instance_id')
    token = data.get('token')
    if not instance_id or not token:
        return jsonify({'success': False, 'error': 'instance_id e token são obrigatórios'}), 400
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if cred:
        cred.instance_id = instance_id
        cred.token = token
    else:
        cred = ZapiCredentials(user_id=user_id, instance_id=instance_id, token=token)
        db.session.add(cred)
    db.session.commit()
    return jsonify({'success': True})

@zapi_bp.route('/api/zapi/credentials', methods=['GET'])
@jwt_required()
def get_zapi_credentials():
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return jsonify({'success': False, 'error': 'Credenciais não encontradas'}), 404
    return jsonify({'success': True, 'credentials': {
        'instance_id': cred.instance_id,
        'token': cred.token
    }})

@zapi_bp.route('/api/zapi/send', methods=['POST'])
def send_whatsapp_message():
    data = request.get_json()
    user_id = data.get('user_id')
    phone = data.get('phone')
    message = data.get('message')
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return jsonify({'success': False, 'error': 'Credenciais Z-API não encontradas'}), 404
    url = f"https://api.z-api.io/instances/{cred.instance_id}/token/{cred.token}/send-text"
    payload = {"phone": phone, "message": message}
    try:
        resp = requests.post(url, json=payload)
        return jsonify({'success': True, 'zapi_response': resp.json()})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
