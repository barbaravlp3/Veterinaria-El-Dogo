<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'modelos.php';

// Determinar el método HTTP (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];
$clientes = new ModeloABM('clientes');

switch ($method) {
    // 📥 LISTAR o CONSULTAR CLIENTES
    case 'GET':
        if (!empty($_GET['id'])) {
            $id = intval($_GET['id']);
            $clientes->set_criterio("id=$id");
        }
        $datos = $clientes->seleccionar();
        echo $datos;
        break;

    // ➕ AGREGAR CLIENTE NUEVO
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $nombre = $input['nombre'] ?? '';
        $apellido = $input['apellido'] ?? '';
        $dni = $input['dni'] ?? '';
        $telefono = $input['telefono'] ?? '';
        $direccion = $input['direccion'] ?? '';
       

        if ($nombre === '' || $dni === '' || $telefono === '') {
            echo json_encode(['error' => 'Faltan campos obligatorios']);
            exit;
        }

        $valores = [
            'nombre' => $nombre,
            'apellido' => $apellido,
            'dni' => $dni,
            'telefono' => $telefono,
            'direccion' => $direccion,
            
        ];

        $resultado = $clientes->insertar($valores);
        echo json_encode(['mensaje' => 'Cliente creado', 'resultado' => $resultado]);
        break;

    // ✏️ MODIFICAR CLIENTE EXISTENTE
    case 'PUT':
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['error' => 'ID inválido']);
        exit;
    }

    $valores = [];
    foreach (['nombre', 'apellido','dni', 'telefono', 'direccion'] as $campo) {
        if (isset($input[$campo])) $valores[$campo] = $input[$campo];
    }

    $clientes->set_criterio("id=$id");
    // ✅ corregido
    $resultado = $clientes->actualizar($valores);

    echo json_encode(['mensaje' => 'Cliente actualizado', 'resultado' => $resultado]);
    break;

    // ❌ ELIMINAR CLIENTE
    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = intval($_DELETE['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['error' => 'ID inválido']);
            exit;
        }

        $clientes->set_criterio("id=$id");
        $resultado = $clientes->eliminar();
        echo json_encode(['mensaje' => 'Cliente eliminado', 'resultado' => $resultado]);
        break;

    default:
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
