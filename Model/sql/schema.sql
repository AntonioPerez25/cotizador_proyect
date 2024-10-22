create table usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR (255) NOT NULL UNIQUE,
    contrasena VARCHAR (255) NOT NULL,
    rol VARCHAR (50) NOT NULL
);

create table cargos (
    id_cargo INT AUTO_INCREMENT PRIMARY KEY,
    cargo VARCHAR (100) NOT NULL,
    salario DECIMAL (10,2) NOT NULL,
    margen_utilidad DECIMAL (5,2) NOT NULL,
    precio_iva_esc DECIMAL (10,2),
    precio_iva_cli DECIMAL (10,2),
    precio_iva_cap DECIMAL (10,2)
);

CREATE TABLE configuracion (
    id_config INT AUTO_INCREMENT PRIMARY KEY,
    horas_laborales INT NOT NULL,
    costo_manufactura DECIMAL(10, 2) NOT NULL
);

USUARIO: coti_ibs
PASS: azc12_CA16