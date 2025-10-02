const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Product = db.define(
  "Product",
  {
    id_producto: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_producto: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion_producto: {
      type: DataTypes.TEXT,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2), // 💰 precios con 2 decimales
      allowNull: false,
    },
    unidad_medida: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    url_imagen: {
      type: DataTypes.STRING(255),
    },
    id_SubCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado_producto: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Activo",
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_ultima_modificacion: {
      type: DataTypes.DATE,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "producto",
    timestamps: false,
  }
);

module.exports = Product;
