// routes/orders_routes.js
const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/order_controller"); // ← Verifica esta línea
const { authenticateToken } = require("../middlewares/auth_middleware");

// ✅ Asegúrate de que ordersController.createOrder sea una función
router.post("/", authenticateToken, ordersController.createOrder);

// Más rutas...
router.get("/", authenticateToken, ordersController.getOrders);
router.get("/:id", authenticateToken, ordersController.getOrderById);
router.put("/:id", authenticateToken, ordersController.updateOrder);

module.exports = router;