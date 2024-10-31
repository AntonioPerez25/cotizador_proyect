<?php
require_once __DIR__ . '/../Model/DB.php';

session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        $input = json_decode(file_get_contents('php://input'), true);

        $email = $_SESSION['usuario'];

        if (!isset($input['cargo']) || !isset($input['salario']) || !isset($input['margen'])) {
            throw new Exception("Faltan datos requeridos");
        }

        $cargo = trim($input['cargo']);
        $salario = floatval($input['salario']);
        $margen = floatval($input['margen']);

        if (empty($cargo) || $salario <= 0 || $margen <= 0) {
            throw new Exception("Datos inválidos");
        }

        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("SELECT id_area FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $id_area = $stmt->fetchColumn();

        if (!$id_area) {
            throw new Exception("No se encontró el área para el usuario");
        }

        $stmt = $pdo->prepare("INSERT INTO cargos (cargo, salario, margen_utilidad, id_area) VALUES (?, ?, ?, ?)");
        $success = $stmt->execute([$cargo, $salario, $margen, $id_area]);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Error al insertar el nuevo cargo en la base de datos");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
