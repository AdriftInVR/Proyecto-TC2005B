DROP DATABASE IF EXISTS GAIA;
CREATE DATABASE GAIA;
USE GAIA;

CREATE TABLE TICKET(
    idTicket VARCHAR(25),
    nombre VARCHAR(200),
    PRIMARY KEY(idTicket)
);

CREATE TABLE ESTATUS(
    idEstatus INT,
    descripcion VARCHAR(80),
    PRIMARY KEY(idEstatus)
);

CREATE TABLE FASE(
    idTicket VARCHAR(25),
    idEstatus INT,
    fechaCambio TIMESTAMP,
    PRIMARY KEY(idTicket, idEstatus, fechaCambio),
    FOREIGN KEY (idTicket) REFERENCES TICKET(idTicket),
    FOREIGN KEY (idEstatus) REFERENCES ESTATUS(idEstatus)
);

CREATE TABLE PROYECTO(
    idTicket VARCHAR(25),
    fechaInicio DATE,
    duracion INT,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES TICKET(idTicket)
);

CREATE TABLE EPIC(
    idTicket VARCHAR(25),
    perteneProyecto VARCHAR(25),
    asignacionProEpi DATE,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES TICKET(idTicket),
    FOREIGN KEY(perteneProyecto) REFERENCES PROYECTO(idTicket)
);

CREATE TABLE TIPO(
    idTipo INT,
    descripcion VARCHAR(80),
    PRIMARY KEY(idTipo)
);

CREATE TABLE TAREA(
    idTicket VARCHAR(25),
    perteneceEpic VARCHAR(25),
    asignacionEpiTar DATE,
    fechaFin DATE,
    puntosAgiles INT,
    esTipo INT,
    front_back INT,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES TICKET(idTicket),
    FOREIGN KEY(perteneceEpic) REFERENCES EPIC(idTicket),
    FOREIGN KEY(esTipo) REFERENCES TIPO(idTipo)
);

CREATE TABLE USUARIO(
    idUsuario VARCHAR(25),
    nombre VARCHAR(80),
    PRIMARY KEY(idUsuario)
);

CREATE TABLE RESPONSABLE(
    idUsuario VARCHAR(25),
    idTarea VARCHAR(25),
    fechaAsignacion TIMESTAMP,
    PRIMARY KEY(idUsuario, idTarea, fechaAsignacion),
    FOREIGN KEY(idUsuario) REFERENCES USUARIO(idUsuario),
    FOREIGN KEY(idTarea) REFERENCES TAREA(idTicket)
);

CREATE TABLE TRABAJA(
    idProyecto VARCHAR(25),
    idUsuario VARCHAR(25),
    fechaAsignacion TIMESTAMP,
    efectividadAsignada INT,
    PRIMARY KEY(idProyecto, idUsuario, fechaAsignacion),
    FOREIGN KEY(idProyecto) REFERENCES PROYECTO(idTicket),
    FOREIGN KEY(idUsuario) REFERENCES USUARIO(idUsuario)
);

CREATE TABLE ESTADO_LABORAL(
    idUsuario VARCHAR(25),
    idEstatus INT,
    fechaCambio TIMESTAMP,
    PRIMARY KEY(idUsuario, idEstatus, fechaCambio),
    FOREIGN KEY(idUsuario) REFERENCES USUARIO(idUsuario),
    FOREIGN KEY (idEstatus) REFERENCES ESTATUS(idEstatus)
);

INSERT INTO `TICKET` (`idTicket`, `nombre`) VALUES
(00000000001, 'Software para restaurante'),
(00000000002, 'Base de dato para escuela'),
(00000000003, 'Aplicacion android'),
(00000000004, 'Software para meseros'),
(00000000005, 'Software para gerente'),
(00000000006, 'Tabla de alumnos'),
(00000000007, 'Sistema de maestros'),
(00000000008, 'Conexion con google playstore'),
(00000000009, 'Tarea1_restaurante'),
(00000000010, 'Tarea2_restaurante'),
(00000000011, 'Tarea3_restaurante'),
(00000000012, 'Tarea1_escuela'),
(00000000013, 'Tarea2_escuela'),
(00000000014, 'Tarea1_aplicacion'),
(00000000015, 'Tarea2_aplicacion'),
(00000000016, 'Tarea3_aplicacion');


-- _______________________________________________________________________

-- Tipo
INSERT INTO `TIPO` (`idTipo`, `descripcion`) VALUES
(00000000001, 'Task'),
(00000000002, 'Story'),
(00000000003, 'Bug');

-- _______________________________________________________________________

-- Estatus
INSERT INTO `ESTATUS` (`idEstatus`, `descripcion`) VALUES
(00000000001, 'To Do'),
(00000000002, 'In Progress'),
(00000000003, 'Code Review'),
(00000000004, 'Quality Review'),
(00000000005, 'Release Ready'),
(00000000006, 'Done'),
(00000000007, 'Closed'),
(00000000008, 'UsuarioActivo'),
(00000000009, 'UsuarioInactivo');


-- _______________________________________________________________________

-- Fase

INSERT INTO `FASE` (`idTicket`, `idEstatus`, `fechaCambio`) VALUES
(00000000001, 00000000003, '2023-01-02'),
(00000000002, 00000000003, '2022-09-23'),
(00000000003, 00000000003, '2023-03-20'),
(00000000004, 00000000003, '2023-01-03'),
(00000000005, 00000000003, '2023-02-01'),
(00000000006, 00000000007, '2022-09-24'),
(00000000007, 00000000007, '2022-10-01'),
(00000000008, 00000000006, '2023-03-22'),
(00000000009, 00000000006, '2023-02-05'),
(00000000010, 00000000003, '2023-03-01'),
(00000000011, 00000000004, '2023-02-10'),
(00000000012, 00000000004, '2022-10-10'),
(00000000013, 00000000002, '2022-11-01'),
(00000000014, 00000000005, '2023-04-01'),
(00000000015, 00000000005, '2023-04-10'),
(00000000016, 00000000007, '2023-05-01');

-- _______________________________________________________________________


-- Proyectos
INSERT INTO `PROYECTO` (`idTicket`, `fechaInicio`, `duracion`) VALUES
(00000000001, '2023-01-01', 300),
(00000000002, '2022-09-21', 350),
(00000000003, '2023-03-15', 400);

-- _______________________________________________________________________

-- Epics
INSERT INTO `EPIC` (`idTicket`, `perteneProyecto`, `asignacionProEpi`) VALUES
(00000000004, 00000000001, '2023-01-03'),
(00000000005, 00000000001, '2023-02-01'),
(00000000006, 00000000002, '2022-09-24'),
(00000000007, 00000000002, '2022-10-01'),
(00000000008, 00000000003, '2023-03-22');

-- _______________________________________________________________________

-- Tarea
INSERT INTO `TAREA` (
    `idTicket`, `perteneceEpic`, `asignacionEpiTar`,`fechaFin`,
    `puntosAgiles`, `esTipo`,`front_back`) VALUES

(00000000009, 00000000004, '2023-01-05' ,NULL ,2 , 00000000001, 0),
(00000000010, 00000000004, '2023-02-01' ,NULL ,1 , 00000000001, 0),
(00000000011, 00000000005, '2022-09-26' ,NULL ,3 , 00000000002, 0),
(00000000012, 00000000006, '2022-10-02' ,NULL ,2 , 00000000001, 1),
(00000000013, 00000000007, '2022-10-20' ,NULL ,1 , 00000000002, 1),
(00000000014, 00000000008, '2023-03-24' ,NULL ,1 , 00000000003, 0),
(00000000015, 00000000008, '2023-04-01' ,NULL ,4 , 00000000001, 1),
(00000000016, 00000000008, '2023-04-05' ,NULL ,4 , 00000000002, 0);

-- _______________________________________________________________________

-- Usuario

INSERT INTO `USUARIO` VALUES

(00000000001, 'Alfonso'),
(00000000002, 'Valentina'),
(00000000003, 'Ricardo'),
(00000000004, 'Renee'),
(00000000005, 'Luis'),
(00000000006, 'Sofia');
 
INSERT INTO `ESTADO_LABORAL` (`idUsuario`, `idEstatus`, `fechaCambio`) VALUES
(00000000001, 00000000008, '2022-07-21'),
(00000000002, 00000000008, '2022-01-20'),
(00000000003, 00000000008, '2022-06-1'),
(00000000004, 00000000008, '2021-04-30'),
(00000000005, 00000000008, '2022-02-20'),
(00000000006, 00000000008, '2022-01-30');

-- _______________________________________________________________________

-- Trabaja
INSERT INTO `TRABAJA` (`idProyecto`, `idUsuario`, `fechaAsignacion`, `efectividadAsignada`) VALUES
(00000000001, 00000000001, '2023-01-01', 2),
(00000000001, 00000000002, '2023-01-01', 2),
(00000000001, 00000000004, '2023-01-01', 2),
(00000000002, 00000000005, '2022-09-21', 4),
(00000000003, 00000000005, '2023-03-15', 4),
(00000000003, 00000000001, '2023-03-15', 2),
(00000000002, 00000000003, '2022-09-21', 4),
(00000000003, 00000000002, '2023-03-15', 3);

-- _______________________________________________________________________

-- Responsable
INSERT INTO `RESPONSABLE` (`idUsuario`, `idTarea`, `fechaAsignacion`) VALUES

(00000000001, 00000000009, '2023-01-05'),
(00000000002, 00000000010, '2023-02-01'),
(00000000004, 00000000011, '2022-09-26'),
(00000000005, 00000000012, '2022-10-02'),
(00000000003, 00000000013, '2022-10-20'),
(00000000001, 00000000014, '2023-03-24'),
(00000000005, 00000000015, '2023-04-01'),
(00000000002, 00000000016, '2023-04-05');

