<?php
require_once __DIR__ . '/../Model/DB.php';

session_start();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $email = $_SESSION['usuario'];

    try {
        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("SELECT id_area FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $id_area = $stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT * FROM cargos WHERE id_area = ?");
        $success = $stmt->execute([$id_area]);

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
