
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Modelo de usuario
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { correo_electronico, password } = req.body;

    // Validar campos
    if (!correo_electronico || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    // Buscar usuario por email
    const rows = await User.findByEmail(correo_electronico);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Correo inválido" });
    }

    const user = rows[0];

    // Comparar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "constraseña  inválida" });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        correo_electronico: user.correo_electronico,
        id_rol: user.id_rol,
      },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        correo_electronico: user.correo_electronico,
        id_rol: user.id_rol,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
