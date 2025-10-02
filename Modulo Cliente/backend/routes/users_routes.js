const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const { authenticateToken } = require("../middlewares/auth_middleware");

// Perfil del usuario
router.get("/profile", authenticateToken, userController.getProfile);

// Actualizar perfil
router.put("/profile", authenticateToken, userController.updateProfile);

// Pedidos del usuario
router.get("/orders", authenticateToken, userController.getUserOrders);

// ⚠️ Si quieres reseñas del usuario logueado, se pueden dejar aquí
router.get("/reviews", authenticateToken, userController.getUserReviews);

module.exports = router;
