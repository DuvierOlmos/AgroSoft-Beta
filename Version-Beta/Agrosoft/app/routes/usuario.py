from flask import Blueprint, render_template
from app import mysql
from flask import jsonify
usuario_bp = Blueprint('usuario', __name__, url_prefix='/usuario')

from flask import render_template, jsonify

@usuario_bp.route('/')
def usuario_home():
    return render_template('usuario/index.html')

@usuario_bp.route('/productos')
def obtener_productos():
    cur = mysql.connection.cursor()
    query = """
        SELECT 
            p.id_producto,
            p.nombre_producto AS nombre,
            p.descripcion_producto,
            p.precio_unitario AS valor,
            p.unidad_medida,
            p.url_imagen AS urlImagen,
            p.estado_producto AS estado,
            p.cantidad AS existencia,
            u.nombre_usuario AS nombre_agricultor
        FROM productos p
        JOIN usuarios u ON p.id_agricultor = u.id_usuario
        WHERE p.estado_producto = 'Activo'
    """
    cur.execute(query)
    datos = cur.fetchall()
    columnas = [col[0] for col in cur.description]
    productos = [dict(zip(columnas, fila)) for fila in datos]
    cur.close()
    return jsonify(productos)


@usuario_bp.route('/blog')
def blog():
    return render_template('usuario/blog.html')

@usuario_bp.route('/carrito')
def carrito():
    return render_template('usuario/carritosM.html')

@usuario_bp.route('/catalogo')
def catalogo():
    return render_template('usuario/catalogo.html')

@usuario_bp.route('/comentarios')
def comentarios():
    return render_template('usuario/comentariosReseñas.html')

@usuario_bp.route('/descuentos')
def descuentos():
    return render_template('usuario/descuentoOfertas.html')

@usuario_bp.route('/editar-carrito')
def editar_carrito():
    return render_template('usuario/Editar_Carrito.html')

@usuario_bp.route('/gestion-catalogo')
def gestion_catalogo():
    return render_template('usuario/gestionCatalogo.html')

@usuario_bp.route('/pqrs')
def pqrs():
    return render_template('usuario/gestionPQR.html')

@usuario_bp.route('/index2')
def index2():
    return render_template('usuario/index2.html')

@usuario_bp.route('/inventario')
def inventario():
    return render_template('usuario/inventario.html')

@usuario_bp.route('/manual')
def manual():
    return render_template('usuario/manual.html')

@usuario_bp.route('/soporte')
def soporte():
    return render_template('usuario/soporte.html')

@usuario_bp.route('/ver-catalogo')
def ver_catalogo():
    return render_template('usuario/verCatalogo.html')
