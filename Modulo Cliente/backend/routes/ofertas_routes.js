const express = require("express");
const router = express.Router();
const controller = require("../controllers/ofertas_controller");

console.log("DEBUG controller:", controller);

router.get("/", controller.getOfertasActivas);

module.exports = router;
