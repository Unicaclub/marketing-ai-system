import os
import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.db_instance import db
from src.models.user import User
from src.models.campaign import Campaign, ProductDatabase, SalesInteraction
from src.models.mcp_agent import MCPAgent, AgentKnowledge, ConversationFlow
from src.routes.user import user_bp
from src.routes.mcp_agent import mcp_agent_bp
from src.routes.sales_strategy import sales_strategy_bp

# Importar configurações
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config import config

def create_app(config_name=None):
    """Factory function para criar a aplicação Flask"""
    # Sempre usar produção por padrão
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'production')

    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

    # Carregar configuração
    config_obj = config[config_name]()
    app.config.from_object(config_obj)

    # Configurar URI do banco de dados
    app.config['SQLALCHEMY_DATABASE_URI'] = config_obj.SQLALCHEMY_DATABASE_URI

    # Enable CORS for all routes
    CORS(app, origins="*")

    # Inicializar banco de dados
    db.init_app(app)

    # Registrar blueprints
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(mcp_agent_bp, url_prefix='/api/mcp')
    app.register_blueprint(sales_strategy_bp, url_prefix='/api/sales')
    # Registrar blueprint de campanhas
    from src.routes.campaign import campaign_bp
    app.register_blueprint(campaign_bp, url_prefix='/api')
    # Registrar blueprint de agentes MCP (API)
    from src.routes.mcp_agent_api import mcp_agent_api_bp
    app.register_blueprint(mcp_agent_api_bp, url_prefix='/api')
    # Registrar blueprint do agente OpenAI
    from src.routes.openai_agent import openai_bp
    app.register_blueprint(openai_bp)
    # Registrar blueprint de configurações
    from src.routes.settings import settings_bp
    app.register_blueprint(settings_bp)
    # Registrar blueprint de configurações do Facebook
    from src.routes.facebook_settings import facebook_settings_bp
    app.register_blueprint(facebook_settings_bp)
    # Registrar blueprint de configurações do WhatsApp
    from src.routes.whatsapp_settings import whatsapp_settings_bp
    app.register_blueprint(whatsapp_settings_bp)
    # Registrar blueprint de product_database
    from src.routes.product_database import product_db_bp
    app.register_blueprint(product_db_bp, url_prefix='/api')

    # Registrar blueprint de integração Z-API
    from src.routes.zapi import zapi_bp
    app.register_blueprint(zapi_bp)

    # Registrar blueprint de user_api_key
    from src.routes.user_api_key import api_key_bp
    app.register_blueprint(api_key_bp, url_prefix='/api')

    # Registrar blueprint do webhook Z-API
    from src.routes.zapi_webhook import zapi_webhook_bp
    app.register_blueprint(zapi_webhook_bp)

    # Registrar blueprint do agente global de vendas
    from src.routes.sales_agent import sales_agent_bp
    app.register_blueprint(sales_agent_bp, url_prefix='/api')
    # Registrar blueprint de interações de vendas
    from src.routes.sales_interaction import sales_interaction_bp
    app.register_blueprint(sales_interaction_bp, url_prefix='/api')

    # Registrar blueprint de configurações do Instagram
    from src.routes.instagram_settings import instagram_settings_bp
    app.register_blueprint(instagram_settings_bp)
    
    # Registrar blueprint de gerenciamento de plataformas
    from src.routes.platform_management import platform_management_bp
    app.register_blueprint(platform_management_bp)

    return app

app = create_app()

# Import all models to ensure they're created
from src.models.campaign import Campaign, ProductDatabase, SalesInteraction
from src.models.mcp_agent import MCPAgent, AgentKnowledge, ConversationFlow

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    # Para produção, recomenda-se rodar com waitress ou gunicorn
    # Exemplo para Windows:
    # python -m waitress --host=0.0.0.0 --port=5000 src.main:app
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000)
