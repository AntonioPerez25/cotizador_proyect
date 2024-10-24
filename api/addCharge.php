<?php
require_once __DIR__ . '/../Model/DB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        $input = json_decode(file_get_contents('php://input'), true);

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

        $stmt = $pdo->prepare("INSERT INTO cargos (cargo, salario, margen_utilidad) VALUES (?, ?, ?)");
        $success = $stmt->execute([$cargo, $salario, $margen]);

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
