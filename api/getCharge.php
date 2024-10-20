<?php
require_once __DIR__ . '/../Model/DB.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    try {
        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("SELECT * FROM cargos");
        $success = $stmt->execute();

        if ($success) {
            $cargos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'cargos' => $cargos]);
        } else {
            throw new Exception("Error al obtener los cargos de la base de datos");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
