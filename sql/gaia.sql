-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2023 at 06:11 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gaia`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `deactivateUser` (IN `target` VARCHAR(80))   BEGIN
SET @user = target;
SET @uID = (SELECT idUsuario 
            FROM usuario 
            WHERE nombre = @user);
UPDATE estado_laboral SET idEstatus = 9, fechaCambio = CURRENT_TIMESTAMP()
WHERE idUsuario = @uID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getEstimate` (IN `target` VARCHAR(25))   BEGIN
SET @PT = target;
SET @AP = (SELECT SUM(T.puntosAgiles)
           FROM tarea T, epic E, proyecto P
           WHERE T.perteneceEpic = E.idTicket
           AND E.perteneProyecto = P.idTicket
           AND P.idTicket = @PT);
SET @WEEKLY = (SELECT SUM(W.efectividadAsignada) 
               FROM trabaja W, proyecto P
               WHERE P.idTicket = W.idProyecto
               AND P.idTicket = @PT);
SELECT CEIL(@AP/@WEEKLY) as 'Estimate', P.fechaInicio as 'Inicio'
FROM proyecto P
WHERE P.idTicket = @PT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `epic`
--

CREATE TABLE `epic` (
  `idTicket` varchar(25) NOT NULL,
  `perteneProyecto` varchar(25) DEFAULT '1',
  `asignacionProEpi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `epic`
--

INSERT INTO `epic` (`idTicket`, `perteneProyecto`, `asignacionProEpi`) VALUES
('4', '1', '2023-01-03 06:00:00'),
('5', '1', '2023-02-01 06:00:00'),
('6', '2', '2022-09-24 06:00:00'),
('7', '2', '2022-10-01 06:00:00'),
('8', '3', '2023-03-22 06:00:00'),
('PART-234', '1', '2023-04-28 16:50:59'),
('PART-2394', '1', '2023-04-28 16:50:59');

-- --------------------------------------------------------

--
-- Table structure for table `estado_laboral`
--

CREATE TABLE `estado_laboral` (
  `idUsuario` varchar(25) NOT NULL,
  `idEstatus` int(11) NOT NULL,
  `fechaCambio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estado_laboral`
--

INSERT INTO `estado_laboral` (`idUsuario`, `idEstatus`, `fechaCambio`) VALUES
('1', 9, '2023-05-04 16:10:55'),
('2', 8, '2022-01-20 06:00:00'),
('3', 8, '2022-06-01 06:00:00'),
('4', 8, '2021-04-30 06:00:00'),
('5', 8, '2022-02-20 06:00:00'),
('6', 8, '2022-01-30 06:00:00'),
('607f2fef739dd40069a4b2a3', 8, '2023-04-28 16:50:59'),
('61a3edabb0b630006afda9e4', 8, '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', 8, '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', 8, '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', 8, '2023-04-28 16:50:59'),
('62cdf020afe495359d9d9b0b', 8, '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', 8, '2023-04-28 16:50:59');

-- --------------------------------------------------------

--
-- Table structure for table `estatus`
--

CREATE TABLE `estatus` (
  `idEstatus` int(11) NOT NULL,
  `descripcion` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estatus`
--

INSERT INTO `estatus` (`idEstatus`, `descripcion`) VALUES
(1, 'To Do'),
(2, 'In Progress'),
(3, 'Code Review'),
(4, 'Quality Review'),
(5, 'Release Ready'),
(6, 'Done'),
(7, 'Closed'),
(8, 'UsuarioActivo'),
(9, 'UsuarioInactivo');

-- --------------------------------------------------------

--
-- Table structure for table `fase`
--

CREATE TABLE `fase` (
  `idTicket` varchar(25) NOT NULL,
  `idEstatus` int(11) NOT NULL,
  `fechaCambio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fase`
--

INSERT INTO `fase` (`idTicket`, `idEstatus`, `fechaCambio`) VALUES
('1', 3, '2023-01-02 06:00:00'),
('10', 3, '2023-03-01 06:00:00'),
('11', 4, '2023-02-10 06:00:00'),
('12', 4, '2022-10-10 06:00:00'),
('13', 2, '2022-11-01 06:00:00'),
('14', 5, '2023-04-01 06:00:00'),
('15', 5, '2023-04-10 06:00:00'),
('16', 7, '2023-05-01 06:00:00'),
('2', 3, '2022-09-23 06:00:00'),
('20754', 1, '2022-05-23 07:39:00'),
('20755', 1, '2022-07-19 08:12:00'),
('20763', 1, '2022-07-18 18:29:00'),
('20774', 1, '2022-07-12 16:51:00'),
('20774', 3, '2022-07-12 16:51:00'),
('20783', 1, '2022-10-20 15:38:00'),
('20789', 1, '2023-01-30 08:35:00'),
('20790', 1, '2022-11-18 16:13:00'),
('20806', 1, '2023-02-23 17:19:00'),
('20806', 6, '2023-02-23 17:19:00'),
('20807', 1, '2023-02-24 18:33:00'),
('20807', 6, '2023-02-24 18:33:00'),
('20808', 1, '2022-08-23 10:54:00'),
('20808', 6, '2022-08-23 10:54:00'),
('20822', 1, '2023-02-10 18:10:00'),
('20822', 6, '2023-02-10 18:10:00'),
('20823', 1, '2023-02-13 16:16:00'),
('20856', 1, '2023-02-14 07:02:00'),
('20985', 1, '2023-01-23 17:48:00'),
('20986', 1, '2023-01-24 07:24:00'),
('20987', 1, '2023-01-25 11:13:00'),
('20988', 1, '2023-01-27 07:14:00'),
('20989', 1, '2023-01-31 17:38:00'),
('20989', 6, '2023-01-31 17:38:00'),
('20991', 1, '2023-02-01 09:31:00'),
('20992', 1, '2023-02-02 08:08:00'),
('20993', 1, '2023-02-02 08:11:00'),
('20994', 1, '2023-02-02 08:12:00'),
('20995', 1, '2023-02-08 16:14:00'),
('20996', 1, '2023-02-09 18:26:00'),
('20997', 1, '2023-02-13 16:18:00'),
('20998', 1, '2023-02-13 16:18:00'),
('20999', 1, '2023-02-13 16:19:00'),
('21001', 1, '2023-02-13 17:36:00'),
('21002', 1, '2023-02-13 11:01:00'),
('21002', 6, '2023-02-13 11:01:00'),
('21003', 1, '2023-02-13 11:25:00'),
('21004', 1, '2023-02-13 11:26:00'),
('21005', 1, '2023-02-14 11:23:00'),
('21006', 1, '2023-02-15 08:51:00'),
('21007', 1, '2023-02-22 07:57:00'),
('21038', 1, '2022-05-26 07:58:00'),
('21039', 1, '2022-05-26 08:01:00'),
('21047', 1, '2022-07-01 16:42:00'),
('21049', 1, '2021-12-08 09:31:00'),
('21081', 1, '2022-11-06 09:49:00'),
('21082', 1, '2022-11-07 10:03:00'),
('21083', 1, '2022-11-14 10:21:00'),
('21085', 1, '2022-11-25 07:04:00'),
('21087', 1, '2022-12-14 18:29:00'),
('21088', 1, '2022-12-14 18:29:00'),
('21093', 1, '2023-01-06 09:07:00'),
('21094', 1, '2023-01-06 09:09:00'),
('21095', 1, '2023-01-06 09:10:00'),
('21096', 1, '2023-01-06 09:11:00'),
('21098', 1, '2023-01-09 08:55:00'),
('21099', 1, '2023-01-09 08:58:00'),
('21100', 1, '2023-01-09 09:01:00'),
('21101', 1, '2023-01-12 17:42:00'),
('21101', 6, '2023-01-12 17:42:00'),
('21103', 1, '2023-01-19 18:20:00'),
('21104', 1, '2023-01-19 18:22:00'),
('21105', 1, '2023-01-19 18:22:00'),
('21106', 1, '2023-01-19 18:23:00'),
('21107', 1, '2023-01-19 18:24:00'),
('21108', 1, '2023-01-19 18:26:00'),
('21109', 1, '2023-01-19 18:27:00'),
('22197', 1, '2023-02-28 18:05:00'),
('22197', 6, '2023-02-28 18:05:00'),
('22255', 1, '2023-02-28 09:55:00'),
('22255', 6, '2023-02-28 09:55:00'),
('23124', 1, '2023-03-06 17:59:00'),
('23233', 1, '2023-03-07 13:53:00'),
('23365', 1, '2023-03-07 07:59:00'),
('23365', 6, '2023-03-07 07:59:00'),
('23369', 1, '2023-03-07 08:07:00'),
('23441', 1, '2023-03-07 13:55:00'),
('23496', 1, '2023-03-08 15:51:00'),
('23678', 1, '2023-03-08 09:00:00'),
('23698', 1, '2023-03-08 10:10:00'),
('23809', 1, '2023-03-09 18:28:00'),
('24050', 1, '2023-03-10 08:41:00'),
('24050', 3, '2023-03-10 08:41:00'),
('24087', 1, '2023-03-10 10:49:00'),
('24087', 6, '2023-03-10 10:49:00'),
('24354', 1, '2023-03-13 18:17:00'),
('24358', 1, '2023-03-13 18:20:00'),
('24413', 1, '2023-03-13 09:20:00'),
('24441', 1, '2023-03-13 15:04:00'),
('24442', 1, '2023-03-13 15:05:00'),
('24808', 1, '2023-03-13 17:40:00'),
('24809', 1, '2023-03-13 17:40:00'),
('24810', 1, '2023-03-13 17:41:00'),
('24811', 1, '2023-03-13 17:41:00'),
('24812', 1, '2023-03-13 17:41:00'),
('24813', 1, '2023-03-13 17:41:00'),
('24814', 1, '2023-03-13 17:41:00'),
('24815', 1, '2023-03-13 17:42:00'),
('24816', 1, '2023-03-13 17:42:00'),
('24817', 1, '2023-03-13 17:42:00'),
('24818', 1, '2023-03-13 17:42:00'),
('24819', 1, '2023-03-13 17:42:00'),
('24820', 1, '2023-03-13 17:42:00'),
('24821', 1, '2023-03-13 17:43:00'),
('24822', 1, '2023-03-13 17:43:00'),
('24823', 1, '2023-03-13 17:43:00'),
('24824', 1, '2023-03-13 17:45:00'),
('24825', 1, '2023-03-13 17:45:00'),
('24826', 1, '2023-03-13 17:45:00'),
('24827', 1, '2023-03-13 17:46:00'),
('24828', 1, '2023-03-13 17:46:00'),
('24829', 1, '2023-03-13 17:46:00'),
('24830', 1, '2023-03-13 17:46:00'),
('24831', 1, '2023-03-13 17:47:00'),
('24831', 3, '2023-03-13 17:47:00'),
('24832', 1, '2023-03-13 17:47:00'),
('24833', 1, '2023-03-13 17:47:00'),
('24833', 3, '2023-03-13 17:47:00'),
('24834', 1, '2023-03-13 17:47:00'),
('24834', 3, '2023-03-13 17:47:00'),
('24835', 1, '2023-03-13 17:48:00'),
('24836', 1, '2023-03-13 17:48:00'),
('24837', 1, '2023-03-13 17:48:00'),
('24838', 1, '2023-03-13 17:48:00'),
('24839', 1, '2023-03-13 17:49:00'),
('24840', 1, '2023-03-13 17:49:00'),
('24840', 6, '2023-03-13 17:49:00'),
('25430', 1, '2023-03-16 07:52:00'),
('25430', 6, '2023-03-16 07:52:00'),
('25436', 1, '2023-03-16 08:04:00'),
('25440', 1, '2023-03-16 08:28:00'),
('25460', 1, '2023-03-16 09:54:00'),
('25460', 3, '2023-03-16 09:54:00'),
('25829', 1, '2023-03-20 17:02:00'),
('25829', 2, '2023-03-20 17:02:00'),
('26070', 1, '2023-03-21 17:35:00'),
('26267', 1, '2023-03-22 17:11:00'),
('26267', 2, '2023-03-22 17:11:00'),
('26268', 1, '2023-03-22 17:12:00'),
('26271', 1, '2023-03-22 17:15:00'),
('26271', 6, '2023-03-22 17:15:00'),
('26276', 1, '2023-03-22 17:25:00'),
('26277', 1, '2023-03-22 17:26:00'),
('26277', 6, '2023-03-22 17:26:00'),
('26278', 1, '2023-03-22 17:27:00'),
('26279', 1, '2023-03-22 17:27:00'),
('26279', 2, '2023-03-22 17:27:00'),
('26280', 1, '2023-03-22 17:28:00'),
('26281', 1, '2023-03-22 17:28:00'),
('26282', 1, '2023-03-22 17:29:00'),
('26283', 1, '2023-03-22 17:30:00'),
('26284', 1, '2023-03-22 17:31:00'),
('26285', 1, '2023-03-22 17:31:00'),
('26327', 1, '2023-03-22 07:48:00'),
('26328', 1, '2023-03-22 07:49:00'),
('26577', 1, '2023-03-23 08:58:00'),
('26701', 1, '2023-03-24 15:38:00'),
('26706', 1, '2023-03-24 15:53:00'),
('26775', 1, '2023-03-24 07:37:00'),
('27064', 1, '2023-03-27 16:07:00'),
('27599', 1, '2023-03-29 17:02:00'),
('27599', 6, '2023-03-29 17:02:00'),
('27611', 1, '2023-03-29 17:08:00'),
('27730', 1, '2023-03-29 10:34:00'),
('28048', 1, '2023-03-31 17:19:00'),
('28049', 1, '2023-03-31 17:21:00'),
('28050', 1, '2023-03-31 17:21:00'),
('28051', 1, '2023-03-31 17:22:00'),
('28052', 1, '2023-03-31 17:24:00'),
('28053', 1, '2023-03-31 17:25:00'),
('28053', 6, '2023-03-31 17:25:00'),
('28054', 1, '2023-03-31 17:27:00'),
('28056', 1, '2023-03-31 17:27:00'),
('28057', 1, '2023-03-31 17:28:00'),
('28058', 1, '2023-03-31 17:29:00'),
('28060', 1, '2023-03-31 17:30:00'),
('28061', 1, '2023-03-31 17:31:00'),
('28063', 1, '2023-03-31 17:31:00'),
('28797', 1, '2023-04-05 18:03:00'),
('28799', 1, '2023-04-05 18:07:00'),
('28802', 1, '2023-04-05 18:15:00'),
('28806', 1, '2023-04-05 18:32:00'),
('28806', 2, '2023-04-05 18:32:00'),
('28993', 1, '2023-04-06 16:52:00'),
('29725', 1, '2023-04-11 17:45:00'),
('29725', 2, '2023-04-11 17:45:00'),
('3', 3, '2023-03-20 06:00:00'),
('30337', 1, '2023-04-14 17:11:00'),
('30868', 1, '2023-04-18 07:13:00'),
('30869', 1, '2023-04-18 07:14:00'),
('30870', 1, '2023-04-18 07:15:00'),
('31003', 1, '2023-04-19 16:18:00'),
('31050', 1, '2023-04-19 17:51:00'),
('31228', 1, '2023-04-20 16:56:00'),
('31228', 3, '2023-04-20 16:56:00'),
('31229', 1, '2023-04-20 16:57:00'),
('4', 3, '2023-01-03 06:00:00'),
('5', 3, '2023-02-01 06:00:00'),
('6', 7, '2022-09-24 06:00:00'),
('7', 7, '2022-10-01 06:00:00'),
('8', 6, '2023-03-22 06:00:00'),
('9', 6, '2023-02-05 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `proyecto`
--

CREATE TABLE `proyecto` (
  `idTicket` varchar(25) NOT NULL,
  `fechaInicio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `duracion` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proyecto`
--

INSERT INTO `proyecto` (`idTicket`, `fechaInicio`, `duracion`) VALUES
('1', '2023-01-01 06:00:00', 0),
('2', '2022-09-21 06:00:00', 0),
('3', '2023-03-15 06:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `responsable`
--

CREATE TABLE `responsable` (
  `idUsuario` varchar(25) NOT NULL,
  `idTarea` varchar(25) NOT NULL,
  `fechaAsignacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responsable`
--

INSERT INTO `responsable` (`idUsuario`, `idTarea`, `fechaAsignacion`) VALUES
('1', '14', '2023-03-24 06:00:00'),
('1', '9', '2023-01-05 06:00:00'),
('2', '10', '2023-02-01 06:00:00'),
('2', '16', '2023-04-05 06:00:00'),
('3', '13', '2022-10-20 06:00:00'),
('4', '11', '2022-09-26 06:00:00'),
('5', '12', '2022-10-02 06:00:00'),
('5', '15', '2023-04-01 06:00:00'),
('607f2fef739dd40069a4b2a3', '20808', '2023-04-28 16:50:59'),
('607f2fef739dd40069a4b2a3', '22197', '2023-04-28 16:50:59'),
('607f2fef739dd40069a4b2a3', '22255', '2023-04-28 16:50:59'),
('607f2fef739dd40069a4b2a3', '25430', '2023-04-28 16:50:59'),
('61a3edabb0b630006afda9e4', '27064', '2023-04-28 16:50:59'),
('61a3edabb0b630006afda9e4', '28053', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '20790', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '20822', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '20992', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '20999', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '21038', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '23678', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '25460', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '26278', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '26279', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '28048', '2023-04-28 16:50:59'),
('61c9eb457c6f980070deda99', '28993', '2023-04-28 16:51:00'),
('61c9eb457c6f980070deda99', '31003', '2023-04-28 16:51:00'),
('61f81bb630f6b8006aa75942', '20783', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '20991', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '20997', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '23369', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '23441', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '24831', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '24833', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '24834', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '24836', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '24837', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '28049', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '28051', '2023-04-28 16:50:59'),
('61f81bb630f6b8006aa75942', '30868', '2023-04-28 16:51:00'),
('61f81bb630f6b8006aa75942', '30869', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '20754', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '20763', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '20774', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '20789', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '20823', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '20998', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '21003', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '21004', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '21005', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '21049', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '24050', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '24835', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '25436', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '26281', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '28050', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '28052', '2023-04-28 16:50:59'),
('62cdef6c6eba71983721e037', '28057', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '28058', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '28061', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '28063', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '28797', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '29725', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '31050', '2023-04-28 16:51:00'),
('62cdef6c6eba71983721e037', '31229', '2023-04-28 16:51:00'),
('62cdf020afe495359d9d9b0b', '24839', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '20806', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '20807', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '20988', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '20989', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '20993', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '20996', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '21001', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '21002', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '21098', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '21101', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '23124', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '23233', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '23365', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '24087', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '24413', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '25829', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26070', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26267', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26268', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26271', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26276', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26277', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '26701', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '27599', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '28054', '2023-04-28 16:50:59'),
('62cdf0d01e326fd93012992d', '28056', '2023-04-28 16:51:00'),
('62cdf0d01e326fd93012992d', '28060', '2023-04-28 16:51:00'),
('62cdf0d01e326fd93012992d', '28806', '2023-04-28 16:51:00'),
('62cdf0d01e326fd93012992d', '30337', '2023-04-28 16:51:00'),
('62cdf0d01e326fd93012992d', '30870', '2023-04-28 16:51:00'),
('62cdf0d01e326fd93012992d', '31228', '2023-04-28 16:51:00');

-- --------------------------------------------------------

--
-- Table structure for table `tarea`
--

CREATE TABLE `tarea` (
  `idTicket` varchar(25) NOT NULL,
  `perteneceEpic` varchar(25) DEFAULT NULL,
  `asignacionEpiTar` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fechaFin` date DEFAULT NULL,
  `puntosAgiles` float DEFAULT 0,
  `esTipo` int(11) DEFAULT NULL,
  `front_back` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tarea`
--

INSERT INTO `tarea` (`idTicket`, `perteneceEpic`, `asignacionEpiTar`, `fechaFin`, `puntosAgiles`, `esTipo`, `front_back`) VALUES
('10', '4', '2023-02-01 06:00:00', NULL, 1, 1, 0),
('11', '5', '2022-09-26 06:00:00', NULL, 3, 2, 0),
('12', '6', '2022-10-02 06:00:00', NULL, 2, 1, 1),
('13', '7', '2022-10-20 06:00:00', NULL, 1, 2, 1),
('14', '8', '2023-03-24 06:00:00', NULL, 1, 3, 0),
('15', '8', '2023-04-01 06:00:00', NULL, 4, 1, 1),
('16', '8', '2023-04-05 06:00:00', NULL, 4, 2, 0),
('20754', 'PART-234', '2022-05-23 07:39:00', NULL, 2, 1, 1),
('20755', 'PART-234', '2022-07-19 08:12:00', NULL, 0, 1, 1),
('20763', 'PART-234', '2022-07-18 18:29:00', NULL, 2, 2, 1),
('20774', 'PART-234', '2022-07-12 16:51:00', NULL, 2, 1, 1),
('20783', 'PART-234', '2022-10-20 15:38:00', NULL, 2, 1, 1),
('20789', 'PART-234', '2023-01-30 08:35:00', NULL, 3, 1, 1),
('20790', 'PART-234', '2022-11-18 16:13:00', NULL, 1, 1, 1),
('20806', 'PART-234', '2023-02-23 17:19:00', NULL, 0, 1, 1),
('20807', 'PART-234', '2023-02-24 18:33:00', NULL, 3, 1, 1),
('20808', 'PART-234', '2022-08-23 10:54:00', NULL, 0, 1, 1),
('20822', 'PART-234', '2023-02-10 18:10:00', NULL, 0, 1, 1),
('20823', 'PART-234', '2023-02-13 16:16:00', NULL, 2, 1, 1),
('20856', 'PART-234', '2023-02-14 07:02:00', NULL, 1, 3, 1),
('20985', 'PART-234', '2023-01-23 17:48:00', NULL, 0, 1, 1),
('20986', 'PART-234', '2023-01-24 07:24:00', NULL, 0, 1, 1),
('20987', 'PART-234', '2023-01-25 11:13:00', NULL, 0, 1, 1),
('20988', 'PART-234', '2023-01-27 07:14:00', NULL, 0, 1, 1),
('20989', 'PART-234', '2023-01-31 17:38:00', NULL, 0, 1, 1),
('20991', 'PART-234', '2023-02-01 09:31:00', NULL, 1, 1, 1),
('20992', 'PART-234', '2023-02-02 08:08:00', NULL, 3, 1, 1),
('20993', 'PART-234', '2023-02-02 08:11:00', NULL, 0, 1, 1),
('20994', 'PART-234', '2023-02-02 08:12:00', NULL, 0, 1, 1),
('20995', 'PART-234', '2023-02-08 16:14:00', NULL, 0, 1, 1),
('20996', 'PART-234', '2023-02-09 18:26:00', NULL, 0, 1, 1),
('20997', 'PART-234', '2023-02-13 16:18:00', NULL, 1, 1, 1),
('20998', 'PART-234', '2023-02-13 16:18:00', NULL, 2, 1, 1),
('20999', 'PART-234', '2023-02-13 16:19:00', NULL, 0, 2, 1),
('21001', 'PART-234', '2023-02-13 17:36:00', NULL, 0.5, 1, 1),
('21002', 'PART-234', '2023-02-13 11:01:00', NULL, 0, 1, 1),
('21003', 'PART-234', '2023-02-13 11:25:00', NULL, 0, 1, 1),
('21004', 'PART-234', '2023-02-13 11:26:00', NULL, 0, 1, 1),
('21005', 'PART-234', '2023-02-14 11:23:00', NULL, 1, 1, 1),
('21006', 'PART-234', '2023-02-15 08:51:00', NULL, 0, 1, 1),
('21007', 'PART-234', '2023-02-22 07:57:00', NULL, 0, 1, 1),
('21038', 'PART-234', '2022-05-26 07:58:00', NULL, 0, 1, 1),
('21039', 'PART-234', '2022-05-26 08:01:00', NULL, 0, 1, 1),
('21047', 'PART-234', '2022-07-01 16:42:00', NULL, 0, 1, 1),
('21049', 'PART-234', '2021-12-08 09:31:00', NULL, 3, 1, 1),
('21081', 'PART-234', '2022-11-06 09:49:00', NULL, 2, 1, 1),
('21082', 'PART-234', '2022-11-07 10:03:00', NULL, 2, 1, 1),
('21083', 'PART-234', '2022-11-14 10:21:00', NULL, 3, 1, 1),
('21085', 'PART-234', '2022-11-25 07:04:00', NULL, 3, 1, 1),
('21087', 'PART-234', '2022-12-14 18:29:00', NULL, 1, 1, 1),
('21088', 'PART-234', '2022-12-14 18:29:00', NULL, 1, 1, 1),
('21093', 'PART-234', '2023-01-06 09:07:00', NULL, 0, 1, 1),
('21094', 'PART-234', '2023-01-06 09:09:00', NULL, 0, 1, 1),
('21095', 'PART-234', '2023-01-06 09:10:00', NULL, 0, 1, 1),
('21096', 'PART-234', '2023-01-06 09:11:00', NULL, 0, 1, 1),
('21098', 'PART-234', '2023-01-09 08:55:00', NULL, 0, 1, 1),
('21099', 'PART-234', '2023-01-09 08:58:00', NULL, 0, 1, 1),
('21100', 'PART-234', '2023-01-09 09:01:00', NULL, 0, 1, 1),
('21101', 'PART-234', '2023-01-12 17:42:00', NULL, 0, 1, 1),
('21103', 'PART-234', '2023-01-19 18:20:00', NULL, 0, 1, 1),
('21104', 'PART-234', '2023-01-19 18:22:00', NULL, 0, 1, 1),
('21105', 'PART-234', '2023-01-19 18:22:00', NULL, 0, 1, 1),
('21106', 'PART-234', '2023-01-19 18:23:00', NULL, 0, 1, 1),
('21107', 'PART-234', '2023-01-19 18:24:00', NULL, 0, 1, 1),
('21108', 'PART-234', '2023-01-19 18:26:00', NULL, 0, 1, 1),
('21109', 'PART-234', '2023-01-19 18:27:00', NULL, 0, 1, 1),
('22197', 'PART-234', '2023-02-28 18:05:00', NULL, 1, 2, 1),
('22255', 'PART-234', '2023-02-28 09:55:00', NULL, 1, 2, 1),
('23124', 'PART-234', '2023-03-06 17:59:00', NULL, 1, 1, 1),
('23233', 'PART-234', '2023-03-07 13:53:00', NULL, 0.5, 1, 1),
('23365', 'PART-234', '2023-03-07 07:59:00', NULL, 0, 1, 1),
('23369', 'PART-234', '2023-03-07 08:07:00', NULL, 0, 1, 1),
('23441', 'PART-234', '2023-03-07 13:55:00', NULL, 0, 1, 1),
('23496', 'PART-234', '2023-03-08 15:51:00', NULL, 0, 3, 1),
('23678', 'PART-234', '2023-03-08 09:00:00', NULL, 1, 1, 1),
('23698', 'PART-234', '2023-03-08 10:10:00', NULL, 0, 1, 1),
('23809', 'PART-234', '2023-03-09 18:28:00', NULL, 0, 1, 1),
('24050', 'PART-234', '2023-03-10 08:41:00', NULL, 2, 1, 1),
('24087', 'PART-234', '2023-03-10 10:49:00', NULL, 0, 1, 1),
('24354', 'PART-234', '2023-03-13 18:17:00', NULL, 0, 1, 1),
('24358', 'PART-234', '2023-03-13 18:20:00', NULL, 0, 1, 1),
('24413', 'PART-234', '2023-03-13 09:20:00', NULL, 2, 3, 1),
('24441', 'PART-234', '2023-03-13 15:04:00', NULL, 0, 1, 1),
('24442', 'PART-234', '2023-03-13 15:05:00', NULL, 0, 1, 1),
('24808', 'PART-234', '2023-03-13 17:40:00', NULL, 0, 1, 1),
('24809', 'PART-234', '2023-03-13 17:40:00', NULL, 0, 1, 1),
('24810', 'PART-234', '2023-03-13 17:41:00', NULL, 0, 1, 1),
('24811', 'PART-234', '2023-03-13 17:41:00', NULL, 0, 1, 1),
('24812', 'PART-234', '2023-03-13 17:41:00', NULL, 0, 1, 1),
('24813', 'PART-234', '2023-03-13 17:41:00', NULL, 0, 1, 1),
('24814', 'PART-234', '2023-03-13 17:41:00', NULL, 0, 1, 1),
('24815', 'PART-234', '2023-03-13 17:42:00', NULL, 0, 1, 1),
('24816', 'PART-234', '2023-03-13 17:42:00', NULL, 0, 1, 1),
('24817', 'PART-234', '2023-03-13 17:42:00', NULL, 0, 1, 1),
('24818', 'PART-234', '2023-03-13 17:42:00', NULL, 0, 1, 1),
('24819', 'PART-234', '2023-03-13 17:42:00', NULL, 0, 1, 1),
('24820', 'PART-234', '2023-03-13 17:42:00', NULL, 0, 1, 1),
('24821', 'PART-234', '2023-03-13 17:43:00', NULL, 0, 1, 1),
('24822', 'PART-234', '2023-03-13 17:43:00', NULL, 0, 1, 1),
('24823', 'PART-234', '2023-03-13 17:43:00', NULL, 0, 1, 1),
('24824', 'PART-234', '2023-03-13 17:45:00', NULL, 0, 1, 1),
('24825', 'PART-234', '2023-03-13 17:45:00', NULL, 0, 1, 1),
('24826', 'PART-234', '2023-03-13 17:45:00', NULL, 0, 1, 1),
('24827', 'PART-234', '2023-03-13 17:46:00', NULL, 0, 1, 1),
('24828', 'PART-234', '2023-03-13 17:46:00', NULL, 0, 1, 1),
('24829', 'PART-234', '2023-03-13 17:46:00', NULL, 0, 1, 1),
('24830', 'PART-234', '2023-03-13 17:46:00', NULL, 0, 1, 1),
('24831', 'PART-234', '2023-03-13 17:47:00', NULL, 1, 1, 1),
('24832', 'PART-234', '2023-03-13 17:47:00', NULL, 0, 1, 1),
('24833', 'PART-234', '2023-03-13 17:47:00', NULL, 1, 1, 1),
('24834', 'PART-234', '2023-03-13 17:47:00', NULL, 1, 1, 1),
('24835', 'PART-234', '2023-03-13 17:48:00', NULL, 1, 1, 1),
('24836', 'PART-234', '2023-03-13 17:48:00', NULL, 1, 1, 1),
('24837', 'PART-234', '2023-03-13 17:48:00', NULL, 1, 1, 1),
('24838', 'PART-234', '2023-03-13 17:48:00', NULL, 0, 1, 1),
('24839', 'PART-234', '2023-03-13 17:49:00', NULL, 1, 1, 1),
('24840', 'PART-234', '2023-03-13 17:49:00', NULL, 0, 1, 1),
('25430', 'PART-234', '2023-03-16 07:52:00', NULL, 0, 1, 1),
('25436', 'PART-234', '2023-03-16 08:04:00', NULL, 3, 1, 1),
('25440', 'PART-234', '2023-03-16 08:28:00', NULL, 0, 1, 1),
('25460', 'PART-234', '2023-03-16 09:54:00', NULL, 1, 1, 1),
('25829', 'PART-234', '2023-03-20 17:02:00', NULL, 3, 1, 1),
('26070', 'PART-234', '2023-03-21 17:35:00', NULL, 1, 1, 1),
('26267', 'PART-2394', '2023-03-22 17:11:00', NULL, 0, 2, 1),
('26268', 'PART-2394', '2023-03-22 17:12:00', NULL, 0, 2, 1),
('26271', 'PART-2394', '2023-03-22 17:15:00', NULL, 2, 1, 1),
('26276', 'PART-2394', '2023-03-22 17:25:00', NULL, 2, 1, 1),
('26277', 'PART-2394', '2023-03-22 17:26:00', NULL, 1, 1, 1),
('26278', 'PART-2394', '2023-03-22 17:27:00', NULL, 2, 1, 1),
('26279', 'PART-2394', '2023-03-22 17:27:00', NULL, 2, 1, 1),
('26280', 'PART-2394', '2023-03-22 17:28:00', NULL, 0, 1, 1),
('26281', 'PART-2394', '2023-03-22 17:28:00', NULL, 0, 1, 1),
('26282', 'PART-2394', '2023-03-22 17:29:00', NULL, 0, 1, 1),
('26283', 'PART-2394', '2023-03-22 17:30:00', NULL, 0, 1, 1),
('26284', 'PART-2394', '2023-03-22 17:31:00', NULL, 0, 1, 1),
('26285', 'PART-2394', '2023-03-22 17:31:00', NULL, 0, 1, 1),
('26327', 'PART-234', '2023-03-22 07:48:00', NULL, 0, 1, 1),
('26328', 'PART-234', '2023-03-22 07:49:00', NULL, 0, 1, 1),
('26577', 'PART-234', '2023-03-23 08:58:00', NULL, 0, 1, 1),
('26701', 'PART-234', '2023-03-24 15:38:00', NULL, 2, 1, 1),
('26706', 'PART-234', '2023-03-24 15:53:00', NULL, 0, 1, 1),
('26775', 'PART-234', '2023-03-24 07:37:00', NULL, 0, 1, 1),
('27064', 'PART-234', '2023-03-27 16:07:00', NULL, 0, 1, 1),
('27599', 'PART-234', '2023-03-29 17:02:00', NULL, 3, 1, 1),
('27611', 'PART-234', '2023-03-29 17:08:00', NULL, 0, 1, 1),
('27730', 'PART-234', '2023-03-29 10:34:00', NULL, 0, 1, 1),
('28048', 'PART-234', '2023-03-31 17:19:00', NULL, 0, 1, 1),
('28049', 'PART-234', '2023-03-31 17:21:00', NULL, 0, 1, 1),
('28050', 'PART-234', '2023-03-31 17:21:00', NULL, 1, 1, 1),
('28051', 'PART-234', '2023-03-31 17:22:00', NULL, 0, 1, 1),
('28052', 'PART-234', '2023-03-31 17:24:00', NULL, 1, 1, 1),
('28053', 'PART-234', '2023-03-31 17:25:00', NULL, 0, 1, 1),
('28054', 'PART-234', '2023-03-31 17:27:00', NULL, 0, 1, 1),
('28056', 'PART-234', '2023-03-31 17:27:00', NULL, 0, 1, 1),
('28057', 'PART-234', '2023-03-31 17:28:00', NULL, 0, 1, 1),
('28058', 'PART-234', '2023-03-31 17:29:00', NULL, 0, 1, 1),
('28060', 'PART-234', '2023-03-31 17:30:00', NULL, 0, 1, 1),
('28061', 'PART-234', '2023-03-31 17:31:00', NULL, 0, 1, 1),
('28063', 'PART-234', '2023-03-31 17:31:00', NULL, 0, 1, 1),
('28797', 'PART-234', '2023-04-05 18:03:00', NULL, 2, 1, 1),
('28799', 'PART-234', '2023-04-05 18:07:00', NULL, 0, 1, 1),
('28802', 'PART-234', '2023-04-05 18:15:00', NULL, 0, 1, 1),
('28806', 'PART-234', '2023-04-05 18:32:00', NULL, 2, 1, 1),
('28993', 'PART-2394', '2023-04-06 16:52:00', NULL, 2, 1, 1),
('29725', 'PART-234', '2023-04-11 17:45:00', NULL, 2, 1, 1),
('30337', 'PART-234', '2023-04-14 17:11:00', NULL, 1, 1, 1),
('30868', 'PART-2394', '2023-04-18 07:13:00', NULL, 0, 1, 1),
('30869', 'PART-2394', '2023-04-18 07:14:00', NULL, 0, 1, 1),
('30870', 'PART-2394', '2023-04-18 07:15:00', NULL, 1, 1, 1),
('31003', 'PART-234', '2023-04-19 16:18:00', NULL, 1, 1, 1),
('31050', 'PART-234', '2023-04-19 17:51:00', NULL, 1, 1, 1),
('31228', 'PART-2394', '2023-04-20 16:56:00', NULL, 1, 1, 1),
('31229', 'PART-2394', '2023-04-20 16:57:00', NULL, 0, 1, 1),
('9', '4', '2023-01-05 06:00:00', NULL, 2, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `idTicket` varchar(25) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`idTicket`, `nombre`) VALUES
('1', 'Proyect Default'),
('10', 'Tarea2_restaurante'),
('11', 'Tarea3_restaurante'),
('12', 'Tarea1_escuela'),
('13', 'Tarea2_escuela'),
('14', 'Tarea1_aplicacion'),
('15', 'Tarea2_aplicacion'),
('16', 'Tarea3_aplicacion'),
('2', 'Base de dato para escuela'),
('20754', '\"Client: add location channel and all_status endpoints to MSW\"'),
('20755', 'Frontend: Call only status service'),
('20763', 'Use Formik in the partner add and edit market component'),
('20774', 'Express client-side logging'),
('20783', 'Fix flaky tests in backend: markets_swagger_spec.rb:24'),
('20789', 'Refactor the finalize care - risk strat bypass implementation'),
('20790', 'Implement Slack alerts triggered by Datadog logs on Express'),
('20806', 'FE: update theme'),
('20807', 'Dynamic Config for FE vars'),
('20808', 'Investigate: Cron job overrunning allocated resources (remove cron)'),
('20822', 'Add alphabetical ordering to partner and users lists (backend)'),
('20823', 'Remove flag (FE) - risk_strat_bypass_express'),
('20856', 'Flaky Source requests spec'),
('20985', 'Configure CI devDependencies'),
('20986', 'Optimize paginated care request queries (memory)'),
('20987', 'FE: add jest-mock-extended library - testing with TS easily'),
('20988', 'Lint FE on CI - phase 1'),
('20989', 'GitHub pr template: feature gate & pic/vid checkbox'),
('20991', 'TechDebt: Eager loading associations in queries'),
('20992', 'Backend refactor to risk strat bypass implementation'),
('20993', 'Frontend specs spike: investigate how we can speed up our specs'),
('20994', 'Frontend tests: Parallelize and randomize'),
('20995', 'Add tests to AccessModal.jsx'),
('20996', 'Deprecate useCareRequest and useCareRequestsSearch hooks'),
('20997', 'Remove flag (BE) - pop_health_service'),
('20998', 'partner_express_nse_v3_enabled - spike to explore and create tickets to remove task'),
('20999', 'Remove flag (BE) - partner_express_nse_v3_enabled'),
('21001', 'FE: add no focused tests lint rule'),
('21002', 'Fix More Flaky  JS Tests in PartnerInformationPage'),
('21003', '\"Custom hook to detect a device type (isMobile isTablet isDesktop)\"'),
('21004', 'Map the values from the design to the theme'),
('21005', 'Set Datadog RUM config from statsig context'),
('21006', 'Configure UAT for Cypress e2e'),
('21007', 'FE: fix data dog test / refactor setupTest'),
('21038', 'Database problems - Clean up care request statuses'),
('21039', 'Database problems - Clean up care request'),
('21047', 'Fix Dependabot alerts'),
('21049', 'Update React Router to 6.x.x'),
('21081', 'Remove old Rollout Popup Banner'),
('21082', 'Remove all usages of \'||\' (or operator) related to partnerId'),
('21083', 'Implement custom randomized sequencer for FE tests'),
('21085', 'Refactor ChiefComplaint to use Formik'),
('21087', 'Code cleanup: remove partner.genesys_email from frontend'),
('21088', 'Code cleanup: remove old partner form (frontend)'),
('21093', 'replace createReducer with builder callback RTK'),
('21094', 'Tech Excellence: fix HashRouter warning'),
('21095', 'Tech Excellence: fix PrivateRoute test/prop warnings'),
('21096', 'Tech Excellence: fix InputWithChips test warnings'),
('21098', 'Tech Excellence FE : migrate MUI from v4 to v5'),
('21099', 'Tech Excellence FE : swap MUI for DS components'),
('21100', 'Tech Excellence FE : replace Express theme with DS theme'),
('21101', 'Upgrade React Scripts package - exploration'),
('21103', '\"FE: upgrade \"\"@testing-library/cypress\"\"\"'),
('21104', '\"FE: upgrade \"\"@testing-library/react\"\"\"'),
('21105', '\"FE: upgrade \"\"@testing-library/react-hooks\"\"\"'),
('21106', '\"FE: upgrade \"\"@testing-library/user-event\"\"\"'),
('21107', '\"FE: upgrade \"\"cypress\"\"\"'),
('21108', '\"FE: upgrade \"\"react router\"\"\"'),
('21109', 'FE: align our types packages with the packages we use (versions)'),
('22197', 'Remove cron from Procfile and remove Aptible services'),
('22255', 'Add bundle back to dockerfile'),
('23124', 'Integration Test - Care Requests Page Filter Menu Click Away'),
('23233', 'FE: Fix Flaky Test : SummaryCard & PartnerInformationPage'),
('23365', 'Fix Flaky Test : PartnerInformationPage - bypass risk option'),
('23369', 'Flaky ruby spec on CareRequest Query service'),
('23441', 'Demote MarketStatus::Nearest error messages to warn messages in logs'),
('23496', 'Daily Summary calls in station cause a DB spike at 10am everyday'),
('23678', 'Add Rake task - delete partners'),
('23698', 'Add Swagger docs for GET care requests endpoints (show and index)'),
('23809', 'Standardize the use of error key in the backend failure responses'),
('24050', 'Optimize account access'),
('24087', 'Create hook/careRequests dir'),
('24354', 'Remove flag (FE) - care_requests_page (including old dashboard)'),
('24358', 'Remove flag (BE) - care_requests_page'),
('24413', 'PartnerMarketsPage.js / fix flaky test'),
('24441', 'DispatchHealth/services - Use of Password Hash With Insufficient Computational Effort'),
('24442', 'DispatchHealth/services - Use of Password Hash With Insufficient Computational Effort'),
('24808', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in ansi-regex'),
('24809', 'DispatchHealth/partner-product:client/package.json - Prototype Pollution in immer'),
('24810', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in nth-check'),
('24811', 'DispatchHealth/partner-product:client/package.json - Prototype Pollution in immer'),
('24812', 'DispatchHealth/partner-product:client/package.json - Command Injection in react-dev-utils'),
('24813', 'DispatchHealth/partner-product:client/package.json - Prototype Pollution in loader-utils'),
('24814', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in browserslist'),
('24815', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in glob-parent'),
('24816', 'DispatchHealth/partner-product:client/package.json - Open Redirect in node-forge'),
('24817', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in postcss'),
('24818', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in postcss'),
('24819', 'DispatchHealth/partner-product:client/package.json - Improper Verification of Cryptographic Signature in node-forge'),
('24820', 'DispatchHealth/partner-product:client/package.json - Prototype Pollution in node-forge'),
('24821', 'DispatchHealth/partner-product:client/package.json - Improper Verification of Cryptographic Signature in node-forge'),
('24822', 'DispatchHealth/partner-product:client/package.json - Improper Verification of Cryptographic Signature in node-forge'),
('24823', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in ansi-html'),
('24824', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in loader-utils'),
('24825', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in loader-utils'),
('24826', 'DispatchHealth/partner-product:client/package.json - Regular Expression Denial of Service (ReDoS) in minimatch'),
('24827', 'DispatchHealth/partner-product:client/package.json - Command Injection in lodash.template'),
('24828', 'DispatchHealth/partner-product:client/package.json - Reverse Tabnabbing in istanbul-reports'),
('24829', 'DispatchHealth/partner-product:client/package.json - Prototype Pollution in json5'),
('24830', 'DispatchHealth/partner-product:client/package.json - Prototype Pollution in unset-value'),
('24831', 'DispatchHealth/partner-product:Gemfile.lock - Denial of Service (DoS) in rack'),
('24832', 'DispatchHealth/partner-product:Gemfile.lock - GPL-2.0 license in colorize'),
('24833', 'DispatchHealth/partner-product:Gemfile.lock - Web Cache Poisoning in rack'),
('24834', 'DispatchHealth/partner-product:Gemfile.lock - Information Exposure in actioncable'),
('24835', 'DispatchHealth/partner-product - Code Injection'),
('24836', 'DispatchHealth/partner-product - Use of Hardcoded Credentials'),
('24837', 'DispatchHealth/partner-product - Use of Hardcoded Credentials'),
('24838', 'DispatchHealth/partner-product - Use of Externally-Controlled Format String'),
('24839', 'DispatchHealth/partner-product - Use of Hardcoded Credentials'),
('24840', 'DispatchHealth/partner-product - Improperly Controlled Modification of Dynamically-Determined Object Attributes'),
('25430', 'Research existing Statsig feature gates - generate AIs for each'),
('25436', 'Migrate existing Statsig flags / dynamic configs to A/B project'),
('25440', 'Fix impersonation feature (too slow)'),
('25460', 'Remove deprecated market zipcode route from Station'),
('25829', 'Upgrade React Scripts - 2 '),
('26070', 'Refactor Typescript Enum to use PascalCase'),
('26267', 'Add \'Select Payer\' input to insurance page'),
('26268', 'Add \'Select Network\' input to insurance page'),
('26271', 'UI : view - Payer field'),
('26276', 'UI: payer field - api hook & data type '),
('26277', 'UI: Feature Gate - new fields '),
('26278', '(BE) New backend insurance-payer endpoint'),
('26279', 'New backend service to fetch insurance-payer data from Station'),
('26280', 'Update E2E tests - payer'),
('26281', ' UI view for the select network input'),
('26282', 'UI api hook and data type - network'),
('26283', 'New backend insurance-network endpoint'),
('26284', 'New backend service to fetch insurance-network data from Station'),
('26285', 'Update E2E tests - network'),
('26327', 'Remove create_care_request_server_error_handling feature gate and code'),
('26328', 'Remove create_care_request_server_error_handling feature gate and code'),
('26577', 'Investigate Statsig FeatureGateList not working'),
('26701', 'Update context/Statsig.js to TS file'),
('26706', 'FE: upgrade React Query package from v3.X to v4.x'),
('26775', '\"Decouple market \"\"nearest\"\" from market \"\"status\"\" service\"'),
('27064', 'Update yaml to use official docker orb'),
('27599', 'create logEvent utility'),
('27611', 'Implement Segment Event Tracking'),
('27730', 'Source code should not be visible in production browser console'),
('28048', 'FF Removal: Remove Risk Strat Flags'),
('28049', 'FF Removal: partner_express_log_payloads'),
('28050', 'FF Removal: partner_express_service_line_information_enabled'),
('28051', 'FF Removal: pop_health_service'),
('28052', 'FF Removal: partner_express_sso_enabled'),
('28053', 'FF Removal: partner_express_nse_v2_enabled'),
('28054', 'FF Removal: show-paginated-care-requests-table'),
('28056', 'FF Removal: enable-care-request-timeline'),
('28057', 'FF Removal: enable-risk-stratification'),
('28058', 'FF Removal: after-hours-care-requests-enabled'),
('28060', 'FF Removal: show-care-request-refactored-table'),
('28061', 'FF Removal: enable_show_old_care_requests'),
('28063', 'FF Removal: enable_care_request_search'),
('28797', 'Implement Segment tracking'),
('28799', 'logEvent when clientConfiguration dynamic config empty'),
('28802', 'Remove fallbackConfig in Statsig/getClientConfiguration'),
('28806', 'Upgrade Node'),
('28993', 'Configure backend connection with insurance service'),
('29725', 'estimate an effort for migrating to vite from CRA'),
('3', 'Aplicacion android'),
('30337', ' Fix Flaky test(\'should show total pages count in pagination\') - Care Requests Page'),
('30868', '(BE) Add payer_id and network_id to the insurance table'),
('30869', '(BE) Return insurance payer_id and network_id as part of the patient insurance data'),
('30870', '(FE) Edit patient - prepopulate the payer and network inputs'),
('31003', 'Flaky backend test - user_profile last_login'),
('31050', 'Fix ServiceLineInformation flaky test'),
('31228', 'Default insurance + feature gate logic'),
('31229', '(FE) Add payer_id and network_id to the insurance object submited on the care request'),
('4', 'Software para meseros'),
('5', 'Software para gerente'),
('6', 'Tabla de alumnos'),
('7', 'Sistema de maestros'),
('8', 'Conexion con google playstore'),
('9', 'Tarea1_restaurante'),
('PART-234', 'Express Tech Excellence'),
('PART-2394', 'Insurance Restructure');

-- --------------------------------------------------------

--
-- Table structure for table `tipo`
--

CREATE TABLE `tipo` (
  `idTipo` int(11) NOT NULL,
  `descripcion` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo`
--

INSERT INTO `tipo` (`idTipo`, `descripcion`) VALUES
(1, 'Task'),
(2, 'Story'),
(3, 'Bug');

-- --------------------------------------------------------

--
-- Table structure for table `trabaja`
--

CREATE TABLE `trabaja` (
  `idProyecto` varchar(25) NOT NULL,
  `idUsuario` varchar(25) NOT NULL,
  `fechaAsignacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `efectividadAsignada` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trabaja`
--

INSERT INTO `trabaja` (`idProyecto`, `idUsuario`, `fechaAsignacion`, `efectividadAsignada`) VALUES
('1', '1', '2023-01-01 06:00:00', 2),
('1', '2', '2023-01-01 06:00:00', 2),
('1', '4', '2023-01-01 06:00:00', 2),
('2', '3', '2022-09-21 06:00:00', 4),
('2', '5', '2022-09-21 06:00:00', 4),
('3', '1', '2023-03-15 06:00:00', 2),
('3', '2', '2023-03-15 06:00:00', 3),
('3', '5', '2023-03-15 06:00:00', 4);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` varchar(25) NOT NULL,
  `nombre` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombre`) VALUES
('1', 'Alfonso'),
('2', 'Valentina'),
('3', 'Ricardo'),
('4', 'Renee'),
('5', 'Luis'),
('6', 'Sofia'),
('607f2fef739dd40069a4b2a3', 'Dan Cohn'),
('61a3edabb0b630006afda9e4', 'Ashton Mitchell'),
('61c9eb457c6f980070deda99', 'Bernardo Gomez-Romero'),
('61f81bb630f6b8006aa75942', 'Antonio Antillon'),
('62cdef6c6eba71983721e037', 'Giorgi Gelashvili'),
('62cdf020afe495359d9d9b0b', 'Sam Lanker'),
('62cdf0d01e326fd93012992d', 'Kevin Anderson');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `epic`
--
ALTER TABLE `epic`
  ADD PRIMARY KEY (`idTicket`),
  ADD KEY `perteneProyecto` (`perteneProyecto`);

--
-- Indexes for table `estado_laboral`
--
ALTER TABLE `estado_laboral`
  ADD PRIMARY KEY (`idUsuario`,`idEstatus`,`fechaCambio`),
  ADD KEY `idEstatus` (`idEstatus`);

--
-- Indexes for table `estatus`
--
ALTER TABLE `estatus`
  ADD PRIMARY KEY (`idEstatus`);

--
-- Indexes for table `fase`
--
ALTER TABLE `fase`
  ADD PRIMARY KEY (`idTicket`,`idEstatus`,`fechaCambio`),
  ADD KEY `idEstatus` (`idEstatus`);

--
-- Indexes for table `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`idTicket`);

--
-- Indexes for table `responsable`
--
ALTER TABLE `responsable`
  ADD PRIMARY KEY (`idUsuario`,`idTarea`,`fechaAsignacion`),
  ADD KEY `idTarea` (`idTarea`);

--
-- Indexes for table `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`idTicket`),
  ADD KEY `perteneceEpic` (`perteneceEpic`),
  ADD KEY `esTipo` (`esTipo`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`idTicket`);

--
-- Indexes for table `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`idTipo`);

--
-- Indexes for table `trabaja`
--
ALTER TABLE `trabaja`
  ADD PRIMARY KEY (`idProyecto`,`idUsuario`,`fechaAsignacion`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `epic`
--
ALTER TABLE `epic`
  ADD CONSTRAINT `epic_ibfk_1` FOREIGN KEY (`idTicket`) REFERENCES `ticket` (`idTicket`),
  ADD CONSTRAINT `epic_ibfk_2` FOREIGN KEY (`perteneProyecto`) REFERENCES `proyecto` (`idTicket`);

--
-- Constraints for table `estado_laboral`
--
ALTER TABLE `estado_laboral`
  ADD CONSTRAINT `estado_laboral_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `estado_laboral_ibfk_2` FOREIGN KEY (`idEstatus`) REFERENCES `estatus` (`idEstatus`);

--
-- Constraints for table `fase`
--
ALTER TABLE `fase`
  ADD CONSTRAINT `fase_ibfk_1` FOREIGN KEY (`idTicket`) REFERENCES `ticket` (`idTicket`),
  ADD CONSTRAINT `fase_ibfk_2` FOREIGN KEY (`idEstatus`) REFERENCES `estatus` (`idEstatus`);

--
-- Constraints for table `proyecto`
--
ALTER TABLE `proyecto`
  ADD CONSTRAINT `proyecto_ibfk_1` FOREIGN KEY (`idTicket`) REFERENCES `ticket` (`idTicket`);

--
-- Constraints for table `responsable`
--
ALTER TABLE `responsable`
  ADD CONSTRAINT `responsable_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `responsable_ibfk_2` FOREIGN KEY (`idTarea`) REFERENCES `tarea` (`idTicket`);

--
-- Constraints for table `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`idTicket`) REFERENCES `ticket` (`idTicket`),
  ADD CONSTRAINT `tarea_ibfk_2` FOREIGN KEY (`perteneceEpic`) REFERENCES `epic` (`idTicket`),
  ADD CONSTRAINT `tarea_ibfk_3` FOREIGN KEY (`esTipo`) REFERENCES `tipo` (`idTipo`);

--
-- Constraints for table `trabaja`
--
ALTER TABLE `trabaja`
  ADD CONSTRAINT `trabaja_ibfk_1` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`idTicket`),
  ADD CONSTRAINT `trabaja_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
