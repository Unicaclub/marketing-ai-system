from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_sessions_bp = Blueprint('whatsapi_sessions', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/generate-token', methods=['POST'])
@jwt_required()
def generate_token():
    """Generate token for session"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        secretkey = data.get('secretkey')
        
        if not session or not secretkey:
            return jsonify({'success': False, 'error': 'session and secretkey are required'}), 400
        
        result = whatsapi_service.generate_token(session, secretkey)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/all', methods=['GET'])
@jwt_required()
def show_all_sessions():
    """Show all sessions"""
    try:
        secretkey = request.args.get('secretkey')
        if not secretkey:
            return jsonify({'success': False, 'error': 'secretkey is required'}), 400
        
        result = whatsapi_service.show_all_sessions(secretkey)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/start-all', methods=['POST'])
@jwt_required()
def start_all_sessions():
    """Start all sessions"""
    try:
        data = request.get_json()
        secretkey = data.get('secretkey')
        
        if not secretkey:
            return jsonify({'success': False, 'error': 'secretkey is required'}), 400
        
        result = whatsapi_service.start_all_sessions(secretkey)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/check-connection', methods=['GET'])
@jwt_required()
def check_connection_session():
    """Check session connection"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.check_connection_session(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/qrcode', methods=['GET'])
@jwt_required()
def get_qrcode_session():
    """Get QR code for session"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_qrcode_session(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/start', methods=['POST'])
@jwt_required()
def start_session():
    """Start session"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.start_session(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/logout', methods=['POST'])
@jwt_required()
def logout_session():
    """Logout session"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.logout_session(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/close', methods=['POST'])
@jwt_required()
def close_session():
    """Close session"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.close_session(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/status', methods=['GET'])
@jwt_required()
def get_status_session():
    """Get session status"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_status_session(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_sessions_bp.route('/api/whatsapi/sessions/clear-data', methods=['POST'])
@jwt_required()
def clear_session_data():
    """Clear session data"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        secretkey = data.get('secretkey')
        
        if not session or not secretkey:
            return jsonify({'success': False, 'error': 'session and secretkey are required'}), 400
        
        result = whatsapi_service.clear_session_data(session, secretkey, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500