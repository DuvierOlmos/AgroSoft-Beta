// controllers/auth_controller.js
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_agrosoft';

exports.register = async (req, res) => {
    try {
        const { nombre_usuario, correo_electronico, password, id_rol = 1 } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { correo_electronico } });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'El correo electrónico ya está registrado.' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            nombre_usuario,
            correo_electronico,
            password_hash: hashedPassword,
            id_rol
        });

        // Generar token
        const token = jwt.sign({ 
            id_usuario: user.id_usuario, 
            id_rol: user.id_rol 
        }, JWT_SECRET, { expiresIn: '2h' });

        res.status(201).json({ 
            success: true,
            message: "Usuario registrado con éxito", 
            token,
            user: {
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre_usuario,
                correo_electronico: user.correo_electronico,
                id_rol: user.id_rol
            }
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(400).json({ 
            success: false,
            error: 'Error al registrar el usuario.' 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { correo_electronico, password } = req.body;
        
        if (!correo_electronico || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Correo electrónico y contraseña son requeridos.' 
            });
        }

        const user = await User.findOne({ where: { correo_electronico } });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'Usuario no encontrado.' 
            });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false,
                error: 'Contraseña incorrecta.' 
            });
        }

        const token = jwt.sign({ 
            id_usuario: user.id_usuario, 
            id_rol: user.id_rol 
        }, JWT_SECRET, { expiresIn: '2h' });

        res.json({ 
            success: true,
            message: 'Inicio de sesión exitoso',
            token, 
            user: {
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre_usuario,
                correo_electronico: user.correo_electronico,
                id_rol: user.id_rol
            }
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor.' 
        });
    }
};