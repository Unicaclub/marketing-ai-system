from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_profile_bp = Blueprint('whatsapi_profile', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

@whatsapi_profile_bp.route('/api/whatsapi/profile/set-pic', methods=['POST'])
@jwt_required()
def set_profile_pic():
    """Set profile picture"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_profile_pic(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/set-status', methods=['POST'])
@jwt_required()
def set_profile_status():
    """Set profile status"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_profile_status(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/change-username', methods=['POST'])
@jwt_required()
def change_username():
    """Change username"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.change_username(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/edit-business', methods=['POST'])
@jwt_required()
def edit_business_profile():
    """Edit business profile"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.edit_business_profile(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/phone-number', methods=['GET'])
@jwt_required()
def get_phone_number():
    """Get phone number"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_phone_number(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/device-info', methods=['GET'])
@jwt_required()
def get_host_device():
    """Get device information"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_host_device(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/battery-level', methods=['GET'])
@jwt_required()
def get_battery_level():
    """Get battery level"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_battery_level(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_profile_bp.route('/api/whatsapi/profile/screenshot', methods=['GET'])
@jwt_required()
def take_screenshot():
    """Take screenshot"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.take_screenshot(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500