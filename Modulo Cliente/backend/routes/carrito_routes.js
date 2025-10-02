const express = require("express");
const router = express.Router();

// 👇 define primero el require
const controller = require("../controllers/carrito_controller");

// 👇 ahora sí puedes debuguear
console.log("DEBUG carrito_controller:", controller);

router.post("/agregar", controller.agregarAlCarrito);
router.get("/:id_usuario", controller.getCarritoByUsuario);

module.exports = router;
