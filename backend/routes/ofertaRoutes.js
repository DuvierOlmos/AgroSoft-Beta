// backend/routes/ofertaRoutes.js (CÓDIGO CORREGIDO)

import express from 'express';
// Importamos las 4 funciones desde el controlador
import { 
    obtenerPromocionesProductor, 
    crearNuevaOferta, 
    actualizarPromocion, 
    eliminarOferta 
} from '../controllers/ofertaController.js'; 

const router = express.Router();

// PUT: /api/ofertas/:id?tipo=oferta/descuento
router.put('/:id', actualizarPromocion); 

// GET: /api/ofertas/productor/:id
router.get('/productor/:id', obtenerPromocionesProductor);

// POST: /api/ofertas
router.post('/', crearNuevaOferta);

// DELETE: /api/ofertas/:id?tipo=oferta/descuento
router.delete('/:id', eliminarOferta); 

export default router;