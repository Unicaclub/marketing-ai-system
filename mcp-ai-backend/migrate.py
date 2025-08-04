#!/usr/bin/env python3
"""
Script de migração para o banco de dados do Marketing AI System
"""
import os
import sys
import argparse
from datetime import datetime

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(__file__))

from src.main import create_app
from src.models.user import db
from config import config

def init_database(config_name='development'):
    """Inicializa o banco de dados criando todas as tabelas"""
    print(f"Inicializando banco de dados com configuracao: {config_name}")
    
    app = create_app(config_name)
    
    with app.app_context():
        # Importar todos os modelos para garantir que sejam criados
        from src.models.campaign import Campaign, ProductDatabase, SalesInteraction
        from src.models.mcp_agent import MCPAgent, AgentKnowledge, ConversationFlow
        from src.models.user import User
        
        try:
            # Criar todas as tabelas
            db.create_all()
            print("Tabelas criadas com sucesso!")
            
            # Verificar se as tabelas foram criadas
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"Tabelas criadas: {', '.join(tables)}")
            
            return True
            
        except Exception as e:
            print(f"Erro ao criar tabelas: {str(e)}")
            return False

def drop_database(config_name='development'):
    """Remove todas as tabelas do banco de dados"""
    print(f"Removendo todas as tabelas do banco de dados...")
    
    app = create_app(config_name)
    
    with app.app_context():
        try:
            db.drop_all()
            print("Todas as tabelas foram removidas!")
            return True
            
        except Exception as e:
            print(f"Erro ao remover tabelas: {str(e)}")
            return False

def reset_database(config_name='development'):
    """Remove e recria todas as tabelas"""
    print(f"Resetando banco de dados...")
    
    if drop_database(config_name):
        return init_database(config_name)
    return False

def seed_database(config_name='development'):
    """Popula o banco de dados com dados iniciais"""
    print(f"Populando banco de dados com dados iniciais...")
    
    app = create_app(config_name)
    
    with app.app_context():
        from src.models.user import User
        from src.models.campaign import Campaign, ProductDatabase
        from src.models.mcp_agent import MCPAgent, AgentKnowledge
        
        try:
            # Criar usuário administrador
            admin_user = User.query.filter_by(email='admin@marketingai.com').first()
            if not admin_user:
                admin_user = User(
                    username='admin',
                    email='admin@marketingai.com'
                )
                db.session.add(admin_user)
                print("Usuário administrador criado")
            
            # Criar usuário demo
            demo_user = User.query.filter_by(email='demo@marketingai.com').first()
            if not demo_user:
                demo_user = User(
                    username='demo',
                    email='demo@marketingai.com'
                )
                db.session.add(demo_user)
                print("Usuário demo criado")
            
            # Criar agente MCP padrão (comentado por enquanto)
            # mcp_agent = MCPAgent.query.filter_by(name='Agente Principal').first()
            # if not mcp_agent:
            #     mcp_agent = MCPAgent(
            #         name='Agente Principal',
            #         description='Agente principal para automação de vendas',
            #         platforms=['whatsapp', 'instagram', 'facebook'],
            #         is_active=True
            #     )
            #     db.session.add(mcp_agent)
            #     print("Agente MCP principal criado")
            
            # Salvar alterações
            db.session.commit()
            print("Dados iniciais inseridos com sucesso!")
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao inserir dados iniciais: {str(e)}")
            return False

def check_connection(config_name='development'):
    """Verifica a conexão com o banco de dados"""
    print(f"Verificando conexão com o banco de dados...")
    
    app = create_app(config_name)
    
    with app.app_context():
        try:
            # Tentar executar uma query simples (SQLAlchemy 2.0+)
            with db.engine.connect() as connection:
                result = connection.execute(db.text('SELECT 1'))
                result.close()
            
            # Obter informações do banco
            db_uri = app.config['SQLALCHEMY_DATABASE_URI']
            if 'postgresql' in db_uri:
                db_type = 'PostgreSQL'
            elif 'mysql' in db_uri:
                db_type = 'MySQL'
            else:
                db_type = 'SQLite'
            
            print(f"Conexão estabelecida com sucesso!")
            print(f"Tipo de banco: {db_type}")
            print(f"URI: {db_uri}")
            
            return True
            
        except Exception as e:
            print(f"Erro de conexão: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Script de migração do Marketing AI System')
    parser.add_argument('action', choices=['init', 'drop', 'reset', 'seed', 'check'], 
                       help='Ação a ser executada')
    parser.add_argument('--config', default='development', 
                       choices=['development', 'production', 'testing'],
                       help='Configuração do ambiente')
    
    args = parser.parse_args()
    
    print(f"Marketing AI System - Migracao de Banco de Dados")
    print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    success = False
    
    if args.action == 'init':
        success = init_database(args.config)
    elif args.action == 'drop':
        success = drop_database(args.config)
    elif args.action == 'reset':
        success = reset_database(args.config)
    elif args.action == 'seed':
        success = seed_database(args.config)
    elif args.action == 'check':
        success = check_connection(args.config)
    
    print("-" * 50)
    if success:
        print("Operação concluída com sucesso!")
    else:
        print("Operação falhou!")
        sys.exit(1)

if __name__ == '__main__':
    main()

