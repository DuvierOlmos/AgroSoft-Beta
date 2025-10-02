const express = require("express");
const router = express.Router();
const productController = require("../controllers/product_controller");
const { authenticateToken, isAdmin, isAgricultor } = require("../middlewares/auth_middleware");

// Rutas públicas
router.get("/", productController.getAllProducts);
router.get("/:id_producto", productController.getProductById);

// Rutas protegidas para agricultores
router.post("/", authenticateToken, isAgricultor, productController.createProduct);
router.put("/:id_producto", authenticateToken, isAgricultor, productController.updateProduct);

// Rutas protegidas para administradores
router.delete("/:id_producto", authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;
