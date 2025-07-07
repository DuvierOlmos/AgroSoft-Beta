from flask import Flask
from flask_mysqldb import MySQL
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

mysql = MySQL()

def create_app():
    app = Flask(__name__)

    # Configuraciones generales
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Configuración de conexión a MySQL desde .env
    app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
    app.config['MYSQL_USER'] = os.getenv('DB_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('DB_NAME')
    app.config['MYSQL_PORT'] = int(os.getenv('DB_PORT', 3306))

    # Verifica si está leyendo bien
    print("🔐 Configuración MySQL:")
    print("HOST:", app.config['MYSQL_HOST'])
    print("USER:", app.config['MYSQL_USER'])
    print("PASS:", app.config['MYSQL_PASSWORD'])
    print("DB:", app.config['MYSQL_DB'])

    mysql.init_app(app)

    
    from app.routes.auth import auth_bp
    from app.routes.usuario import usuario_bp
    from app.routes.admin import admin_bp
    from app.routes.vendedor import vendedor_bp
    from app.routes.main import main_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(usuario_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(vendedor_bp)
    app.register_blueprint(main_bp)
    return app

