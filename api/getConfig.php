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

        if (!$id_area) {
            throw new Exception("Usuario no encontrado");
        }

        $stmt = $pdo->prepare("SELECT horas_laborales, costo_manufactura FROM configuracion WHERE id_area = ?");
        $stmt->execute([$id_area]);
        $config = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($config) {
            echo json_encode(['success' => true, 'config' => $config]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se encontró la configuración']);
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
