<?php
include_once __DIR__ . '/../config/db.php';
include_once __DIR__ . '/../models/Usuario.php';


header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Leer el JSON recibido
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos JSON"]);
    exit;
}

$nombre = $data["nombre_usuario"] ?? '';
$correo = $data["correo_electronico"] ?? '';
$contrasena = $data["contrasena"] ?? '';
$documento = $data["documento_identidad"] ?? '';
$id_rol = $data["id_rol"] ?? 2;


if (!$nombre || !$correo || !$contrasena || !$documento) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    exit;
}


$usuario = new Usuario($conn);
$hashedPassword = password_hash($contrasena, PASSWORD_DEFAULT);


$id = $usuario->registrar($nombre, $correo, $hashedPassword, $id_rol, $documento);

if ($id) {
    echo json_encode([
        "status" => "exitoso!!!",
        "message" => "Usuario registrado correctamente, bienvenido a la familia AGRO",
        "usuario" => [
            "id_usuario" => $id,
            "nombre_usuario" => $nombre,
            "correo_electronico" => $correo,
            "id_rol" => $id_rol,
            "documento_identidad" => $documento
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo registrar el usuario"
    ]);
}
?>

