import express from 'express';
import { getProductos, addProducto, updateProducto, deleteProducto } from '../controllers/productoController.js';

const router = express.Router();

router.get('/productos', getProductos);
router.post('/productos', addProducto);
router.put('/productos/:id', updateProducto);
router.delete('/productos/:id', deleteProducto);

export default router;