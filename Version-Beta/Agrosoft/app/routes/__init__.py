from .admin import admin_bp
from .usuario import usuario_bp
from .vendedor import vendedor_bp
from .auth import auth_bp 

blueprints = [admin_bp, usuario_bp, vendedor_bp, auth_bp]