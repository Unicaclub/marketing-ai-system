from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Campaign(db.Model):
    __tablename__ = 'campaigns'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    objective = db.Column(db.String(50), nullable=False)  # brand_awareness, traffic, engagement, leads, app_promotion, sales
    status = db.Column(db.String(20), default='draft')  # draft, active, paused, completed
    
    # Platform configuration
    platforms = db.Column(db.Text)  # JSON string of selected platforms
    
    # Target audience
    target_audience = db.Column(db.Text)  # JSON string
    
    # Budget configuration
    budget_type = db.Column(db.String(20))  # daily, total
    budget_amount = db.Column(db.Float)
    budget_duration = db.Column(db.Integer)
    
    # Content
    content_headline = db.Column(db.Text)
    content_description = db.Column(db.Text)
    content_cta = db.Column(db.String(255))
    content_media = db.Column(db.Text)  # JSON string of media files
    
    # Schedule
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    timezone = db.Column(db.String(50))
    
    # Sales specific
    sales_strategy = db.Column(db.String(50))  # consultative, direct, nurturing, upsell
    product_database_id = db.Column(db.Integer, db.ForeignKey('product_databases.id'))
    
    # Metrics
    reach = db.Column(db.Integer, default=0)
    conversions = db.Column(db.Integer, default=0)
    roi = db.Column(db.Float, default=0.0)
    spent = db.Column(db.Float, default=0.0)
    ctr = db.Column(db.Float, default=0.0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # User relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'objective': self.objective,
            'status': self.status,
            'platforms': json.loads(self.platforms) if self.platforms else [],
            'target_audience': json.loads(self.target_audience) if self.target_audience else {},
            'budget': {
                'type': self.budget_type,
                'amount': self.budget_amount,
                'duration': self.budget_duration
            },
            'content': {
                'headline': self.content_headline,
                'description': self.content_description,
                'cta': self.content_cta,
                'media': json.loads(self.content_media) if self.content_media else []
            },
            'schedule': {
                'start_date': self.start_date.isoformat() if self.start_date else None,
                'end_date': self.end_date.isoformat() if self.end_date else None,
                'timezone': self.timezone
            },
            'sales_strategy': self.sales_strategy,
            'metrics': {
                'reach': self.reach,
                'conversions': self.conversions,
                'roi': self.roi,
                'spent': self.spent,
                'ctr': self.ctr
            },
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ProductDatabase(db.Model):
    __tablename__ = 'product_databases'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    products = db.Column(db.Text)  # JSON string of products
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'products': json.loads(self.products) if self.products else [],
            'created_at': self.created_at.isoformat()
        }

class SalesInteraction(db.Model):
    __tablename__ = 'sales_interactions'
    
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)  # whatsapp, instagram, facebook, tiktok
    customer_id = db.Column(db.String(255))  # Platform-specific customer ID
    customer_name = db.Column(db.String(255))
    customer_phone = db.Column(db.String(50))
    customer_email = db.Column(db.String(255))
    
    # Interaction data
    interaction_type = db.Column(db.String(50))  # initial_contact, follow_up, closing, completed
    message_content = db.Column(db.Text)
    ai_response = db.Column(db.Text)
    sentiment = db.Column(db.String(20))  # positive, neutral, negative
    stage = db.Column(db.String(50))  # awareness, interest, consideration, purchase, retention
    
    # Sales data
    product_interest = db.Column(db.Text)  # JSON string of interested products
    conversion_probability = db.Column(db.Float, default=0.0)
    deal_value = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='active')  # active, converted, lost, nurturing
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'platform': self.platform,
            'customer': {
                'id': self.customer_id,
                'name': self.customer_name,
                'phone': self.customer_phone,
                'email': self.customer_email
            },
            'interaction': {
                'type': self.interaction_type,
                'message': self.message_content,
                'ai_response': self.ai_response,
                'sentiment': self.sentiment,
                'stage': self.stage
            },
            'sales': {
                'product_interest': json.loads(self.product_interest) if self.product_interest else [],
                'conversion_probability': self.conversion_probability,
                'deal_value': self.deal_value,
                'status': self.status
            },
            'created_at': self.created_at.isoformat()
        }

