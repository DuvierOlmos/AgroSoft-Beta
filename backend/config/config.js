// backend/config/config.js
const mysql = require("mysql2/promise");
require("dotenv").config(); // carga variables del .env


// conexión a MySQL usando pool de promesas
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Verificar conexión (opcional, solo para mostrar mensaje)
db.getConnection()
  .then(() => {
    console.log("✅ Conexión a MySQL exitosa");
  })
  .catch((err) => {
    console.error("❌ Error de conexión a MySQL:", err);
  });

module.exports = db;

