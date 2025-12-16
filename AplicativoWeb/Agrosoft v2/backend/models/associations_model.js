const Categoria = require('./categoria');
const SubCategory = require('./subcategory_model');
const Inventario = require('./inventario');
const Producto = require('./producto_model');
const User = require('./user_model');

Categoria.hasMany(SubCategory, { foreignKey: 'id_categoria', as: 'SubCategorias' });
SubCategory.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'Categoria' });

Inventario.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
Producto.hasMany(Inventario, { foreignKey: 'id_producto', as: 'inventarios' });

Producto.belongsTo(User, { foreignKey: 'id_usuario', as: 'agricultor' });
User.hasMany(Producto, { foreignKey: 'id_usuario', as: 'productos' });

Producto.belongsTo(SubCategory, { foreignKey: 'id_SubCategoria', as: 'SubCategory' });
SubCategory.hasMany(Producto, { foreignKey: 'id_SubCategoria', as: 'productos' });

module.exports = { Categoria, SubCategory, Inventario, Producto, User };
