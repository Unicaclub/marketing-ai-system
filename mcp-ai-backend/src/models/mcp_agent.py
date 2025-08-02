from datetime import datetime
import json
from src.models.db_instance import db
from datetime import datetime
import json
from src.models.db_instance import db

class MCPAgent(db.Model):
    __tablename__ = 'mcp_agents'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Agent configuration
    personality = db.Column(db.Text)  # JSON string defining agent personality
    sales_approach = db.Column(db.String(50))  # consultative, direct, nurturing, upsell
    language = db.Column(db.String(10), default='pt-BR')
    
    # Platform capabilities
    supported_platforms = db.Column(db.Text)  # JSON string of supported platforms
    
    # AI configuration
    model_name = db.Column(db.String(100), default='gpt-4')
    temperature = db.Column(db.Float, default=0.7)
    max_tokens = db.Column(db.Integer, default=1000)
    system_prompt = db.Column(db.Text)
    
    # Performance metrics
    total_interactions = db.Column(db.Integer, default=0)
    successful_conversions = db.Column(db.Integer, default=0)
    average_response_time = db.Column(db.Float, default=0.0)
    customer_satisfaction = db.Column(db.Float, default=0.0)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_learning = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # User relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'configuration': {
                'personality': json.loads(self.personality) if self.personality else {},
                'sales_approach': self.sales_approach,
                'language': self.language,
                'supported_platforms': json.loads(self.supported_platforms) if self.supported_platforms else [],
                'ai_config': {
                    'model_name': self.model_name,
                    'temperature': self.temperature,
                    'max_tokens': self.max_tokens,
                    'system_prompt': self.system_prompt
                }
            },
            'metrics': {
                'total_interactions': self.total_interactions,
                'successful_conversions': self.successful_conversions,
                'average_response_time': self.average_response_time,
                'customer_satisfaction': self.customer_satisfaction,
                'conversion_rate': (self.successful_conversions / self.total_interactions * 100) if self.total_interactions > 0 else 0
            },
            'status': {
                'is_active': self.is_active,
                'is_learning': self.is_learning
            },
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class AgentKnowledge(db.Model):
    __tablename__ = 'agent_knowledge'
    
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('mcp_agents.id'), nullable=False)
    
    # Knowledge categories
    category = db.Column(db.String(50), nullable=False)  # product, objection, script, faq
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    
    # Metadata
    tags = db.Column(db.Text)  # JSON string of tags
    priority = db.Column(db.Integer, default=1)  # 1-5, higher is more important
    usage_count = db.Column(db.Integer, default=0)
    effectiveness_score = db.Column(db.Float, default=0.0)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'category': self.category,
            'title': self.title,
            'content': self.content,
            'metadata': {
                'tags': json.loads(self.tags) if self.tags else [],
                'priority': self.priority,
                'usage_count': self.usage_count,
                'effectiveness_score': self.effectiveness_score
            },
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ConversationFlow(db.Model):
    __tablename__ = 'conversation_flows'
    
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('mcp_agents.id'), nullable=False)
    
    # Flow configuration
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    trigger_conditions = db.Column(db.Text)  # JSON string of conditions
    flow_steps = db.Column(db.Text)  # JSON string of conversation steps
    
    # Performance
    usage_count = db.Column(db.Integer, default=0)
    success_rate = db.Column(db.Float, default=0.0)
    average_completion_time = db.Column(db.Float, default=0.0)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'name': self.name,
            'description': self.description,
            'configuration': {
                'trigger_conditions': json.loads(self.trigger_conditions) if self.trigger_conditions else {},
                'flow_steps': json.loads(self.flow_steps) if self.flow_steps else []
            },
            'performance': {
                'usage_count': self.usage_count,
                'success_rate': self.success_rate,
                'average_completion_time': self.average_completion_time
            },
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

