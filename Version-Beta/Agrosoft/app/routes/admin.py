from flask import Blueprint, render_template, request, redirect
from flask import session, url_for, flash
import MySQLdb
from app import mysql
from flask import jsonify
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/')
def admin_home():
    cur = mysql.connection.cursor()
    query = """
        SELECT u.id_usuario, u.nombre_usuario, u.correo_electronico, r.nombre_rol, u.estado
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id_rol
        where u.estado = 'Activo'
    """
    cur.execute(query)
    datos = cur.fetchall()
    columnas = [col[0] for col in cur.description]
    usuarios = [dict(zip(columnas, fila)) for fila in datos]
    cur.close()
    return render_template('admin/dashBoardAdmin.html', usuarios=usuarios)



@admin_bp.route('/editar_usuario', methods=['POST'])
def editar_usuario():
    id_usuario = request.form['id_usuario']
    nombre_usuario = request.form['nombre_usuario']
    email = request.form['correo_electronico']
    id_rol = request.form['id_rol']

    cur = mysql.connection.cursor()
    cur.execute(
        "UPDATE usuarios SET nombre_usuario=%s, correo_electronico=%s, id_rol=%s WHERE id_usuario=%s",
        (nombre_usuario, email, id_rol, id_usuario)
    )
    mysql.connection.commit()
    cur.close()
    return redirect(url_for('admin.admin_home'))

@admin_bp.route('/cambiar_estado_usuario', methods=['POST'])
def cambiar_estado_usuario():
    id_usuario = request.form['id_usuario']
    nuevo_estado = request.form['nuevo_estado']

    if not id_usuario or not nuevo_estado:
        flash('faltan datps para cambiar el estado', 'error')
        return redirect(url_for('admin.admin_home'))
    
    cur = mysql.connection.cursor()
    query= "UPDATE usuarios SET estado=%s WHERE id_usuario=%s"
    cur.execute(query,(nuevo_estado, id_usuario))
    mysql.connection.commit()
    cur.close()
    flash(f'El estado del usuario ha sido cambiado a {nuevo_estado}', 'success')
    return redirect(url_for('admin.admin_home'))

@admin_bp.route('/api/categorias')
def api_categorias():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_categoria, nombre_categoria, descripcion_categoria, estado AS estado FROM categorias")
    datos = cur.fetchall()
    columnas = [col[0] for col in cur.description]
    categorias = [dict(zip(columnas, fila)) for fila in datos]
    cur.close()
    return jsonify(categorias)


@admin_bp.route('/guardar_categoria', methods=['POST'])
def guardar_categoria():
    id_categoria = request.form.get('id_categoria')
    nombre = request.form.get('nombre_categoria').strip()
    descripcion = request.form.get('descripcion_categoria').strip()
    cur = mysql.connection.cursor()
    
    try:
        if id_categoria:
            # Editar categoría existente
            cur.execute("""
                UPDATE categorias SET nombre_categoria=%s, descripcion_categoria=%s 
                WHERE id_categoria=%s
            """, (nombre, descripcion, id_categoria))
        else:
            # Agregar categoría nueva
            cur.execute("""
                INSERT INTO categorias (nombre_categoria, descripcion_categoria, estado) 
                VALUES (%s, %s, 'Activo')
            """, (nombre, descripcion))
        mysql.connection.commit()
    except MySQLdb.IntegrityError:
        flash("Ya existe una categoría con ese nombre.", "error")
    finally:
        cur.close()
    return redirect(url_for('admin.admin_home') + '?modulo=GestionarCatalogo')


@admin_bp.route('/cambiar_estado_categoria', methods=['POST'])
def cambiar_estado_categoria():
    id_categoria = request.form.get('id_categoria')
    nuevo_estado = request.form.get('nuevo_estado')
    cur = mysql.connection.cursor()
    cur.execute("UPDATE categorias SET estado=%s WHERE id_categoria=%s", (nuevo_estado, id_categoria))
    mysql.connection.commit()
    cur.close()
    return redirect(url_for('admin.admin_home') + '?modulo=GestionarCatalogo')


