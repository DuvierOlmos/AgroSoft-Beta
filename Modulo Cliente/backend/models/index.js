const db = require("../config/db");


const User = require("./user_model");
const Role = require("./role_model");
const Product = require("./product_model");
const Pedido = require("./order_model");
const DetallePedido = require("./order_detail_model");
const Review = require("./review_model");
const Pqrs = require("./pqrs_model");



Role.hasMany(User, { foreignKey: "id_rol" });
User.belongsTo(Role, { foreignKey: "id_rol" });


User.hasMany(Pedido, { foreignKey: "id_usuario" });
Pedido.belongsTo(User, { foreignKey: "id_usuario" });


Pedido.hasMany(DetallePedido, { foreignKey: "id_pedido" });
DetallePedido.belongsTo(Pedido, { foreignKey: "id_pedido" });

Product.hasMany(DetallePedido, { foreignKey: "id_producto" });
DetallePedido.belongsTo(Product, { foreignKey: "id_producto" });


User.hasMany(Review, { foreignKey: "id_usuario" });
Review.belongsTo(User, { foreignKey: "id_usuario" });


Product.hasMany(Review, { foreignKey: "id_producto" });
Review.belongsTo(Product, { foreignKey: "id_producto" });


User.hasMany(Pqrs, { foreignKey: "id_usuario" });
Pqrs.belongsTo(User, { foreignKey: "id_usuario" });


module.exports = {
  db,
  User,
  Role,
  Product,
  Pedido,
  DetallePedido,
  Review,
  Pqrs
};
