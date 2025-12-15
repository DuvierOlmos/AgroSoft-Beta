const Descuento = require('../models/descuento');
const ProductoDescuento = require('../models/producto_descuento');
const sequelize = require('../config/db');
const { ValidationError, UniqueConstraintError, Op } = require('sequelize');

// 1. Crear Nuevo Descuento
exports.createDescuento = async (req, res) => {
  try {
    const nuevoDescuento = await Descuento.create(req.body);
    res.status(201).json(nuevoDescuento);
  } catch (error) {
    console.error("Error al crear descuento:", error);

    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'El código de descuento ya existe.' });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Datos de descuento inválidos', 
        details: error.errors.map(e => e.message) 
      });
    }

    res.status(500).json({ error: 'Error al crear el descuento', details: error.message });
  }
};

// 2. Obtener Todos los Descuentos
exports.getAllDescuentos = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      if (!isNaN(search) && search.trim() !== '') {
        whereClause = { id_descuento: search };
      } else {
        whereClause = {
          [Op.or]: [
            { nombre_descuento: { [Op.like]: `%${search}%` } },
            { codigo_descuento: search }, // Código exacto si es texto pero parece código
            { codigo_descuento: { [Op.like]: `%${search}%` } }, // O parcial
            { tipo_descuento: { [Op.like]: `%${search}%` } },
            { estado: { [Op.like]: `%${search}%` } }
          ]
        };
      }
    }

    const descuentos = await Descuento.findAll({
      where: whereClause
    });
    res.json(descuentos);
  } catch (error) {
    console.error("Error al obtener descuentos:", error);
    res.status(500).json({ error: 'Error al obtener los descuentos', details: error.message });
  }
};

// 3. Obtener Descuento por ID
exports.getDescuentoById = async (req, res) => {
  try {
    const descuento = await Descuento.findByPk(req.params.id);
    if (!descuento) {
      return res.status(404).json({ message: 'Descuento no encontrado' });
    }
    res.json(descuento);
  } catch (error) {
    console.error("Error al obtener descuento por ID:", error);
    res.status(500).json({ error: 'Error al obtener el descuento', details: error.message });
  }
};

// 4. Actualizar Descuento
exports.updateDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe antes de intentar actualizar
    const descuentoExistente = await Descuento.findByPk(id);
    if (!descuentoExistente) {
      return res.status(404).json({ message: 'Descuento no encontrado para actualizar' });
    }

    // Actualizar
    await descuentoExistente.update(req.body);
    
    // Devolver el objeto actualizado
    return res.status(200).json(descuentoExistente);

  } catch (error) {
    console.error("Error al actualizar descuento:", error);

    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'El código de descuento ya existe.' });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Datos inválidos para actualizar', 
        details: error.errors.map(e => e.message) 
      });
    }

    res.status(500).json({ error: 'Error al actualizar el descuento', details: error.message });
  }
};

// 5. Eliminar Descuento
exports.deleteDescuento = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction(); // Iniciar transacción

  try {
    // Verificar existencia
    const descuento = await Descuento.findByPk(id, { transaction: t });
    if (!descuento) {
      await t.rollback();
      return res.status(404).json({ message: 'Descuento no encontrado para eliminar' });
    }

    // 1. Eliminar asociaciones en la tabla pivote producto_descuento
    await ProductoDescuento.destroy({
      where: { id_descuento: id },
      transaction: t
    });

    // 2. Eliminar el descuento
    await Descuento.destroy({
      where: { id_descuento: id },
      transaction: t
    });

    await t.commit(); // Confirmar cambios
    return res.status(204).json({ message: 'Descuento eliminado correctamente' });
    
  } catch (error) {
    await t.rollback(); // Revertir cambios si algo falla
    console.error("Error al eliminar descuento:", error);
    res.status(500).json({ error: 'Error interno al eliminar el descuento', details: error.message });
  }
};
