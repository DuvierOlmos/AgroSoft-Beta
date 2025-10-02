// routes/finanzasRoutes.js
import { Router } from 'express';
import { getDatosFinancieros, getVentasPorMes, getProductosMasVendidos, getOrdenesEstado } from '../controllers/finanzasController.js'; 

const router = Router();

// Define la ruta GET para obtener los datos financieros
router.get('/', getDatosFinancieros);
// Las siguientes rutas ahora tienen la barra inicial
router.get('/ventas-por-mes', getVentasPorMes);
router.get('/productos-mas-vendidos', getProductosMasVendidos);
router.get('/ordenes-estado', getOrdenesEstado);

export default router;