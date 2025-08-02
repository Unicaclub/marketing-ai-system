import json
from flask import Blueprint, request, jsonify
from src.models.campaign import Campaign, ProductDatabase
from src.models.db_instance import db

product_db_bp = Blueprint('product_db', __name__)

@product_db_bp.route('/product_databases', methods=['POST'])
def create_product_database():
    data = request.get_json()
    try:
        pdb = ProductDatabase(
            name=data.get('name'),
            description=data.get('description'),
            products=json.dumps(data.get('products', [])),
            user_id=data.get('user_id')
        )
        db.session.add(pdb)
        db.session.commit()
        return jsonify(pdb.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@product_db_bp.route('/product_databases', methods=['GET'])
def get_product_databases():
    pdbs = ProductDatabase.query.all()
    return jsonify([p.to_dict() for p in pdbs])

@product_db_bp.route('/product_databases/<int:pdb_id>', methods=['GET'])
def get_product_database(pdb_id):
    pdb = ProductDatabase.query.get_or_404(pdb_id)
    return jsonify(pdb.to_dict())

@product_db_bp.route('/product_databases/<int:pdb_id>', methods=['PUT'])
def update_product_database(pdb_id):
    pdb = ProductDatabase.query.get_or_404(pdb_id)
    data = request.get_json()
    pdb.name = data.get('name', pdb.name)
    pdb.description = data.get('description', pdb.description)
    pdb.products = json.dumps(data.get('products', json.loads(pdb.products) if pdb.products else []))
    db.session.commit()
    return jsonify(pdb.to_dict())

@product_db_bp.route('/product_databases/<int:pdb_id>', methods=['DELETE'])
def delete_product_database(pdb_id):
    pdb = ProductDatabase.query.get_or_404(pdb_id)
    db.session.delete(pdb)
    db.session.commit()
    return '', 204
