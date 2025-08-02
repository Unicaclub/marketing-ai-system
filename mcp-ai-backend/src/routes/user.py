

from flask import Blueprint, request, jsonify
from src.models.user import User
from src.models.db_instance import db
from src.models.zapi_credentials import ZapiCredentials
import requests
@user_bp.route('/zapi/credentials', methods=['POST'])
def save_zapi_credentials():
    data = request.get_json()
    user_id = data.get('user_id')
    instance_id = data.get('instance_id')
    token = data.get('token')
    if not user_id or not instance_id or not token:
        return jsonify({'success': False, 'error': 'user_id, instance_id e token são obrigatórios'}), 400
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if cred:
        cred.instance_id = instance_id
        cred.token = token
    else:
        cred = ZapiCredentials(user_id=user_id, instance_id=instance_id, token=token)
        db.session.add(cred)
    db.session.commit()
    return jsonify({'success': True, 'credentials': {
        'user_id': cred.user_id,
        'instance_id': cred.instance_id,
        'token': cred.token
    }}), 200

@user_bp.route('/zapi/credentials/<int:user_id>', methods=['GET'])
def get_zapi_credentials(user_id):
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return jsonify({'success': False, 'error': 'Credenciais não encontradas'}), 404
    return jsonify({'success': True, 'credentials': {
        'user_id': cred.user_id,
        'instance_id': cred.instance_id,
        'token': cred.token
    }})

@user_bp.route('/zapi/send', methods=['POST'])
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

user_bp = Blueprint('user', __name__)

# Endpoint de debug: consultar hash da senha por e-mail (apenas para teste)
@user_bp.route('/debug/password_hash', methods=['GET'])
def debug_password_hash():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Informe o email'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    return jsonify({'email': user.email, 'password_hash': user.password_hash})

# Endpoint para cadastrar usuário



@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'success': False, 'error': 'username, email e senha são obrigatórios'}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'success': False, 'error': 'Usuário ou email já cadastrado'}), 409
    try:
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'user': user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': f'Erro ao criar usuário: {str(e)}'}), 500

# Endpoint de login
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'success': False, 'error': 'Email e senha são obrigatórios'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'error': 'Usuário não encontrado'}), 404
    if not user.check_password(password):
        return jsonify({'success': False, 'error': 'Senha incorreta'}), 401
    return jsonify({'success': True, 'user': user.to_dict()}), 200

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
