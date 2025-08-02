from src.models.db_instance import db

class SalesAgent(db.Model):
    __tablename__ = 'sales_agents'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False, default='Agente Global de Vendas')
    active = db.Column(db.Boolean, default=True)

class SalesAgentProduct(db.Model):
    __tablename__ = 'sales_agent_products'
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('sales_agents.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product_databases.id'), nullable=False)

class SalesAgentPlatform(db.Model):
    __tablename__ = 'sales_agent_platforms'
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('sales_agents.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)  # whatsapp, instagram, facebook, etc
    active = db.Column(db.Boolean, default=True)
