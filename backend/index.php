<?php
// Cabeceras
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$basePath = "/Agro_usuarios/backend";
$route = str_replace($basePath, "", $request);

switch ($route) {
    case "/login":
        require __DIR__ . "/controllers/login.php";
        break;

    case "/register":
        require __DIR__ . "/controllers/register.php";
        break;

    default:
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Ruta no encontrada"]);
        break;
}
