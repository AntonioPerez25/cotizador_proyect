<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/DB.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = (new Database())->connect();
    $email = $_POST['email'];
    $password = $_POST['password'];

    try {
        $stmt = $pdo->prepare("SELECT email, contrasena FROM usuarios where email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['contrasena'])) {
            $_SESSION['usuario'] = $email;
            header("Location: ../views/cotizador.php");
            exit();
        } else {
            header("Location: ../index.html?error=1");
            return;
        }
    } catch (PDOException $e) {
        return 'Error: ' . $e->getMessage();
    }
}
