const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito_controller');

// ✅ Rutas del carrito
router.get('/numero-items/:id_usuario', carritoController.getNumeroItems);
router.get('/items/:id_carrito', carritoController.getCarritoItems);
router.get('/:id_usuario', carritoController.getCarritoActivo);
router.post('/', carritoController.addToCart);
router.put('/item/:id_item', carritoController.updateCarritoItem);
router.delete('/item/:id_item', carritoController.deleteCarritoItem);
router.post('/compras', carritoController.procesarCompra);

module.exports = router;
