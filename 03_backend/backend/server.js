const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

require("./models/associations_model");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/products_routes");
const orderRoutes = require("./routes/orders_routes");
const reviewRoutes = require("./routes/review_routes");
const pqrsRoutes = require("./routes/pqrs_routes");
const ofertasRoutes = require("./routes/ofertas_routes");
const descuentosRoutes = require("./routes/descuentos_routes");

const ofertaRoutes = require("./routes/ofertaRoutes");
const ordenRoutes = require("./routes/ordenRoutes");
const productorRoutes = require("./routes/productorRoutes");
const finanzasRoutes = require("./routes/finanzasRoutes");
const comentarioResenaRoutes = require("./routes/comentarioResenaRoutes");
const subcategoriaRoutes = require('./routes/subcategoriaRoutes');

// ✅ NUEVA LÍNEA:
const carritoRoutes = require("./routes/carrito_routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando...");
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/pqrs", pqrsRoutes);
app.use("/api/ofertas", ofertasRoutes);
app.use("/api/descuentos", descuentosRoutes);

app.use("/api/ofertas", ofertaRoutes);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/productor", productorRoutes);
app.use("/api/finanzas", finanzasRoutes);
app.use("/api/comentarios", comentarioResenaRoutes);
app.use('/api/subcategorias', subcategoriaRoutes); 

// ✅ NUEVA LÍNEA (registra las rutas del carrito)
app.use("/api/carrito", carritoRoutes);

db.authenticate()
  .then(() => {
    console.log("✅ Conectado a la base de datos MySQL");
  })
  .catch((err) => {
    console.error("❌ Error al conectar DB:", err);
  });

app.use((err, req, res, next) => {
  console.error(" Error no manejado:", err.stack);
  res.status(500).json({
    success: false,
    error: "Error interno en el servidor"
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
