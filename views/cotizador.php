<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../index.html");
    exit();
}

require_once __DIR__ . '/../Model/DB.php';

$email = $_SESSION['usuario'];
try {
    $pdo = (new Database())->connect();
    $stmt = $pdo->prepare("SELECT rol FROM usuarios where email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $rol = $user['rol'];
    } else {
        echo "Usuario no encontrado";
        exit();
    }
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../assets/icons/icon_cotizador.png" type="image/x-icon">
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <script src="../js/app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Cotizador de Servicios</title>
</head>

<body>
    <span id="marca_agua">NO VÁLIDO</span>
    <img src="../assets/images/logo_ibs.png" alt="logo alt" id="logo_print">
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="../assets/images/ibslogo.png" alt="logo" id="logo" />
            <img src="../assets/images/ibsg-logo-b.png" alt="logo alt" id="logo_alt">
        </div>
        <ul class="sidebar-links">
            <h4 class="<?= $user['rol'] == 'admin' ? '' : 'hidden'; ?>">
                <span>General</span>
                <div class="menu-separator"></div>
            </h4>
            <li>
                <button id="btn_modal_add_charge" class="<?= $user['rol'] == 'admin' ? '' : 'hidden'; ?>">
                    <a><span class="material-symbols-outlined"> person_add </span>Agregar cargo</a>
                </button>
            </li>
            <li>
                <button id="btn_modal_modify_charge" class="<?= $user['rol'] == 'admin' ? '' : 'hidden'; ?>">
                    <a><span class="material-symbols-outlined"> update </span>Modificar cargo</a>
                </button>
            </li>
            <li>
                <button id="btn_modal_delete_charge" class="<?= $user['rol'] == 'admin' ? '' : 'hidden'; ?>">
                    <a><span class="material-symbols-outlined"> delete </span>Eliminar cargo</a>
                </button>
            </li>
            <li>
                <button id="btn_modal_edit_other" class="<?= $user['rol'] == 'admin' ? '' : 'hidden'; ?>">
                    <a><span class="material-symbols-outlined"> edit_note </span>Editar otros</a>
                </button>
            </li>
            <h4>
                <span>Cuenta</span>
                <div class="menu-separator"></div>
            </h4>
            <li>
                <button id="open_modal"><a><span class="material-symbols-outlined"> passkey </span>Cambiar contraseña</a></button>
            </li>
            <li>
                <a href="../Model/logout.php"><span class="material-symbols-outlined"> logout </span>Salir</a>
            </li>
        </ul>
        <div class="user-account">
            <div class="user-profile">
                <img src="../assets/images/perfil.png" alt="Profile Image" />
                <div class="user-detail">
                    <h3>Rol: <?php echo htmlspecialchars($rol); ?></h3>
                    <span><?php echo htmlspecialchars($email); ?></span>
                </div>
            </div>
        </div>
    </aside>
    <main>
        <div class="content">
            <div>
                <h3>Cotizador de servicios</h3>
                <div class="container_charges">
                    <div class="<?= $user['rol'] == 'admin' ? '' : 'hidden'; ?>">
                        <table class="charges">
                            <thead>
                                <tr>
                                    <th class="default_th" rowspan="2">Cargos</th>
                                    <th class="default_th" rowspan="2">Sueldo</th>
                                    <th class="default_th" rowspan="2">Sueldo x hora</th>
                                    <th class="default_th" rowspan="2">% de Nómina</th>
                                    <th class="default_th" rowspan="2">Costo manufactura mensual</th>
                                    <th class="default_th" rowspan="2">Costo manufactura por hora</th>
                                    <th class="default_th" rowspan="2">Margen</th>
                                    <th class="cell_esc th" rowspan="2">Hora Escritorio</th>
                                    <th class="cell_cli th" rowspan="2">Hora Cliente</th>
                                    <th class="cell_cap th" rowspan="2">Hora Capacitación</th>
                                    <th class="cell_esc th" colspan="2">Hora Escritorio</th>
                                    <th class="cell_cli th" colspan="2">Hora Cliente</th>
                                    <th class="cell_cap th" colspan="2">Hora Capacitación</th>
                                </tr>
                                <tr>
                                    <th class="cell_esc th">Precio</th>
                                    <th class="cell_esc th">Precio + IVA</th>
                                    <th class="cell_cli th">Precio</th>
                                    <th class="cell_cli th">Precio + IVA</th>
                                    <th class="cell_cap th">Precio</th>
                                    <th class="cell_cap th">Precio + IVA</th>
                                </tr>
                            </thead>
                            <tbody id="table_body_charges">
                                <tr>
                                    <td class="td_charge"></td>
                                    <td class="td_salary"></td>
                                    <td class="td_salary_x_hour"></td>
                                    <td class="td_nomina"></td>
                                    <td class="td_manu_month"></td>
                                    <td class="td_manu_hour"></td>
                                    <td class="td_margin"></td>
                                    <td class="td_hour_esc"></td>
                                    <td class="td_hour_cli"></td>
                                    <td class="td_hour_cap"></td>
                                    <td class="td_price_esc"></td>
                                    <td class="td_price_iva_esc"></td>
                                    <td class="td_price_cli"></td>
                                    <td class="td_price_iva_cli"></td>
                                    <td class="td_price_cap"></td>
                                    <td class="td_price_iva_cap"></td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td class="td_total"></td>
                                    <td colspan="100%"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="container_hours">
                    <div>
                        <table class="phases">
                            <thead>
                                <tr>
                                    <th class="default_th">Fases</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Cargo</td>
                                </tr>
                                <tr>
                                    <td>Análisis</td>
                                </tr>
                                <tr>
                                    <td>Diseño</td>
                                </tr>
                                <tr>
                                    <td>Desarrollo</td>
                                </tr>
                                <tr>
                                    <td>Implementación</td>
                                </tr>
                                <tr>
                                    <td>Mantenimiento</td>
                                </tr>
                                <tr>
                                    <td>Horas totales</td>
                                </tr>
                                <tr>
                                    <td>Costo sin IVA</td>
                                </tr>
                                <tr>
                                    <td>Costo con IVA</td>
                                </tr>
                            </tbody>
                        </table>
                        <button id="btn_add_charge">Agregar Cargo</button>
                    </div>
                    <div id="container_hours_dedicated">
                    </div>
                </div>
                <br>
                <div class="container_payments">
                    <div>
                        <table class="hours_total">
                            <thead>
                                <tr>
                                    <th class="cell_cap" colspan="2">Horas totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Escritorio</td>
                                    <td class="hours_total_esc"></td>
                                </tr>
                                <tr>
                                    <td>Cliente</td>
                                    <td class="hours_total_cli"></td>
                                </tr>
                                <tr>
                                    <td>Capacitación</td>
                                    <td class="hours_total_cap"></td>
                                </tr>
                                <tr>
                                    <th class="cell_cap" colspan="2">Costo total</th>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td class="cost_total"></td>
                                </tr>
                                <tr>
                                    <td>Descuento 10%</td>
                                    <td class="descount_ten"></td>
                                </tr>
                                <tr>
                                    <td>Descuento 5%</td>
                                    <td class="descount_five"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="monthly_plan">
                            <caption>Plan mensual</caption>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th class="cell_cap">1</th>
                                    <th class="cell_cap">2</th>
                                    <th class="cell_cap">3</th>
                                    <th class="cell_cap">4</th>
                                    <th class="cell_cap">5</th>
                                    <th class="cell_cap">6</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Descuento 10%</td>
                                    <td class="descount_ten_one"></td>
                                    <td class="descount_ten_two"></td>
                                    <td class="descount_ten_three"></td>
                                    <td class="descount_ten_four"></td>
                                    <td class="descount_ten_five"></td>
                                    <td class="descount_ten_six"></td>
                                </tr>
                                <tr>
                                    <td>Descuento 5%</td>
                                    <td class="descount_five_one"></td>
                                    <td class="descount_five_two"></td>
                                    <td class="descount_five_three"></td>
                                    <td class="descount_five_four"></td>
                                    <td class="descount_five_five"></td>
                                    <td class="descount_five_six"></td>
                                </tr>
                                <tr>
                                    <td>Sin descuento</td>
                                    <td class="no_descount_one"></td>
                                    <td class="no_descount_two"></td>
                                    <td class="no_descount_three"></td>
                                    <td class="no_descount_four"></td>
                                    <td class="no_descount_five"></td>
                                    <td class="no_descount_six"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="hours_costs">
                            <tbody>
                                <tr>
                                    <td colspan="3">Costo manufactura mensual (Promedio)</td>
                                </tr>
                                <tr>
                                    <td class="average" colspan="3"></td>
                                </tr>
                                <tr>
                                    <td>Horas laborables</td>
                                    <td>Horas facturables</td>
                                    <td>Horas no facturables</td>
                                </tr>
                                <tr>
                                    <td class="hours_lab"></td>
                                    <td class="hours_fac"></td>
                                    <td class="hours_nofac"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </main>
</body>

</html>