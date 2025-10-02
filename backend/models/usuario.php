<?php
class Usuario {
    private $conn;
    private $table = "usuarios";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Registrar usuario
    public function registrar($nombre, $correo, $contrasena, $id_rol, $documento) {
        $sql = "INSERT INTO " . $this->table . " 
                (nombre_usuario, correo_electronico, contrasena, id_rol, documento_identidad) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssis", $nombre, $correo, $contrasena, $id_rol, $documento);
        return $stmt->execute() ? $stmt->insert_id : false;
    }

    // Buscar usuario por correo
    public function obtenerPorCorreo($correo) {
        $sql = "SELECT id_usuario, nombre_usuario, correo_electronico, contrasena, id_rol, documento_identidad 
                FROM " . $this->table . " WHERE correo_electronico = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
?>
