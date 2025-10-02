
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Modelo de usuario

exports.register = async (req, res) => {
  try {
    console.log('Datos recibidos en req.body:', req.body); // Log para depuración
    const { nombre_usuario, correo_electronico, password, documento_identidad, id_rol } = req.body;

    // Validar campos
    if (!nombre_usuario || !correo_electronico || !password || !documento_identidad || !id_rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar si el usuario ya existe
    const userExists = await User.findByEmail(correo_electronico);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la base de datos
    const result = await User.create(nombre_usuario, hashedPassword, correo_electronico, documento_identidad, id_rol);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      userId: result.insertId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
