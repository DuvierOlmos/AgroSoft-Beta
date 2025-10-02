// models/Producto.js
const { Model, DataTypes } = require('sequelize');

class Producto extends Model {
  static associate(models) {
    // Relación con Subcategoria
    this.belongsTo(models.Subcategoria, {
      foreignKey: 'id_SubCategoria',
      as: 'Subcategoria'
    });
    
    // Relación con ComentarioResena
    this.hasMany(models.ComentarioResena, {
      foreignKey: 'id_producto',
      as: 'comentarios'
    });
    
    // Relación con ProductoDescuento
    this.hasMany(models.ProductoDescuento, {
      foreignKey: 'id_producto',
      as: 'descuentos'
    });
  }
}

// models/ComentarioResena.js
class ComentarioResena extends Model {
  static associate(models) {
    // Relación con Producto
    this.belongsTo(models.Producto, {
      foreignKey: 'id_producto',
      as: 'producto'
    });
    
    // Relación con Usuario
    this.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'Usuario'
    });
  }
}

// models/Subcategoria.js
class Subcategoria extends Model {
  static associate(models) {
    // Relación con Categoria
    this.belongsTo(models.Categoria, {
      foreignKey: 'id_categoria',
      as: 'Categoria'
    });
    
    // Relación con Producto
    this.hasMany(models.Producto, {
      foreignKey: 'id_SubCategoria',
      as: 'productos'
    });
  }
}

// models/Categoria.js
class Categoria extends Model {
  static associate(models) {
    // Relación con Subcategoria
    this.hasMany(models.Subcategoria, {
      foreignKey: 'id_categoria',
      as: 'subcategorias'
    });
  }
}

// models/ProductoDescuento.js
class ProductoDescuento extends Model {
  static associate(models) {
    // Relación con Producto
    this.belongsTo(models.Producto, {
      foreignKey: 'id_producto',
      as: 'producto'
    });
    
    // Relación con Descuento
    this.belongsTo(models.Descuento, {
      foreignKey: 'id_descuento',
      as: 'Descuento'
    });
  }
}