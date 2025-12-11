const  DataTypes  = require("sequelize");
const sequelize = require("../config/db");

const Descuento = sequelize.define("Descuento", {
  id_descuento: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  valor_descuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
  },
  fecha_fin: {
    type: DataTypes.DATE,
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: "Pendiente",
  },
}, {
  tableName: "descuentos",
  timestamps: false,
});

module.exports = Descuento;
