<?php
require_once __DIR__ . '/../Model/DB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['cargo']) || !isset($input['precio_iva_esc']) || !isset($input['precio_iva_cli']) || !isset($input['precio_iva_cap'])) {
            throw new Exception("Datos incompletos");
        }

        $cargo = trim($input['cargo']);
        $iva_esc = floatval($input['precio_iva_esc']);
        $iva_cli = floatval($input['precio_iva_cli']);
        $iva_cap = floatval($input['precio_iva_cap']);

        if ($iva_esc <= 0 || $iva_cli <= 0 || $iva_cap <= 0) {
            throw new Exception("Datos inválidos");
        }

        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("UPDATE cargos SET precio_iva_esc = ?, precio_iva_cli = ?, precio_iva_cap = ? WHERE cargo = ?");
        $success = $stmt->execute([$iva_esc, $iva_cli, $iva_cap, $cargo]);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Error al actualizr los precios en la base de datos");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
