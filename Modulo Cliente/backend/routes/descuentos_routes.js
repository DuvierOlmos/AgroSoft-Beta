// descuentos_routes.js
const express = require("express");
const router = express.Router();

// Verifica que esta ruta sea correcta
const descuentosController = require("../controllers/descuentos_controller");

// Usa las funciones directamente
router.get("/activos", descuentosController.getDescuentosActivos);
router.post("/validar", descuentosController.validarCodigo);

module.exports = router;