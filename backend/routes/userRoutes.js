
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Importa el controller final

// Rutas de usuario
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
