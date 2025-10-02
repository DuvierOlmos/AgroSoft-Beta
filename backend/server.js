const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // 👈 importamos las rutas

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Servidor funcionando...");
});

// Rutas reales de usuarios
app.use("/api/users", userRoutes); // 👈 activamos las rutas

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
