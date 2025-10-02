const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


require("./models/associations_model");
const db = require("./config/db");


const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/users_routes");
const productRoutes = require("./routes/products_routes");
const orderRoutes = require("./routes/orders_routes");
const reviewRoutes = require("./routes/review_routes");
const pqrsRoutes = require("./routes/pqrs_routes");


const ofertasRoutes = require("./routes/ofertas_routes");
const carritoRoutes = require("./routes/carrito_routes");
const descuentosRoutes = require("./routes/descuentos_routes"); 

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);        
app.use("/api/users", userRoutes);       
app.use("/api/products", productRoutes); 
app.use("/api/orders", orderRoutes);     
app.use("/api/reviews", reviewRoutes);   
app.use("/api/pqrs", pqrsRoutes);       


app.use("/api/ofertas", ofertasRoutes);   
app.use("/api/carrito", carritoRoutes);   


app.use("/api/descuentos", descuentosRoutes); 


db.authenticate()
  .then(() => {
    console.log(" Conectado a la base de datos MySQL");
  })
  .catch((err) => console.error(" Error al conectar DB:", err));


app.use((err, req, res, next) => {
  console.error(" Error no manejado:", err.stack);
  res.status(500).json({
    success: false,
    error: "Error interno en el servidor"
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
});
