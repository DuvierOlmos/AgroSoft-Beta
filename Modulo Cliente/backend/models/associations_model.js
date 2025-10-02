const Product = require("./product_model");
const SubCategory = require("./subcategory_model");
const Category = require("./category_model");
const Inventory = require("./inventory_model");
const User = require("./user_model");




Product.belongsTo(SubCategory, {
  as: "subcategoria",
  foreignKey: "id_SubCategoria",
});


SubCategory.belongsTo(Category, {
  as: "categoria",
  foreignKey: "id_categoria",
});


Product.hasMany(Inventory, {
  as: "inventarios",
  foreignKey: "id_producto",
});


Inventory.belongsTo(Product, {
  as: "producto",
  foreignKey: "id_producto",
});


User.hasMany(Inventory, {
  as: "inventarios",
  foreignKey: "id_agricultor",
});

Inventory.belongsTo(User, {
  as: "agricultor",
  foreignKey: "id_agricultor",
});

module.exports = {
  Product,
  SubCategory,
  Category,
  Inventory,
  User,
};
