const sequelize = require("../config/db");

// ➕ Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;

  try {
    // 1. Buscar carrito activo del usuario
    const [carrito] = await sequelize.query(
      "SELECT * FROM carrito WHERE id_usuario = ? AND estado_carrito = 'Activo'",
      { replacements: [id_usuario] }
    );

    let id_carrito;
    if (carrito.length === 0) {
      // ⚠️ MySQL no soporta RETURNING, así que usamos insertId
      const [nuevo] = await sequelize.query(
        "INSERT INTO carrito (id_usuario, estado_carrito) VALUES (?, 'Activo')",
        { replacements: [id_usuario] }
      );
      id_carrito = nuevo; // en mysql2 normalmente insertId → aquí dependerá de sequelize.query
    } else {
      id_carrito = carrito[0].id_carrito;
    }

    // 2. Verificar si el producto ya está en el carrito
    const [detalle] = await sequelize.query(
      "SELECT * FROM detalle_carrito WHERE id_carrito = ? AND id_producto = ?",
      { replacements: [id_carrito, id_producto] }
    );

    if (detalle.length > 0) {
      // Si ya existe → actualizar cantidad y subtotal
      await sequelize.query(
        `UPDATE detalle_carrito 
         SET cantidad = cantidad + ?, 
             subtotal = (cantidad + ?) * precio_unitario_al_momento 
         WHERE id_carrito = ? AND id_producto = ?`,
        { replacements: [cantidad, cantidad, id_carrito, id_producto] }
      );
    } else {
      // Si no existe → insertar nuevo
      const [[producto]] = await sequelize.query(
        "SELECT precio_unitario FROM producto WHERE id_producto = ?",
        { replacements: [id_producto] }
      );

      const precio_unitario = producto.precio_unitario;
      const subtotal = precio_unitario * cantidad;

      await sequelize.query(
        `INSERT INTO detalle_carrito 
         (id_carrito, id_producto, cantidad, precio_unitario_al_momento, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
        { replacements: [id_carrito, id_producto, cantidad, precio_unitario, subtotal] }
      );
    }

    res.json({ success: true, message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error en agregarAlCarrito:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

// 📌 Obtener carrito por usuario
const getCarritoByUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [rows] = await sequelize.query(
      `SELECT dc.id_detalle_carrito, dc.cantidad, dc.precio_unitario_al_momento, dc.subtotal,
              p.nombre_producto, p.descripcion_producto, p.url_imagen
       FROM carrito c
       JOIN detalle_carrito dc ON c.id_carrito = dc.id_carrito
       JOIN producto p ON dc.id_producto = p.id_producto
       WHERE c.id_usuario = ? AND c.estado_carrito = 'Activo'`,
      { replacements: [id_usuario] }
    );

    res.json(rows);
  } catch (error) {
    console.error("Error en getCarritoByUsuario:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

module.exports = { agregarAlCarrito, getCarritoByUsuario };
