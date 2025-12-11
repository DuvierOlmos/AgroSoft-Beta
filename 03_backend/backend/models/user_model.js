const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // 👈 Importa la MISMA instancia, no recrees Sequelize

const User = sequelize.define("User", {
  id_usuario: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "usuarios",
  timestamps: false,
});

module.exports = User;
