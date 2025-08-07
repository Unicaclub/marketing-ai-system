from flask import Blueprint, request, jsonify
from src.services.whatsapp_api_service import start_session, list_sessions, remove_session, send_text, send_image, send_file, send_sticker, send_contact, send_location

wpp_bp = Blueprint('wpp', __name__)

@wpp_bp.route('/wpp/session/start', methods=['POST'])
def api_start_session():
    try:
        data = request.get_json()
        phone = data.get('phone') if data else None
        if not phone:
            return jsonify({"error": True, "details": "Campo 'phone' é obrigatório."}), 400
        result = start_session(phone)
        if isinstance(result, dict) and result.get("error"):
            return jsonify(result), 502
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": True, "details": str(e)}), 500

@wpp_bp.route('/wpp/session/list', methods=['GET'])
def api_list_sessions():
    return jsonify(list_sessions())

@wpp_bp.route('/wpp/session/<session_name>', methods=['DELETE'])
def api_remove_session(session_name):
    return jsonify(remove_session(session_name))

@wpp_bp.route('/wpp/send-text', methods=['POST'])
def api_send_text():
    data = request.json
    return jsonify(send_text(data['session'], data['phone'], data['message']))

@wpp_bp.route('/wpp/send-image', methods=['POST'])
def api_send_image():
    data = request.json
    return jsonify(send_image(data['session'], data['phone'], data['image'], data.get('caption', '')))

@wpp_bp.route('/wpp/send-file', methods=['POST'])
def api_send_file():
    data = request.json
    return jsonify(send_file(data['session'], data['phone'], data['file'], data['filename']))

@wpp_bp.route('/wpp/send-sticker', methods=['POST'])
def api_send_sticker():
    data = request.json
    return jsonify(send_sticker(data['session'], data['phone'], data['sticker']))

@wpp_bp.route('/wpp/send-contact', methods=['POST'])
def api_send_contact():
    data = request.json
    return jsonify(send_contact(data['session'], data['phone'], data['contact']))

@wpp_bp.route('/wpp/send-location', methods=['POST'])
def api_send_location():
    data = request.json
    return jsonify(send_location(
        data['session'], data['phone'],
        data['latitude'], data['longitude'],
        data.get('description', '')
    ))
