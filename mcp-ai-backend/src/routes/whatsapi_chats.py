from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_chats_bp = Blueprint('whatsapi_chats', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

@whatsapi_chats_bp.route('/api/whatsapi/chats/list', methods=['POST'])
@jwt_required()
def list_chats():
    """Retrieve a list of chats"""
    try:
        data = request.get_json() or {}
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.list_chats(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/archived', methods=['GET'])
@jwt_required()
def get_archived_chats():
    """Get all archived chats"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_all_chats_archived(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/<phone>/messages', methods=['GET'])
@jwt_required()
def get_all_messages_in_chat(phone):
    """Get all messages in a specific chat"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_all_messages_in_chat(session, phone)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/messages/new', methods=['GET'])
@jwt_required()
def get_all_new_messages():
    """Get all new messages"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_all_new_messages(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/messages/unread', methods=['GET'])
@jwt_required()
def get_all_unread_messages():
    """Get all unread messages"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_all_unread_messages(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/<phone>', methods=['GET'])
@jwt_required()
def get_chat_by_id(phone):
    """Get chat by ID/phone number"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_chat_by_id(session, phone)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/<phone>/online', methods=['GET'])
@jwt_required()
def check_chat_is_online(phone):
    """Check if chat is online"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.check_chat_is_online(session, phone)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/<phone>/last-seen', methods=['GET'])
@jwt_required()
def get_last_seen(phone):
    """Get last seen of chat"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_last_seen(session, phone)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/mutes/<type_param>', methods=['GET'])
@jwt_required()
def list_mutes(type_param):
    """List muted chats by type"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.list_mutes(session, type_param)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/<phone>/load-messages', methods=['GET'])
@jwt_required()
def load_messages_in_chat(phone):
    """Load messages in specific chat"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.load_messages_in_chat(session, phone)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/archive', methods=['POST'])
@jwt_required()
def archive_chat():
    """Archive a chat"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.archive_chat(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/archive-all', methods=['POST'])
@jwt_required()
def archive_all_chats():
    """Archive all chats"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.archive_all_chats(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/clear', methods=['POST'])
@jwt_required()
def clear_chat():
    """Clear a chat"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.clear_chat(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/clear-all', methods=['POST'])
@jwt_required()
def clear_all_chats():
    """Clear all chats"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.clear_all_chats(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/delete', methods=['POST'])
@jwt_required()
def delete_chat():
    """Delete a chat"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_chat(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/delete-all', methods=['POST'])
@jwt_required()
def delete_all_chats():
    """Delete all chats"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_all_chats(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/pin', methods=['POST'])
@jwt_required()
def pin_chat():
    """Pin a chat"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.pin_chat(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/mute', methods=['POST'])
@jwt_required()
def send_mute():
    """Mute a chat"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_mute(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/seen', methods=['POST'])
@jwt_required()
def send_seen():
    """Mark messages as seen"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_seen(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/state', methods=['POST'])
@jwt_required()
def set_chat_state():
    """Set chat state"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_chat_state(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/typing', methods=['POST'])
@jwt_required()
def set_typing():
    """Set typing indicator"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_typing(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_chats_bp.route('/api/whatsapi/chats/recording', methods=['POST'])
@jwt_required()
def set_recording():
    """Set recording indicator"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_recording(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500