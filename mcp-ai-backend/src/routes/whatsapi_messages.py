from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_messages_bp = Blueprint('whatsapi_messages', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

@whatsapi_messages_bp.route('/api/whatsapi/messages/<message_id>', methods=['GET'])
@jwt_required()
def get_message_by_id(message_id):
    """Get message by ID"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_message_by_id(session, message_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/<phone>/all', methods=['GET'])
@jwt_required()
def get_messages(phone):
    """Get all messages for a contact"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_messages(session, phone)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/unread', methods=['GET'])
@jwt_required()
def get_unread_messages():
    """Get unread messages"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_unread_messages(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/<message_id>/media', methods=['GET'])
@jwt_required()
def get_media_by_message(message_id):
    """Get media from message"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_media_by_message(session, message_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/<message_id>/reactions', methods=['GET'])
@jwt_required()
def get_reactions(message_id):
    """Get message reactions"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_reactions(session, message_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/<poll_id>/votes', methods=['GET'])
@jwt_required()
def get_votes(poll_id):
    """Get poll votes"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_votes(session, poll_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/download-media', methods=['POST'])
@jwt_required()
def download_media():
    """Download media"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.download_media(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-text', methods=['POST'])
@jwt_required()
def send_message():
    """Send text message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/edit', methods=['POST'])
@jwt_required()
def edit_message():
    """Edit message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.edit_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-image', methods=['POST'])
@jwt_required()
def send_image():
    """Send image message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_image(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-sticker', methods=['POST'])
@jwt_required()
def send_sticker():
    """Send sticker"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_sticker(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-sticker-gif', methods=['POST'])
@jwt_required()
def send_sticker_gif():
    """Send sticker GIF"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_sticker_gif(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-reply', methods=['POST'])
@jwt_required()
def send_reply():
    """Send reply message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_reply(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-file', methods=['POST'])
@jwt_required()
def send_file():
    """Send file"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_file(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-file-base64', methods=['POST'])
@jwt_required()
def send_file_base64():
    """Send file as base64"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_file_base64(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-voice', methods=['POST'])
@jwt_required()
def send_voice():
    """Send voice message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_voice(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-voice-base64', methods=['POST'])
@jwt_required()
def send_voice_base64():
    """Send voice message as base64"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_voice_base64(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-location', methods=['POST'])
@jwt_required()
def send_location():
    """Send location"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_location(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-link-preview', methods=['POST'])
@jwt_required()
def send_link_preview():
    """Send link with preview"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_link_preview(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-mentioned', methods=['POST'])
@jwt_required()
def send_mentioned():
    """Send message with mentions"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_mentioned(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-buttons', methods=['POST'])
@jwt_required()
def send_buttons():
    """Send buttons message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_buttons(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-list', methods=['POST'])
@jwt_required()
def send_list_message():
    """Send list message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_list_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-order', methods=['POST'])
@jwt_required()
def send_order_message():
    """Send order message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_order_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-poll', methods=['POST'])
@jwt_required()
def send_poll_message():
    """Send poll message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_poll_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/send-status', methods=['POST'])
@jwt_required()
def send_status():
    """Send status update"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_status(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/delete', methods=['POST'])
@jwt_required()
def delete_message():
    """Delete message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/react', methods=['POST'])
@jwt_required()
def react_message():
    """React to message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.react_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/forward', methods=['POST'])
@jwt_required()
def forward_messages():
    """Forward messages"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.forward_messages(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/mark-unseen', methods=['POST'])
@jwt_required()
def mark_unseen():
    """Mark messages as unseen"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.mark_unseen(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/temporary', methods=['POST'])
@jwt_required()
def temporary_messages():
    """Set temporary messages"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.temporary_messages(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_messages_bp.route('/api/whatsapi/messages/star', methods=['POST'])
@jwt_required()
def star_message():
    """Star message"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.star_message(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500