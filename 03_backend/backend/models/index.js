// 📦 backend/models/index.js
const sequelize = require("../config/db");

// Importar todos los modelos con la misma instancia
const User = require("./user_model");
const Carrito = require("./carrito_model");
const DetalleCarrito = require("./detalle_carrito_model");
const Producto = require("./producto_model");
const Inventario = require("./inventory_model");
const Descuento = require("./descuento");
// --- Verificar que estén bien cargados ---
console.log("🧩 Verificando modelos Sequelize:");
console.log("User:", User instanceof sequelize.Sequelize.Model);
console.log("Carrito:", Carrito instanceof sequelize.Sequelize.Model);
console.log("DetalleCarrito:", DetalleCarrito instanceof sequelize.Sequelize.Model);
console.log("Producto:", Producto instanceof sequelize.Sequelize.Model);
console.log("Inventario:", Inventario instanceof sequelize.Sequelize.Model);
console.log("Descuento:", Descuento instanceof sequelize.Sequelize.Model);

// --- 🔗 Definir asociaciones ---
if (User && Carrito) {
  User.hasMany(Carrito, { foreignKey: "id_usuario" });
  Carrito.belongsTo(User, { foreignKey: "id_usuario" });
}

if (Carrito && DetalleCarrito) {
  Carrito.hasMany(DetalleCarrito, { foreignKey: "id_carrito" });
  DetalleCarrito.belongsTo(Carrito, { foreignKey: "id_carrito" });
}

if (Producto && DetalleCarrito) {
  Producto.hasMany(DetalleCarrito, { foreignKey: "id_producto" });
  DetalleCarrito.belongsTo(Producto, { foreignKey: "id_producto" });
}

// (Opcional) Producto - Inventario
if (Producto && Inventario) {
  Producto.hasOne(Inventario, { foreignKey: "id_producto" });
  Inventario.belongsTo(Producto, { foreignKey: "id_producto" });
}

// (Opcional) Producto - Descuento
if (Producto && Descuento) {
  Producto.belongsToMany(Descuento, {
    through: "producto_descuento",
    foreignKey: "id_producto",
  });
  Descuento.belongsToMany(Producto, {
    through: "producto_descuento",
    foreignKey: "id_descuento",
  });
}

// --- Exportar todo ---
module.exports = {
  sequelize,
  User,
  Carrito,
  DetalleCarrito,
  Producto,
  Inventario,
  Descuento,
};
