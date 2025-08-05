from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.automation_engine import AutomationEngine
from src.models.automation import Automation, Contact, Message, MessageTemplate, AutomationMetrics
from src.models.db_instance import db
from datetime import datetime, date

automation_bp = Blueprint('automation', __name__)
engine = AutomationEngine()

# Automações
@automation_bp.route('/api/automations', methods=['POST'])
@jwt_required()
def create_automation():
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        automation = Automation(
            user_id=user_id,
            name=data['name'],
            trigger_type=data['trigger_type'],
            trigger_config=data.get('trigger_config', {}),
            actions=data.get('actions', [])
        )
        
        db.session.add(automation)
        db.session.commit()
        
        return jsonify({
            'message': 'Automação criada com sucesso',
            'automation': automation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/automations', methods=['GET'])
@jwt_required()
def get_automations():
    try:
        user_id = get_jwt_identity()
        automations = Automation.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'automations': [automation.to_dict() for automation in automations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/automations/<int:automation_id>', methods=['GET'])
@jwt_required()
def get_automation(automation_id):
    try:
        user_id = get_jwt_identity()
        automation = Automation.query.filter_by(id=automation_id, user_id=user_id).first()
        
        if not automation:
            return jsonify({'error': 'Automação não encontrada'}), 404
            
        return jsonify({'automation': automation.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/automations/<int:automation_id>', methods=['PUT'])
@jwt_required()
def update_automation(automation_id):
    try:
        user_id = get_jwt_identity()
        automation = Automation.query.filter_by(id=automation_id, user_id=user_id).first()
        
        if not automation:
            return jsonify({'error': 'Automação não encontrada'}), 404
        
        data = request.json
        automation.name = data.get('name', automation.name)
        automation.trigger_type = data.get('trigger_type', automation.trigger_type)
        automation.trigger_config = data.get('trigger_config', automation.trigger_config)
        automation.actions = data.get('actions', automation.actions)
        automation.is_active = data.get('is_active', automation.is_active)
        automation.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Automação atualizada com sucesso',
            'automation': automation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/automations/<int:automation_id>', methods=['DELETE'])
@jwt_required()
def delete_automation(automation_id):
    try:
        user_id = get_jwt_identity()
        automation = Automation.query.filter_by(id=automation_id, user_id=user_id).first()
        
        if not automation:
            return jsonify({'error': 'Automação não encontrada'}), 404
        
        db.session.delete(automation)
        db.session.commit()
        
        return jsonify({'message': 'Automação deletada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Contatos
@automation_bp.route('/api/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        tags = request.args.getlist('tags')
        
        query = Contact.query.filter_by(user_id=user_id)
        
        # Filtrar por tags se fornecidas
        if tags:
            for tag in tags:
                query = query.filter(Contact.tags.contains([tag]))
        
        contacts = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'contacts': [contact.to_dict() for contact in contacts.items],
            'total': contacts.total,
            'pages': contacts.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/contacts/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    try:
        user_id = get_jwt_identity()
        contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
        
        if not contact:
            return jsonify({'error': 'Contato não encontrado'}), 404
        
        data = request.json
        contact.name = data.get('name', contact.name)
        contact.email = data.get('email', contact.email)
        contact.tags = data.get('tags', contact.tags)
        contact.custom_fields = data.get('custom_fields', contact.custom_fields)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Contato atualizado com sucesso',
            'contact': contact.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Templates de Mensagem
@automation_bp.route('/api/templates', methods=['POST'])
@jwt_required()
def create_template():
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        template = MessageTemplate(
            user_id=user_id,
            name=data['name'],
            content=data['content'],
            variables=data.get('variables', []),
            category=data.get('category')
        )
        
        db.session.add(template)
        db.session.commit()
        
        return jsonify({
            'message': 'Template criado com sucesso',
            'template': template.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/templates', methods=['GET'])
@jwt_required()
def get_templates():
    try:
        user_id = get_jwt_identity()
        category = request.args.get('category')
        
        query = MessageTemplate.query.filter_by(user_id=user_id)
        if category:
            query = query.filter_by(category=category)
            
        templates = query.all()
        
        return jsonify({
            'templates': [template.to_dict() for template in templates]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Métricas e Analytics
@automation_bp.route('/api/automations/<int:automation_id>/analytics', methods=['GET'])
@jwt_required()
def get_automation_analytics(automation_id):
    try:
        user_id = get_jwt_identity()
        automation = Automation.query.filter_by(id=automation_id, user_id=user_id).first()
        
        if not automation:
            return jsonify({'error': 'Automação não encontrada'}), 404
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        analytics = engine.get_automation_analytics(automation_id, start_date, end_date)
        
        return jsonify(analytics), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/contacts/segments', methods=['POST'])
@jwt_required()
def get_contact_segments():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        tags = data.get('tags', [])
        custom_filters = data.get('filters', {})
        
        contacts = engine.get_contact_segments(user_id, tags, custom_filters)
        
        return jsonify({
            'contacts': [contact.to_dict() for contact in contacts],
            'total': len(contacts)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Mensagens
@automation_bp.route('/api/messages', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        user_id = get_jwt_identity()
        contact_id = request.args.get('contact_id', type=int)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        query = Message.query.filter_by(user_id=user_id)
        if contact_id:
            query = query.filter_by(contact_id=contact_id)
            
        messages = query.order_by(Message.timestamp.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'messages': [message.to_dict() for message in messages.items],
            'total': messages.total,
            'pages': messages.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/api/messages/send', methods=['POST'])
@jwt_required()
def send_message():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        contact_id = data['contact_id']
        content = data['content']
        message_type = data.get('message_type', 'text')
        platform = data.get('platform', 'whatsapp')
        
        contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
        if not contact:
            return jsonify({'error': 'Contato não encontrado'}), 404
        
        # Personalizar mensagem
        personalized_content = engine._personalize_message(content, contact)
        
        # Salvar mensagem
        message = Message(
            user_id=user_id,
            contact_id=contact_id,
            message_type=message_type,
            content=personalized_content,
            direction='outbound',
            platform=platform
        )
        db.session.add(message)
        db.session.commit()
        
        # Aqui você integraria com a API do canal escolhido
        # engine._send_to_platform(platform, contact.phone, personalized_content)
        
        return jsonify({
            'message': 'Mensagem enviada com sucesso',
            'sent_message': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Webhook para receber mensagens
@automation_bp.route('/api/webhook/<platform>', methods=['POST'])
def webhook_receiver(platform):
    """Recebe webhooks de diferentes plataformas"""
    try:
        data = request.json
        
        # Processar webhook baseado na plataforma
        if platform == 'whatsapp':
            return _process_whatsapp_webhook(data)
        elif platform == 'telegram':
            return _process_telegram_webhook(data)
        elif platform == 'instagram':
            return _process_instagram_webhook(data)
        else:
            return jsonify({'error': 'Plataforma não suportada'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def _process_whatsapp_webhook(data):
    """Processa webhook do WhatsApp"""
    # Adaptar baseado na estrutura do seu provedor (Z-API, etc.)
    if data.get('type') == 'message':
        user_id = data.get('user_id')  # Você precisa identificar o usuário
        phone = data.get('from')
        message = data.get('text', {}).get('body', '')
        
        if user_id and phone and message:
            engine.process_incoming_message(user_id, phone, message, 'whatsapp')
            
    return jsonify({'status': 'ok'})

def _process_telegram_webhook(data):
    """Processa webhook do Telegram"""
    # Implementar lógica específica do Telegram
    return jsonify({'status': 'ok'})

def _process_instagram_webhook(data):
    """Processa webhook do Instagram"""
    # Implementar lógica específica do Instagram
    return jsonify({'status': 'ok'})