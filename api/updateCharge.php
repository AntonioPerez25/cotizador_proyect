<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'ruta/a/tu/log/php_errors.log');

require_once __DIR__ . '/../Model/DB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id']) || !isset($input['cargo']) || !isset($input['salario']) || !isset($input['margen'])) {
            throw new Exception("Datos incompletos");
        }

        $id = intval($input['id']);
        $cargo = trim($input['cargo']);
        $salario = floatval($input['salario']);
        $margen = floatval($input['margen']);

        if (empty($cargo) || $salario <= 0 || $margen <= 0) {
            throw new Exception("Datos inválidos");
        }

        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("UPDATE cargos SET cargo = ?, salario = ?, margen_utilidad = ? WHERE id_cargo = ?");
        $success = $stmt->execute([$cargo, $salario, $margen, $id]);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Error al actualizr el cargo en la base de datos");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
