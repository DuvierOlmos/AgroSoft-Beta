// controllers/user_controller.js
const User = require("../models/user_model");
const Role = require("../models/role_model");
const sequelize = require("../config/db");

// 📌 Perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_usuario, {
      attributes: [
        "id_usuario",
        "nombre_usuario",
        "correo_electronico",
        "estado",
        "documento_identidad"
      ],
      include: {
        model: Role,
        attributes: ["nombre_rol"]
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.json({
      success: true,
      user: {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        correo_electronico: user.correo_electronico,
        documento_identidad: user.documento_identidad,
        estado: user.estado,
        rol: user.Role?.nombre_rol || "Sin rol"
      }
    });
  } catch (err) {
    console.error("Error en getProfile:", err);
    res.status(500).json({
      success: false,
      error: "Error al obtener el perfil"
    });
  }
};

// 📌 Actualizar perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
  try {
    const { nombre_usuario, correo_electronico } = req.body;
    const userId = req.user.id_usuario;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    if (nombre_usuario) user.nombre_usuario = nombre_usuario;
    if (correo_electronico) user.correo_electronico = correo_electronico;

    await user.save();

    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        correo_electronico: user.correo_electronico
      }
    });
  } catch (err) {
    console.error("Error en updateProfile:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el perfil"
    });
  }
};

// 📌 Pedidos del usuario autenticado
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    const pedidos = await sequelize.query(
      `
      SELECT o.id_orden, o.fecha_orden, o.estado, o.total
      FROM ordenes o
      WHERE o.id_usuario = ?
      ORDER BY o.fecha_orden DESC
      `,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json({
      success: true,
      pedidos
    });
  } catch (err) {
    console.error("Error en getUserOrders:", err);
    res.status(500).json({
      success: false,
      error: "Error al obtener los pedidos"
    });
  }
};

// 📌 Reseñas hechas por el usuario autenticado
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    const reseñas = await sequelize.query(
      `
      SELECT r.id_review, r.calificacion, r.texto_comentario, r.fecha_creacion,
             p.nombre_producto
      FROM reviews r
      JOIN producto p ON r.id_producto = p.id_producto
      WHERE r.id_usuario = ?
      ORDER BY r.fecha_creacion DESC
      `,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json({
      success: true,
      reseñas
    });
  } catch (err) {
    console.error("Error en getUserReviews:", err);
    res.status(500).json({
      success: false,
      error: "Error al obtener las reseñas"
    });
  }
};
