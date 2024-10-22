<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'ruta/a/tu/log/php_errors.log');

require_once __DIR__ . '/DB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (!isset($_SESSION['usuario']) || empty($_SESSION['usuario'])) {
            throw new Exception("Sesión no iniciada o usuario no autenticado.");
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['nueva_contrasena']) || empty(trim($input['nueva_contrasena']))) {
            throw new Exception("No se proporcionó una nueva contraseña válida.");
        }

        $nuevaContrasena = trim($input['nueva_contrasena']);

        $hashedNuevaContrasena = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

        $pdo = (new Database())->connect();

        $stmt = $pdo->prepare("UPDATE usuarios SET contrasena = ? WHERE email = ?");
        $success = $stmt->execute([$hashedNuevaContrasena, $_SESSION['usuario']]);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Error al ejecutar la consulta de actualización.");
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Ocurrió un error en el proceso.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
