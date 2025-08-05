from src.models.db_instance import db
from datetime import datetime

class Automation(db.Model):
    __tablename__ = 'automations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    trigger_type = db.Column(db.String(50), nullable=False)  # 'keyword', 'schedule', 'webhook'
    trigger_config = db.Column(db.JSON)  # Configurações específicas do trigger
    actions = db.Column(db.JSON)  # Lista de ações a executar
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = db.relationship('Message', backref='automation', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'trigger_type': self.trigger_type,
            'trigger_config': self.trigger_config,
            'actions': self.actions,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Contact(db.Model):
    __tablename__ = 'contacts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(200))
    email = db.Column(db.String(200))
    tags = db.Column(db.JSON)  # Tags para segmentação
    custom_fields = db.Column(db.JSON)  # Campos personalizados
    last_interaction = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    messages = db.relationship('Message', backref='contact', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'phone': self.phone,
            'name': self.name,
            'email': self.email,
            'tags': self.tags or [],
            'custom_fields': self.custom_fields or {},
            'last_interaction': self.last_interaction.isoformat() if self.last_interaction else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    automation_id = db.Column(db.Integer, db.ForeignKey('automations.id'), nullable=True)
    message_type = db.Column(db.String(20), default='text')  # 'text', 'image', 'audio', 'document'
    content = db.Column(db.Text)
    direction = db.Column(db.String(10))  # 'inbound', 'outbound'
    platform = db.Column(db.String(20), default='whatsapp')  # 'whatsapp', 'telegram', 'instagram'
    status = db.Column(db.String(20), default='sent')  # 'sent', 'delivered', 'read', 'failed'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'contact_id': self.contact_id,
            'automation_id': self.automation_id,
            'message_type': self.message_type,
            'content': self.content,
            'direction': self.direction,
            'platform': self.platform,
            'status': self.status,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class MessageTemplate(db.Model):
    __tablename__ = 'message_templates'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    variables = db.Column(db.JSON)  # Lista de variáveis disponíveis
    category = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'content': self.content,
            'variables': self.variables or [],
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AutomationMetrics(db.Model):
    __tablename__ = 'automation_metrics'
    id = db.Column(db.Integer, primary_key=True)
    automation_id = db.Column(db.Integer, db.ForeignKey('automations.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    triggers_count = db.Column(db.Integer, default=0)
    messages_sent = db.Column(db.Integer, default=0)
    unique_contacts = db.Column(db.Integer, default=0)
    conversion_rate = db.Column(db.Float, default=0.0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'automation_id': self.automation_id,
            'date': self.date.isoformat() if self.date else None,
            'triggers_count': self.triggers_count,
            'messages_sent': self.messages_sent,
            'unique_contacts': self.unique_contacts,
            'conversion_rate': self.conversion_rate
        }

class QueuedMessage(db.Model):
    __tablename__ = 'queued_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    automation_id = db.Column(db.Integer, db.ForeignKey('automations.id'), nullable=True)
    message_content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')
    platform = db.Column(db.String(20), default='whatsapp')
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'processing', 'sent', 'failed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'contact_id': self.contact_id,
            'automation_id': self.automation_id,
            'message_content': self.message_content,
            'message_type': self.message_type,
            'platform': self.platform,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }