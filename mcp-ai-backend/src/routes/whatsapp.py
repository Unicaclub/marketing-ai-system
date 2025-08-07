from flask import Blueprint, request, jsonify
from src.services.whatsapp_api_service import *

whatsapp_bp = Blueprint('whatsapp', __name__)

@whatsapp_bp.route('/api/whatsapp/session', methods=['POST'])
def api_start_session():
    phone = request.json.get('phone')
    return jsonify(start_session(phone))

@whatsapp_bp.route('/api/whatsapp/sessions', methods=['GET'])
def api_list_sessions():
    return jsonify(list_sessions())

@whatsapp_bp.route('/api/whatsapp/session/logout', methods=['POST'])
def api_logout_session():
    session_id = request.json.get('session')
    return jsonify(logout_session(session_id))

@whatsapp_bp.route('/api/whatsapp/send', methods=['POST'])
def api_send_message():
    data = request.json
    return jsonify(send_message(data['session'], data['phone'], data['message']))

@whatsapp_bp.route('/api/whatsapp/send-image', methods=['POST'])
def api_send_image():
    data = request.json
    return jsonify(send_image(data['session'], data['phone'], data['image'], data.get('caption', '')))

@whatsapp_bp.route('/api/whatsapp/send-file', methods=['POST'])
def api_send_file():
    data = request.json
    return jsonify(send_file(data['session'], data['phone'], data['file'], data['filename']))

@whatsapp_bp.route('/api/whatsapp/send-sticker', methods=['POST'])
def api_send_sticker():
    data = request.json
    return jsonify(send_sticker(data['session'], data['phone'], data['sticker']))

@whatsapp_bp.route('/api/whatsapp/send-contact', methods=['POST'])
def api_send_contact():
    data = request.json
    return jsonify(send_contact(data['session'], data['phone'], data['contact']))

@whatsapp_bp.route('/api/whatsapp/send-location', methods=['POST'])
def api_send_location():
    data = request.json
    return jsonify(send_location(data['session'], data['phone'], data['latitude'], data['longitude'], data.get('description', '')))

@whatsapp_bp.route('/api/webhook/whatsapp', methods=['POST'])
def whatsapp_webhook():
    event = request.json
    # Aqui você pode processar o evento recebido do WhatsApi
    # Exemplo: salvar no banco, disparar automação, etc.
    return jsonify({"status": "received"})
