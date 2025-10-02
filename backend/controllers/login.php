<?php
include_once __DIR__ . '/../config/db.php';
include_once __DIR__ . '/../models/Usuario.php';

// JSON recibido
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos JSON"]);
    exit;
}

$correo = $data["correo_electronico"] ?? '';
$contrasena = $data["contrasena"] ?? '';

if (!$correo || !$contrasena) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    exit;
}

$usuario = new Usuario($conn);
$userData = $usuario->obtenerPorCorreo($correo);

if (!$userData) {
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    exit;
}

// Verificar contraseña
if (password_verify($contrasena, $userData['contrasena'])) {
    echo json_encode([
        "status" => "success",
        "message" => "Login exitoso",
        "usuario" => [
        "id_usuario" => $userData['id_usuario'],
        "nombre_usuario" => $userData['nombre_usuario'],
        "correo_electronico" => $userData['correo_electronico'],
        "id_rol" => $userData['id_rol']
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
}
