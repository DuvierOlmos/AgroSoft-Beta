const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Review = db.define("comentario_resena", {
  id_comentario_resena: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  id_producto: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  calificacion: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  texto_comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado_comentario: {
    type: DataTypes.ENUM("Pendiente", "Aprobado", "Rechazado"),
    allowNull: false,
    defaultValue: "Pendiente"
  },
  id_administrador_moderador: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: "comentario_resena",
  timestamps: false
});

const User = require("./user_model");
const Product = require("./product_model");

Review.belongsTo(User, { foreignKey: "id_usuario" });
Review.belongsTo(Product, { foreignKey: "id_producto" });

module.exports = Review;
