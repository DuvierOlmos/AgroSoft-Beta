const db = require("../config/config");

const User = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE correo_electronico = ?", [email]);
    return rows;
  },

  // Crear un nuevo usuario
  create: async (nombre_usuario, hashedPassword, correo_electronico, documento_identidad, id_rol) => {
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre_usuario, password_hash, correo_electronico, documento_identidad, id_rol) VALUES (?, ?, ?, ?, ?)",
      [nombre_usuario, hashedPassword, correo_electronico, documento_identidad, id_rol]
    );
    return result;
  }
};

module.exports = User;
