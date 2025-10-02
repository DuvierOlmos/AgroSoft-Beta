// models/pqrs_model.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pqrs extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
      this.belongsTo(models.TipoPqrs, { foreignKey: 'id_tipo_pqrs' });
      this.belongsTo(models.EstadoPqrs, { foreignKey: 'id_estado_pqrs' });
    }
  }

  Pqrs.init({
    id_pqrs: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_tipo_pqrs: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asunto: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_estado_pqrs: {
      type: DataTypes.INTEGER,
      defaultValue: 1 // Pendiente
    },
    respuesta_administrador: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_administrador_respuesta: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Pqrs',
    tableName: 'pqrs',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_ultima_actualizacion'
  });

  return Pqrs;
};