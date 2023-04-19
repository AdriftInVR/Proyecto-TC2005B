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
    fechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(idTicket, idEstatus, fechaCambio),
    FOREIGN KEY (idTicket) REFERENCES TICKET(idTicket),
    FOREIGN KEY (idEstatus) REFERENCES ESTATUS(idEstatus)
);

CREATE TABLE PROYECTO(
    idTicket VARCHAR(25),
    fechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    duracion INT DEFAULT 0,
    PRIMARY KEY(idTicket),
    FOREIGN KEY (idTicket) REFERENCES TICKET(idTicket)
);

CREATE TABLE EPIC(
    idTicket VARCHAR(25),
    perteneProyecto VARCHAR(25) DEFAULT '1',
    asignacionProEpi TIMESTAMP,
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
    asignacionEpiTar TIMESTAMP,
    fechaFin DATE ,
    puntosAgiles FLOAT DEFAULT 0.0,
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
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(idUsuario, idTarea, fechaAsignacion),
    FOREIGN KEY(idUsuario) REFERENCES USUARIO(idUsuario),
    FOREIGN KEY(idTarea) REFERENCES TAREA(idTicket)
);

CREATE TABLE TRABAJA(
    idProyecto VARCHAR(25),
    idUsuario VARCHAR(25),
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    efectividadAsignada INT,
    PRIMARY KEY(idProyecto, idUsuario, fechaAsignacion),
    FOREIGN KEY(idProyecto) REFERENCES PROYECTO(idTicket),
    FOREIGN KEY(idUsuario) REFERENCES USUARIO(idUsuario)
);

CREATE TABLE ESTADO_LABORAL(
    idUsuario VARCHAR(25),
    idEstatus INT,
    fechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(idUsuario, idEstatus, fechaCambio),
    FOREIGN KEY(idUsuario) REFERENCES USUARIO(idUsuario),
    FOREIGN KEY (idEstatus) REFERENCES ESTATUS(idEstatus)
);


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
(00000000008, 'User Active'),
(00000000009, 'User inactive');

