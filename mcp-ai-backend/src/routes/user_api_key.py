from flask import Blueprint, request, jsonify
from src.models.user_api_key import UserApiKey
from src.models.user import User
from src.models.db_instance import db

api_key_bp = Blueprint('api_key', __name__)

@api_key_bp.route('/user_api_keys', methods=['POST'])
def save_api_key():
    data = request.get_json()
    user_id = data.get('user_id')
    service = data.get('service')
    api_key = data.get('api_key')
    if not user_id or not service or not api_key:
        return jsonify({'error': 'user_id, service e api_key são obrigatórios'}), 400
    # Atualiza se já existir
    existing = UserApiKey.query.filter_by(user_id=user_id, service=service).first()
    if existing:
        existing.api_key = api_key
        db.session.commit()
        return jsonify(existing.to_dict()), 200
    # Cria novo
    new_key = UserApiKey(user_id=user_id, service=service, api_key=api_key)
    db.session.add(new_key)
    db.session.commit()
    return jsonify(new_key.to_dict()), 201

@api_key_bp.route('/user_api_keys/<int:user_id>', methods=['GET'])
def get_api_keys(user_id):
    keys = UserApiKey.query.filter_by(user_id=user_id).all()
    return jsonify([k.to_dict() for k in keys]), 200
