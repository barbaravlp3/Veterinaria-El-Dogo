<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'modelos.php';

$method = $_SERVER['REQUEST_METHOD'];
$mascotas = new ModeloABM('mascotas');

error_log("📨 Método recibido: $method");

switch ($method) {

    // 📥 LISTAR
    case 'GET':
        if (!empty($_GET['id'])) {
            $id = intval($_GET['id']);
            $mascotas->set_criterio("id=$id");
        }
        $datos = $mascotas->seleccionar();
        error_log("📤 SELECT enviado al front");
        echo $datos;
        break;

    // ➕ CREAR NUEVA MASCOTA
    case 'POST':
        // 🔹 Detectar si viene JSON o FormData
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        error_log("📩 Datos recibidos en POST: " . print_r($input, true));

        $nombre = $input['nombre'] ?? '';
        $especie = $input['especie'] ?? '';
        $raza = $input['raza'] ?? '';
        $edad = $input['edad'] ?? '';
        $problemas = $input['problemas_de_salud'] ?? '';
        $duenio = $input['duenio_asociado'] ?? '';

        if ($nombre === '' || $especie === '' || $duenio === '') {
            error_log("⚠️ Faltan campos obligatorios");
            echo json_encode(['error' => 'Faltan campos obligatorios']);
            exit;
        }

        $valores = [
            'nombre' => $nombre,
            'especie' => $especie,
            'raza' => $raza,
            'edad' => $edad,
            'problemas_de_salud' => $problemas,
            'duenio_asociado' => $duenio
        ];

        try {
            $nuevoId = $mascotas->insertar($valores);
            error_log("✅ Mascota insertada correctamente con ID $nuevoId");
            echo json_encode(['mensaje' => 'Mascota creada correctamente', 'id' => $nuevoId]);
        } catch (Exception $e) {
            error_log("❌ Error al insertar mascota: " . $e->getMessage());
            echo json_encode(['error' => 'Error al insertar: ' . $e->getMessage()]);
        }
        break;

    // ✏️ ACTUALIZAR
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        error_log("✏️ Datos recibidos en PUT: " . print_r($input, true));

        $id = intval($input['id'] ?? 0);
        if ($id <= 0) {
            error_log("⚠️ ID inválido recibido");
            echo json_encode(['error' => 'ID inválido']);
            exit;
        }

        $valores = [];
        foreach (['nombre', 'especie', 'raza', 'edad', 'problemas_de_salud', 'duenio_asociado'] as $campo) {
            if (isset($input[$campo])) $valores[$campo] = $input[$campo];
        }

        try {
            $mascotas->set_criterio("id=$id");
            $mascotas->actualizar($valores);
            error_log("✅ Mascota actualizada correctamente ID=$id");
            echo json_encode(['mensaje' => 'Mascota actualizada correctamente']);
        } catch (Exception $e) {
            error_log("❌ Error al actualizar mascota: " . $e->getMessage());
            echo json_encode(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
        break;

    // ❌ ELIMINAR
    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        error_log("🗑️ Datos recibidos en DELETE: " . print_r($_DELETE, true));

        $id = intval($_DELETE['id'] ?? 0);
        if ($id <= 0) {
            error_log("⚠️ ID inválido en DELETE");
            echo json_encode(['error' => 'ID inválido']);
            exit;
        }

        try {
            $mascotas->set_criterio("id=$id");
            $mascotas->eliminar();
            error_log("✅ Mascota eliminada correctamente ID=$id");
            echo json_encode(['mensaje' => 'Mascota eliminada correctamente']);
        } catch (Exception $e) {
            error_log("❌ Error al eliminar: " . $e->getMessage());
            echo json_encode(['error' => 'Error al eliminar: ' . $e->getMessage()]);
        }
        break;

    default:
        error_log("🚫 Método HTTP no permitido: $method");
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
