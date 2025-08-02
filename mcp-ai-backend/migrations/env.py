
import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context
from alembic.config import Config

# Adiciona o diretório src ao sys.path para importar os modelos
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from src.models.db_instance import db  # importa o objeto db
from src.models import user  # importa os modelos para registrar as tabelas

# Força leitura do alembic.ini correto
alembic_ini_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'alembic.ini'))
print("Caminho do alembic.ini usado:", alembic_ini_path)
config = Config(alembic_ini_path)
fileConfig(config.config_file_name)
target_metadata = db.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    url = config.get_main_option('sqlalchemy.url')
    print("URL do banco lida pelo Alembic:", url)
    connectable = create_engine(url, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, compare_type=True
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
