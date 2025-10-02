const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Role = db.define("roles", {
  id_rol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion_rol: {
    type: DataTypes.TEXT
  }
}, {
  tableName: "roles",
  timestamps: false
});

module.exports = Role;

