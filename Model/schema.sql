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
    margen_utilidad DECIMAL (5,2) NOT NULL
);

CREATE TABLE configuracion (
    id_config INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    horas_laborales INT NOT NULL,
    costo_manufactura DECIMAL(10, 2) NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);