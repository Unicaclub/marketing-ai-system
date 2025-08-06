from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.whatsapi_service import WhatsAPIService
from src.models.zapi_credentials import ZapiCredentials

whatsapi_business_bp = Blueprint('whatsapi_business', __name__)
whatsapi_service = WhatsAPIService()

def get_user_session():
    """Get user's session ID from their credentials"""
    user_id = get_jwt_identity()
    cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
    if not cred:
        return None
    return cred.instance_id

# Products Management
@whatsapi_business_bp.route('/api/whatsapi/business/products', methods=['GET'])
@jwt_required()
def get_products():
    """Get all products"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_products(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/by-id', methods=['GET'])
@jwt_required()
def get_product_by_id():
    """Get product by ID"""
    try:
        session = request.args.get('session') or get_user_session()
        product_id = request.args.get('product_id')
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        data = {'product_id': product_id} if product_id else {}
        result = whatsapi_service.get_product_by_id(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products', methods=['POST'])
@jwt_required()
def add_product():
    """Add new product"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.add_product(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/edit', methods=['POST'])
@jwt_required()
def edit_product():
    """Edit existing product"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.edit_product(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/delete', methods=['POST'])
@jwt_required()
def delete_products():
    """Delete products"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_products(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/change-image', methods=['POST'])
@jwt_required()
def change_product_image():
    """Change product image"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.change_product_image(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/add-image', methods=['POST'])
@jwt_required()
def add_product_image():
    """Add product image"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.add_product_image(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/remove-image', methods=['POST'])
@jwt_required()
def remove_product_image():
    """Remove product image"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.remove_product_image(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/products/set-visibility', methods=['POST'])
@jwt_required()
def set_product_visibility():
    """Set product visibility"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_product_visibility(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Collections Management
@whatsapi_business_bp.route('/api/whatsapi/business/collections', methods=['GET'])
@jwt_required()
def get_collections():
    """Get all collections"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_collections(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/collections', methods=['POST'])
@jwt_required()
def create_collection():
    """Create new collection"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.create_collection(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/collections/edit', methods=['POST'])
@jwt_required()
def edit_collection():
    """Edit existing collection"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.edit_collection(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/collections/delete', methods=['POST'])
@jwt_required()
def delete_collection():
    """Delete collection"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_collection(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Cart and Business Settings
@whatsapi_business_bp.route('/api/whatsapi/business/set-cart-enabled', methods=['POST'])
@jwt_required()
def set_cart_enabled():
    """Enable/disable cart"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.set_cart_enabled(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/profiles-products', methods=['GET'])
@jwt_required()
def get_business_profiles_products():
    """Get business profiles products"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_business_profiles_products(session)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/orders/<message_id>', methods=['GET'])
@jwt_required()
def get_order_by_message_id(message_id):
    """Get order by message ID"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_order_by_message_id(session, message_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Community Management
@whatsapi_business_bp.route('/api/whatsapi/business/community/create', methods=['POST'])
@jwt_required()
def create_community():
    """Create community"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.create_community(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/community/deactivate', methods=['POST'])
@jwt_required()
def deactivate_community():
    """Deactivate community"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.deactivate_community(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/community/add-subgroup', methods=['POST'])
@jwt_required()
def add_community_subgroup():
    """Add subgroup to community"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.add_community_subgroup(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/community/remove-subgroup', methods=['POST'])
@jwt_required()
def remove_community_subgroup():
    """Remove subgroup from community"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.remove_community_subgroup(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/community/promote-participant', methods=['POST'])
@jwt_required()
def promote_community_participant():
    """Promote community participant"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.promote_community_participant(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/community/demote-participant', methods=['POST'])
@jwt_required()
def demote_community_participant():
    """Demote community participant"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.demote_community_participant(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/community/<community_id>/participants', methods=['GET'])
@jwt_required()
def get_community_participants(community_id):
    """Get community participants"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.get_community_participants(session, community_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Newsletter Management
@whatsapi_business_bp.route('/api/whatsapi/business/newsletter', methods=['POST'])
@jwt_required()
def create_newsletter():
    """Create newsletter"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.create_newsletter(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/newsletter/<newsletter_id>', methods=['PUT'])
@jwt_required()
def update_newsletter(newsletter_id):
    """Update newsletter"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.update_newsletter(session, newsletter_id, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/newsletter/<newsletter_id>', methods=['DELETE'])
@jwt_required()
def delete_newsletter(newsletter_id):
    """Delete newsletter"""
    try:
        session = request.args.get('session') or get_user_session()
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.delete_newsletter(session, newsletter_id)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@whatsapi_business_bp.route('/api/whatsapi/business/newsletter/<newsletter_id>/mute', methods=['POST'])
@jwt_required()
def mute_newsletter(newsletter_id):
    """Mute newsletter"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.mute_newsletter(session, newsletter_id, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Send catalog link
@whatsapi_business_bp.route('/api/whatsapi/business/send-catalog-link', methods=['POST'])
@jwt_required()
def send_link_catalog():
    """Send catalog link"""
    try:
        data = request.get_json()
        session = data.get('session') or get_user_session()
        
        if not session:
            return jsonify({'success': False, 'error': 'session is required'}), 400
        
        result = whatsapi_service.send_link_catalog(session, data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500