"""
Migration para aumentar o tamanho da coluna password_hash na tabela users.
"""
revision = 'aumenta_password_hash_para_256'
down_revision = None
branch_labels = None
depends_on = None
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.alter_column('users', 'password_hash',
        existing_type=sa.String(length=128),
        type_=sa.String(length=256),
        existing_nullable=False)

def downgrade():
    op.alter_column('users', 'password_hash',
        existing_type=sa.String(length=256),
        type_=sa.String(length=128),
        existing_nullable=False)
