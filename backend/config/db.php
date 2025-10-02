<?php
$host = "localhost";
$usuario = "root";
$clave = "";
$base_datos = "Agrosoft2";
$puerto = 3306;

// Crear conexión
$conn = new mysqli($host, $usuario, $clave, $base_datos, $puerto);

// Verificar conexión
if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}
?>

