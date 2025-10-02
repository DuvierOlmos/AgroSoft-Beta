import express from 'express';
import finanzasRoutes from './finanzasRoutes.js';
import productorRoutes from './productor_routes.js';
import ordenRoutes from './ordenesRoutes.js';
import promociones from './ofertaRoutes.js'; 

const router = express.Router();

router.use('/productor', productorRoutes);
router.use('/finanzas', finanzasRoutes);
router.use('/ordenes', ordenRoutes);
router.use('/promociones', promociones);


export default router;