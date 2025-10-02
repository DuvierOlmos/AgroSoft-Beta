const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review_controller");
const { authenticateToken, isCliente } = require("../middlewares/auth_middleware");

// Crear reseña (solo cliente logueado)
router.post("/", authenticateToken, isCliente, reviewController.createReview);

// Obtener reseñas de un producto
router.get("/product/:id_producto", reviewController.getReviewsByProduct);

// Obtener todas las reseñas (ej: admin)
router.get("/", authenticateToken, reviewController.getAllReviews);

// Eliminar reseña (admin o autor de la reseña)
router.delete("/:id", authenticateToken, reviewController.deleteReview);

module.exports = router;
