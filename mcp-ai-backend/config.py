import os
from urllib.parse import quote_plus

class Config:
    """Configuração base da aplicação"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'asdf#FGSgvasgf$5$WGT'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuração do banco de dados
    DATABASE_TYPE = 'postgresql'  # Centralizando a configuração do banco de dados
    
    # Configurações PostgreSQL
    POSTGRES_HOST = os.environ.get('POSTGRES_HOST', '127.0.0.1')
    POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', 'painel-master')
    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'postgres')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', '0000')
    
    # Configurações MySQL
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.environ.get('MYSQL_PORT', '3306')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'marketing_ai_db')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'marketing_ai_user')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'marketing_ai_pass')
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        """Retorna a URI do banco de dados baseada no tipo configurado"""
        if self.DATABASE_TYPE == 'postgresql':
            password = quote_plus(self.POSTGRES_PASSWORD)
            return f"postgresql://{self.POSTGRES_USER}:{password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        
        elif self.DATABASE_TYPE == 'mysql':
            password = quote_plus(self.MYSQL_PASSWORD)
            return f"mysql+pymysql://{self.MYSQL_USER}:{password}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        
        else:  # SQLite (padrão)
            return f"sqlite:///{os.path.join(os.path.dirname(__file__), 'src', 'database', 'app.db')}"

class DevelopmentConfig(Config):
    """Configuração para desenvolvimento"""
    DEBUG = True
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        password = quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

class ProductionConfig(Config):
    """Configuração para produção"""
    DEBUG = False
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        password = quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

class TestingConfig(Config):
    """Configuração para testes"""
    TESTING = True
    DATABASE_TYPE = 'sqlite'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Configurações disponíveis
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

