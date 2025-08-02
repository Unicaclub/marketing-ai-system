from src.models.db_instance import db

class UserApiKey(db.Model):
    __tablename__ = 'user_api_keys'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service = db.Column(db.String(50), nullable=False)
    api_key = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'service': self.service,
            'api_key': self.api_key
        }
