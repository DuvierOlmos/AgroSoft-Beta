const express = require("express");
const router = express.Router();
const Inventario = require("../models/inventario");
const Producto = require("../models/producto_model");
const User = require("../models/user_model");
const { Op } = require("sequelize");

// GET /api/inventarios - Obtener todo el inventario
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
        if (!isNaN(search) && search.trim() !== '') {
             whereClause = { id_inventario: search };
        } else {
            whereClause = {
                [Op.or]: [
                    { '$producto.nombre_producto$': { [Op.like]: `%${search}%` } },
                    { '$producto.agricultor.nombre_usuario$': { [Op.like]: `%${search}%` } }
                ]
            };
        }
    }

    const inventarios = await Inventario.findAll({
      where: whereClause,
      include: [{
        model: Producto,
        as: 'producto',
        include: [{
          model: User,
          as: 'agricultor',
          attributes: ['id_usuario', 'nombre_usuario']
        }]
      }]
    });
    res.json(inventarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener inventario" });
  }
});

// Puedes agregar POST, PUT, DELETE aquí si lo necesitas

module.exports = router;
