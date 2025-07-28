from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import bcrypt
from app import mysql

# Blueprint de autenticación
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# ===========================
# Registro de usuario
# ===========================
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        usuario = request.form['usuario']
        correo = request.form['correo']
        contraseña = request.form['contraseña']
        confirmar = request.form['confirmar']
        id_rol = int(request.form['rol'])
        documento = request.form['documento']

        if contraseña != confirmar:
            flash('Las contraseñas no coinciden', 'danger')
            return render_template('auth/registro.html')

        cursor = mysql.connection.cursor()

        cursor.execute("""
            SELECT * FROM usuarios
            WHERE nombre_usuario = %s OR correo_electronico = %s OR documento_identidad = %s
        """, (usuario, correo, documento))
        existente = cursor.fetchone()

        if existente:
            flash('Ya existe un usuario con ese nombre, correo o documento', 'warning')
            cursor.close()
            return render_template('auth/registro.html')

        hashed_password = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())

        cursor.execute("""
            INSERT INTO usuarios (nombre_usuario, correo_electronico, contrasena, id_rol, documento_identidad)
            VALUES (%s, %s, %s, %s, %s)
        """, (usuario, correo, hashed_password.decode('utf-8'), id_rol, documento))

        mysql.connection.commit()
        cursor.close()

        flash('Usuario registrado exitosamente', 'success')
        return redirect(url_for('auth.login'))

    return render_template('auth/registro.html')

# ===========================
# Inicio de sesión
# ===========================
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        contraseña = request.form['contraseña']

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nombre_usuario = %s", (usuario,))
        user = cursor.fetchone()
        cursor.close()

        if user:
            if bcrypt.checkpw(contraseña.encode('utf-8'), user[2].encode('utf-8')):  # Posición 2 = contraseña
                session['usuario'] = user[1]  # nombre_usuario
                session['id_rol'] = user[4]   # id_rol

                # Redireccionar según rol
                rol = user[4]
                if rol == 1:  # Cliente
                    return redirect(url_for('usuario.usuario_home'))
                elif rol == 2:  # Administrador
                    return redirect(url_for('admin.admin_home'))
                elif rol == 3:  # Productor o proveedor
                    return redirect(url_for('vendedor.vendedor_home'))
                else:
                    flash('Rol no válido', 'danger')
            else:
                flash('Contraseña incorrecta', 'danger')
        else:
            flash('Usuario no encontrado', 'danger')

    return render_template('auth/login.html')

# ===========================
# Cierre de sesión
# ===========================
@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('auth.login'))
