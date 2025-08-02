from src.models.db_instance import db

class ZapiCredentials(db.Model):
    __tablename__ = 'zapi_credentials'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    instance_id = db.Column(db.String(100), nullable=False)
    token = db.Column(db.String(100), nullable=False)
    user = db.relationship('User', backref=db.backref('zapi_credentials', lazy=True))
