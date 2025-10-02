import express from "express";
import { obtenerOrdenes, actualizarEstadoOrden, obtenerDetalleOrden } from "../controllers/ordenesController.js";

const router = express.Router();

router.get("/productor/:idProductor", obtenerOrdenes);
router.put("/:id", actualizarEstadoOrden);
router.get("/:id/detalle", obtenerDetalleOrden);

export default router;