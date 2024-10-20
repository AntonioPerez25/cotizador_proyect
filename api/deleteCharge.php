<?php
require_once __DIR__ . '/../Model/DB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            throw new Exception("Datos incompletos");
        }

        $id = intval($input['id']);

        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("DELETE FROM cargos WHERE id_cargo = ?");
        $success = $stmt->execute([$id]);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Error al eliminar el cargo en la base de datos");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
