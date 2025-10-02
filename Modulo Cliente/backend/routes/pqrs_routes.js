// routes/pqrs_routes.js
const express = require("express");
const router = express.Router();
const pqrsController = require("../controllers/pqrs_controller");
const { authenticateToken, isCliente, isAdmin } = require("../middlewares/auth_middleware");

// 🔐 CLIENTE: Crear PQRS
router.post("/", authenticateToken, isCliente, pqrsController.createPqrs);

// 🔐 CLIENTE: Ver mis PQRS
router.get("/my-pqrs", authenticateToken, isCliente, pqrsController.getMyPqrs);

// 🔐 CLIENTE/ADMIN: Ver un PQRS específico por ID
router.get("/:id_pqrs", authenticateToken, pqrsController.getPqrsById);

// 🔐 ADMIN: Ver todos los PQRS
router.get("/", authenticateToken, isAdmin, pqrsController.getAllPqrs);

// 🔐 ADMIN: Actualizar estado PQRS
router.put("/:id_pqrs", authenticateToken, isAdmin, pqrsController.updatePqrsStatus);

module.exports = router;
