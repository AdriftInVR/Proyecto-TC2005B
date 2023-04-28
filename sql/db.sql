DROP DATABASE IF EXISTS gaia;
CREATE DATABASE gaia;
USE gaia;

CREATE TABLE ticket(
    idTicket VARCHAR(25),
    nombre VARCHAR(200),
    PRIMARY KEY(idTicket)
);

CREATE TABLE estatus(
    idEstatus INT,
    descripcion VARCHAR(80),
    PRIMARY KEY(idEstatus)
);

CREATE TABLE fase(
    idTicket VARCHAR(25),
    idEstatus INT,
    fechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(idTicket, idEstatus, fechaCambio),
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY (idEstatus) REFERENCES estatus(idEstatus)
);

CREATE TABLE proyecto(
    idTicket VARCHAR(25),
    fechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    duracion INT DEFAULT 0,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket)
);

CREATE TABLE epic(
    idTicket VARCHAR(25),
    perteneProyecto VARCHAR(25),
    asignacionProEpi TIMESTAMP,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY(perteneProyecto) REFERENCES proyecto(idTicket)
);

CREATE TABLE tipo(
    idTipo INT,
    descripcion VARCHAR(80),
    PRIMARY KEY(idTipo)
);

CREATE TABLE tarea(
    idTicket VARCHAR(25),
    perteneceEpic VARCHAR(25),
    asignacionEpiTar TIMESTAMP,
    fechaFin DATE ,
    puntosAgiles FLOAT DEFAULT 0.0,
    esTipo INT,
    front_back INT,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY(perteneceEpic) REFERENCES epic(idTicket),
    FOREIGN KEY(esTipo) REFERENCES tipo(idTipo)
);

CREATE TABLE usuario(
    idUsuario VARCHAR(25),
    nombre VARCHAR(80),
    PRIMARY KEY(idUsuario)
);

CREATE TABLE responsable(
    idUsuario VARCHAR(25),
    idTarea VARCHAR(25),
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(idUsuario, idTarea, fechaAsignacion),
    FOREIGN KEY(idUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY(idTarea) REFERENCES tarea(idTicket)
);

CREATE TABLE trabaja(
    idProyecto VARCHAR(25),
    idUsuario VARCHAR(25),
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    efectividadAsignada INT,
    PRIMARY KEY(idProyecto, idUsuario, fechaAsignacion),
    FOREIGN KEY(idProyecto) REFERENCES proyecto(idTicket),
    FOREIGN KEY(idUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE estado_laboral(
    idUsuario VARCHAR(25),
    idEstatus INT,
    fechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(idUsuario, idEstatus, fechaCambio),
    FOREIGN KEY(idUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idEstatus) REFERENCES estatus(idEstatus)
);


-- tipo
INSERT INTO `tipo` (`idTipo`, `descripcion`) VALUES
(00000000001, 'Task'),
(00000000002, 'Story'),
(00000000003, 'Bug');

-- _______________________________________________________________________

-- estatus
INSERT INTO `estatus` (`idEstatus`, `descripcion`) VALUES
(00000000001, 'To Do'),
(00000000002, 'In Progress'),
(00000000003, 'Code Review'),
(00000000004, 'Quality Review'),
(00000000005, 'Release Ready'),
(00000000006, 'Done'),
(00000000007, 'Closed'),
(00000000008, 'User Active'),
(00000000009, 'User inactive');

