from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_groups_bp = Blueprint('whatsapi_groups', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

@whatsapi_groups_bp.route('/api/whatsapi/groups/<group_id>/members', methods=['GET'])
@jwt_required()
def get_group_members(group_id):
    """Get group members"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_group_members(session, group_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/<group_id>/members/ids', methods=['GET'])
@jwt_required()
def get_group_members_ids(group_id):
    """Get group member IDs"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_group_members_ids(session, group_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/<group_id>/admins', methods=['GET'])
@jwt_required()
def get_group_admins(group_id):
    """Get group admins"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_group_admins(session, group_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/<group_id>/invite-link', methods=['GET'])
@jwt_required()
def get_group_invite_link(group_id):
    """Get group invite link"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_group_invite_link(session, group_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/<group_id>/revoke-link', methods=['GET'])
@jwt_required()
def revoke_group_invite_link(group_id):
    """Revoke group invite link"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.revoke_group_invite_link(session, group_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/common/<wid>', methods=['GET'])
@jwt_required()
def get_common_groups(wid):
    """Get common groups with contact"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_common_groups(session, wid)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/create', methods=['POST'])
@jwt_required()
def create_group():
    """Create new group"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.create_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/leave', methods=['POST'])
@jwt_required()
def leave_group():
    """Leave group"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.leave_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/join-by-code', methods=['POST'])
@jwt_required()
def join_group_by_code():
    """Join group by invite code"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.join_group_by_code(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/add-participant', methods=['POST'])
@jwt_required()
def add_participant_group():
    """Add participant to group"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.add_participant_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/remove-participant', methods=['POST'])
@jwt_required()
def remove_participant_group():
    """Remove participant from group"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.remove_participant_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/promote-participant', methods=['POST'])
@jwt_required()
def promote_participant_group():
    """Promote participant to admin"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.promote_participant_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/demote-participant', methods=['POST'])
@jwt_required()
def demote_participant_group():
    """Demote admin to participant"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.demote_participant_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/info-from-invite-link', methods=['POST'])
@jwt_required()
def get_group_info_from_invite_link():
    """Get group info from invite link"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_group_info_from_invite_link(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/set-description', methods=['POST'])
@jwt_required()
def set_group_description():
    """Set group description"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_group_description(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/set-property', methods=['POST'])
@jwt_required()
def set_group_property():
    """Set group property"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_group_property(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/set-subject', methods=['POST'])
@jwt_required()
def set_group_subject():
    """Set group subject/name"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_group_subject(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/messages-admins-only', methods=['POST'])
@jwt_required()
def set_messages_admins_only():
    """Set messages to admins only"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_messages_admins_only(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/set-pic', methods=['POST'])
@jwt_required()
def set_group_pic():
    """Set group picture"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_group_pic(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_groups_bp.route('/api/whatsapi/groups/change-privacy', methods=['POST'])
@jwt_required()
def change_privacy_group():
    """Change group privacy settings"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.change_privacy_group(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500