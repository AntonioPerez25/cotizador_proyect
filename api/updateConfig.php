<?php
require_once __DIR__ . '/../Model/DB.php';

session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = $_SESSION['usuario'];

    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['cost']) || !isset($input['hour'])) {
            throw new Exception("Datos incompletos");
        }

        $cost = intval($input['cost']);
        $hour = trim($input['hour']);

        if ($cost <= 0 || $hour <= 0) {
            throw new Exception("Datos inválidos");
        }

        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("SELECT id_area FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $id_area = $stmt->fetchColumn();

        $stmt = $pdo->prepare("UPDATE configuracion SET horas_laborales = ?, costo_manufactura = ? WHERE id_area = ?");
        $success = $stmt->execute([$cost, $hour, $id_area]);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Error al actualizr la configuracion en la base de datos");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
