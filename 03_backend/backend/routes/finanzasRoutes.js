const express = require("express");
const router = express.Router();
const { verificarToken } = require("../utils/jwt");
const {
 getDatosFinancieros,
 getVentasPorMes,
 getProductosMasVendidos,
 getOrdenesEstado,
} = require("../controllers/finanzasController");

// Rutas protegidas
router.get("/", verificarToken, getDatosFinancieros);
router.get("/ventas-por-mes", verificarToken, getVentasPorMes);
router.get("/productos-mas-vendidos", verificarToken, getProductosMasVendidos);
router.get("/ordenes-estado", verificarToken, getOrdenesEstado);

module.exports = router;