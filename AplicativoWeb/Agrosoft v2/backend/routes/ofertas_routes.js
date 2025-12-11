const express = require("express");
const router = express.Router();

const ofertasController = require("../controllers/ofertas_controller");

/* ======================================================
   RUTAS DE OFERTAS (CLIENTE)
====================================================== */

// Obtener todos los códigos de descuento
router.get("/codigos", (req, res) => {
    ofertasController.listarCodigos(req, res);
});

// Validar un código por URL: /api/ofertas/validar/BLACK30
router.get("/validar/:codigo", (req, res) => {
    ofertasController.validarCodigo(req, res);
});

// Listar productos que tengan descuento u oferta
router.get("/productos", (req, res) => {
    ofertasController.productosEnOferta(req, res);
});

module.exports = router;
