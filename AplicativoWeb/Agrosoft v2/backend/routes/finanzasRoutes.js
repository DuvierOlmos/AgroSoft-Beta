const express = require("express");
const router = express.Router();
const { verificarToken } = require("../utils/jwt");
const {
 getDatosFinancieros,
 getVentasPorMes,
 getProductosMasVendidos,
 getOrdenesEstado,
	reportProductos,
	reportInventario,
	reportPedidos,
	 reportDescuentos,
} = require("../controllers/finanzasController");

// Rutas protegidas
router.get("/", verificarToken, getDatosFinancieros);
router.get("/ventas-por-mes", verificarToken, getVentasPorMes);
router.get("/productos-mas-vendidos", verificarToken, getProductosMasVendidos);
router.get("/ordenes-estado", verificarToken, getOrdenesEstado);

// Rutas de reportes (soportan ?format=pdf|excel|html ó ?preview=1)
router.get('/reportes/productos', verificarToken, reportProductos);
router.get('/reportes/inventario', verificarToken, reportInventario);
router.get('/reportes/pedidos', verificarToken, reportPedidos);
router.get('/reportes/descuentos', verificarToken, reportDescuentos);

// ==========================================
// 🛡️ RUTAS ADMIN (GLOBALES)
// ==========================================
const {
  getDatosFinancierosAdmin,
  getVentasPorMesAdmin,
  getProductosMasVendidosAdmin,
  getOrdenesEstadoAdmin,
  reportProductosAdmin,
  reportInventarioAdmin,
  reportPedidosAdmin,
  reportDescuentosAdmin
} = require("../controllers/finanzasController");

// Dashboard Admin Stats
router.get("/admin/stats", verificarToken, getDatosFinancierosAdmin);
router.get("/admin/ventas-por-mes", verificarToken, getVentasPorMesAdmin);
router.get("/admin/productos-mas-vendidos", verificarToken, getProductosMasVendidosAdmin);
router.get("/admin/ordenes-estado", verificarToken, getOrdenesEstadoAdmin);

// Reportes Admin Globales
router.get('/admin/reportes/productos', verificarToken, reportProductosAdmin);
router.get('/admin/reportes/inventario', verificarToken, reportInventarioAdmin);
router.get('/admin/reportes/pedidos', verificarToken, reportPedidosAdmin);
router.get('/admin/reportes/descuentos', verificarToken, reportDescuentosAdmin);

module.exports = router;