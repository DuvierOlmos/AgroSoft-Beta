from flask import Blueprint, render_template, flash, request
from flask import session, redirect, url_for
from app import mysql

vendedor_bp = Blueprint('vendedor', __name__, url_prefix='/vendedor')

@vendedor_bp.route('/index')
def vendedor_home():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM productos WHERE estado_producto = 'Activo'")
    productos = cur.fetchall()
    return render_template('vendedor/index.html', productos=productos)


@vendedor_bp.route('/productos', methods=['GET', 'POST'])
def productos():
    cur = mysql.connection.cursor()

    if request.method == 'POST' and 'nombre_producto' in request.form:
        nombre_producto = request.form.get('nombre_producto')
        descripcion = request.form.get('descripcion_producto')
        precio = request.form.get('precio_unitario')
        unidad = request.form.get('unidad_medida')
        imagen = request.form.get('url_imagen')  
        id_categoria = request.form.get('id_categoria') 
        estado = request.form.get('estado_producto')
        cantidad = request.form.get('cantidad')
        

        cur.execute("""
            INSERT INTO productos (
                nombre_producto, descripcion_producto, precio_unitario,
                unidad_medida, url_imagen, id_categoria, estado_producto, cantidad
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (nombre_producto, descripcion, precio, unidad, imagen, id_categoria, estado, cantidad))
        mysql.connection.commit()

    
    cur.execute("SELECT * FROM productos WHERE estado_producto = 'Activo'")
    productos = cur.fetchall()
    return render_template('vendedor/index.html', productos=productos)

@vendedor_bp.route('/editar', methods=['POST'])
def editar():
    cur=mysql.connection.cursor()
    nombre_producto = request.form['producto']
    atributo = request.form['atributo']
    nuevo_valor = request.form['valor_nuevo']

    # Validar que el campo sea editable
    campos_validos = ['nombre_producto', 'descripcion_producto', 'precio_unitario', 'unidad_medida', 'url_imagen', 'estado_producto', 'id_categoria', 'cantidad']
    if atributo not in campos_validos:
        return "Atributo no editable", 400

    cur = mysql.connection.cursor()
    cur.execute(f"UPDATE productos SET {atributo} = %s WHERE nombre_producto = %s", (nuevo_valor, nombre_producto))
    mysql.connection.commit()
    return redirect(url_for('vendedor.productos'))

@vendedor_bp.route('/eliminar_producto', methods=['POST'])
def eliminar_producto():
    id_producto = request.form['producto']  
    cur = mysql.connection.cursor()
    cur.execute("UPDATE productos SET estado_producto = 'Inactivo' WHERE id_producto = %s", (id_producto,))
    mysql.connection.commit()
    flash("Producto desactivado correctamente", "success")
    return redirect(url_for('vendedor.productos'))



@vendedor_bp.route('/finanza')
def vendedor_finanza():
    return render_template('vendedor/finanza.html')

@vendedor_bp.route('/inventario')
def vendedor_inventario():
    if session.get('id_rol') != 3:
        return redirect(url_for('main.home'))
    
    id_usuario = session.get('id_usuario')
    cur= mysql.connection.cursor()
    cur.execute("SELECT id_producto, id_q cantidad_disponible, ubicacion_almacenamiento FROM inventario WHERE id_agricultor = %s", (id_usuario,))
    inventario = cur.fetchall()
    cur.close()
    return render_template('vendedor/inventario.html', inventario=inventario)

@vendedor_bp.route('/ordenes')
def ordenes():
    return render_template('ordenes.html')

@vendedor_bp.route('/usuarios')
def vendedor_usuarios():
    return render_template('vendedor/usuarios.html')

@vendedor_bp.route('/finanza', methods=['GET', 'POST'])
def finanza():
    resultados = {
        "ganancia_bruta": 0,
        "ganancia_neta": 0,
        "margen_ganancia_bruta": "0%",
        "margen_ganancia_neta": "0%"
    }
    return render_template('finanza.html', resultados=resultados)


