// routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const estadoPedidoController = require('../controllers/estadoPedidoController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Rutas de ADMINISTRACIÓN de Pedidos
// Se requiere token válido y rol de administrador (id_rol = 2)

router.get('/admin', authenticateToken, isAdmin, pedidoController.getAllPedidosAdmin); 
router.get('/admin/:id', authenticateToken, isAdmin, pedidoController.getPedidoByIdAdmin);

// Rutas para actualizar estados
router.put('/admin/orders/estado/:id', authenticateToken, isAdmin, estadoPedidoController.updateEstadoPedido);
router.put('/admin/estadoPedido/:id', authenticateToken, isAdmin, estadoPedidoController.updateEstadoPedido); 

module.exports = router;