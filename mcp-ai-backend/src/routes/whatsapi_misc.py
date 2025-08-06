from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_misc_bp = Blueprint('whatsapi_misc', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

# Status Stories
@whatsapi_misc_bp.route('/api/whatsapi/stories/send-text', methods=['POST'])
@jwt_required()
def send_text_story():
    """Send text story"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_text_story(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/stories/send-image', methods=['POST'])
@jwt_required()
def send_image_story():
    """Send image story"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_image_story(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/stories/send-video', methods=['POST'])
@jwt_required()
def send_video_story():
    """Send video story"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_video_story(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Labels Management
@whatsapi_misc_bp.route('/api/whatsapi/labels/add', methods=['POST'])
@jwt_required()
def add_new_label():
    """Add new label"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.add_new_label(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/labels/add-or-remove', methods=['POST'])
@jwt_required()
def add_or_remove_label():
    """Add or remove label from chat"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.add_or_remove_label(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/labels/all', methods=['GET'])
@jwt_required()
def get_all_labels():
    """Get all labels"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_all_labels(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/labels/delete-all', methods=['DELETE'])
@jwt_required()
def delete_all_labels():
    """Delete all labels"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_all_labels(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/labels/<label_id>', methods=['DELETE'])
@jwt_required()
def delete_label(label_id):
    """Delete specific label"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_label(session, label_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Broadcast Lists
@whatsapi_misc_bp.route('/api/whatsapi/broadcast-lists', methods=['GET'])
@jwt_required()
def get_all_broadcast_list():
    """Get all broadcast lists"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_all_broadcast_list(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Call Management
@whatsapi_misc_bp.route('/api/whatsapi/calls/reject', methods=['POST'])
@jwt_required()
def reject_call():
    """Reject incoming call"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.reject_call(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Presence Management
@whatsapi_misc_bp.route('/api/whatsapi/presence/subscribe', methods=['POST'])
@jwt_required()
def subscribe_presence():
    """Subscribe to presence updates"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.subscribe_presence(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Platform Info
@whatsapi_misc_bp.route('/api/whatsapi/messages/<message_id>/platform', methods=['GET'])
@jwt_required()
def get_platform_from_message(message_id):
    """Get platform information from message"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_platform_from_message(session, message_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Session Backup and Restore
@whatsapi_misc_bp.route('/api/whatsapi/sessions/backup', methods=['GET'])
@jwt_required()
def backup_sessions():
    """Backup sessions"""
    try:
        secretkey = request.args.get('secretkey')
        if not secretkey:
            return jsonify({'success': False, 'error': 'secretkey is required'}), 400
        
        result = whatsapi_service.backup_sessions(secretkey)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/sessions/restore', methods=['POST'])
@jwt_required()
def restore_sessions():
    """Restore sessions"""
    try:
        data = request.get_json()
        secretkey = data.get('secretkey')
        
        if not secretkey:
            return jsonify({'success': False, 'error': 'secretkey is required'}), 400
        
        result = whatsapi_service.restore_sessions(secretkey, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Limits and Configuration
@whatsapi_misc_bp.route('/api/whatsapi/settings/set-limit', methods=['POST'])
@jwt_required()
def set_limit():
    """Set message limits"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_limit(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Chatwoot Integration
@whatsapi_misc_bp.route('/api/whatsapi/integrations/chatwoot', methods=['POST'])
@jwt_required()
def chatwoot_integration():
    """Configure Chatwoot integration"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.chatwoot_integration(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Health Checks
@whatsapi_misc_bp.route('/api/whatsapi/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        result = whatsapi_service.health_check()
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/unhealthy', methods=['GET'])
def unhealthy_check():
    """Unhealthy check endpoint"""
    try:
        result = whatsapi_service.unhealthy_check()
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_misc_bp.route('/api/whatsapi/metrics', methods=['GET'])
def get_metrics():
    """Get metrics endpoint"""
    try:
        result = whatsapi_service.get_metrics()
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500