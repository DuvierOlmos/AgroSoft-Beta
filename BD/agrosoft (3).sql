-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-09-2025 a las 22:12:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agrosoft`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` bigint(20) NOT NULL,
  `id_usuario` bigint(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_carrito` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `id_usuario`, `fecha_creacion`, `fecha_ultima_actualizacion`, `estado_carrito`) VALUES
(1, 1, '2025-06-01 10:00:00', '2025-06-10 15:00:00', 'Activo'),
(2, 2, '2025-05-20 08:30:00', '2025-06-05 12:45:00', 'Completado'),
(3, 3, '2025-06-02 14:00:00', '2025-06-03 09:00:00', 'Abandonado'),
(4, 4, '2025-06-04 16:30:00', '2025-06-10 18:00:00', 'Activo'),
(5, 5, '2025-05-18 11:00:00', '2025-05-25 10:00:00', 'Completado'),
(6, 6, '2025-06-01 09:15:00', '2025-06-02 08:30:00', 'Abandonado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(100) NOT NULL,
  `estado` varchar(20) DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`, `estado`) VALUES
(1, 'Carnes', 'Activo'),
(2, 'Frutas', 'Activo'),
(3, 'Granos', 'Activo'),
(4, 'Huevos', 'Activo'),
(5, 'Lácteos', 'Activo'),
(6, 'Tubérculos', 'Activo'),
(7, 'Verduras', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_descuento`
--

CREATE TABLE `categoria_descuento` (
  `id_categoria` int(11) NOT NULL,
  `id_descuento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_descuento`
--

INSERT INTO `categoria_descuento` (`id_categoria`, `id_descuento`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_oferta`
--

CREATE TABLE `categoria_oferta` (
  `id_categoria` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_oferta`
--

INSERT INTO `categoria_oferta` (`id_categoria`, `id_oferta`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario_resena`
--

CREATE TABLE `comentario_resena` (
  `id_comentario_resena` bigint(20) NOT NULL,
  `id_usuario` bigint(20) NOT NULL,
  `id_producto` bigint(20) NOT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `texto_comentario` text NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `estado_comentario` varchar(20) NOT NULL,
  `id_administrador_moderador` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario_resena`
--

INSERT INTO `comentario_resena` (`id_comentario_resena`, `id_usuario`, `id_producto`, `calificacion`, `texto_comentario`, `fecha_creacion`, `estado_comentario`, `id_administrador_moderador`) VALUES
(1, 1, 1, 4, 'Excelente producto, superó mis expectativas.', '2025-09-14 21:00:11', 'Aprobado', 19),
(2, 2, 2, 4, 'Buen producto, aunque el envío demoró un poco.', '2025-09-14 21:00:11', 'Aprobado', 12),
(3, 3, 3, 3, 'Calidad aceptable, pero esperaba más.', '2025-09-14 21:00:11', 'Pendiente', NULL),
(4, 4, 4, 2, 'No cumplió con lo prometido, estoy decepcionado.', '2025-09-14 21:00:11', 'Rechazado', 13),
(5, 5, 5, 4, 'Buen precio y calidad.', '2025-09-14 21:00:11', 'Aprobado', 14),
(6, 6, 6, 5, 'Muy satisfecho, volveré a comprar.', '2025-09-14 21:00:11', 'Aprobado', 15),
(7, 1, 1, 5, 'Muy bueno', '2025-09-25 21:15:57', 'Pendiente', NULL),
(8, 1, 1, 3, 'Me gustó mucho.', '2025-09-25 21:26:40', 'Aprobado', NULL),
(9, 1, 1, 5, 'Bien, muy buenos', '2025-09-25 21:35:42', 'Pendiente', NULL),
(10, 1, 2, 3, 'Muy bueno', '2025-09-25 22:25:56', 'Pendiente', NULL),
(11, 5, 2, 4, 'Muy buen producto, aunque el empaque podría mejorar un poco.', '2025-09-28 11:27:52', 'Aprobado', NULL),
(12, 5, 1, 4, 'Muy buen producto, aunque el empaque podría mejorar un poco.', '2025-09-28 11:28:41', 'Aprobado', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `descuentos`
--

CREATE TABLE `descuentos` (
  `id_descuento` int(11) NOT NULL,
  `nombre_descuento` varchar(100) NOT NULL,
  `tipo_descuento` varchar(20) NOT NULL,
  `valor_descuento` decimal(5,2) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `codigo_descuento` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `descuentos`
--

INSERT INTO `descuentos` (`id_descuento`, `nombre_descuento`, `tipo_descuento`, `valor_descuento`, `fecha_inicio`, `fecha_fin`, `codigo_descuento`, `activo`) VALUES
(1, 'Descuento Primavera', 'Porcentaje', 0.15, '2025-03-01 00:00:00', '2025-05-31 23:59:59', 'PRIMAVERA15', 1),
(2, 'Descuento Verano', 'Porcentaje', 0.20, '2025-06-01 00:00:00', '2025-08-31 23:59:59', 'VERANO20', 1),
(3, 'Descuento Invierno', 'Monto Fijo', 10.00, '2025-12-01 00:00:00', '2025-12-31 23:59:59', 'INVIERNO10', 1),
(4, 'Descuento Otoño', 'Porcentaje', 0.10, '2025-09-01 00:00:00', '2025-11-30 23:59:59', 'OTOÑO10', 1),
(5, 'Descuento Cliente Nuevo', 'Monto Fijo', 5.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'NUEVO5', 1),
(6, 'Descuento Festivo', 'Porcentaje', 0.25, '2025-12-24 00:00:00', '2025-12-26 23:59:59', 'FESTIVO25', 1),
(7, 'Descuento Semana Santa', 'Porcentaje', 0.18, '2025-04-10 00:00:00', '2025-04-20 23:59:59', 'SEMANA18', 1),
(8, 'Descuento Aniversario', 'Monto Fijo', 15.00, '2025-07-15 00:00:00', '2025-07-20 23:59:59', 'ANIVERSARIO15', 1),
(9, 'Descuento Black Friday', 'Porcentaje', 0.30, '2025-11-27 00:00:00', '2025-11-29 23:59:59', 'BLACK30', 1),
(10, 'Descuento Cyber Monday', 'Porcentaje', 0.28, '2025-11-30 00:00:00', '2025-12-01 23:59:59', 'CYBER28', 1),
(11, 'Descuento Productos Frescos', 'Monto Fijo', 3.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'FRESCOS3', 1),
(12, 'Descuento Navidad', 'Porcentaje', 0.22, '2025-12-15 00:00:00', '2025-12-25 23:59:59', 'NAVIDAD22', 1),
(13, 'Descuento Fin de Semana', 'Monto Fijo', 7.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'FINSEM7', 1),
(14, 'Descuento Clientes Frecuentes', 'Porcentaje', 0.12, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'FRECUENTE12', 1),
(15, 'Descuento Liquidación', 'Porcentaje', 0.40, '2025-06-01 00:00:00', '2025-06-15 23:59:59', 'LIQUIDA40', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_carrito`
--

CREATE TABLE `detalle_carrito` (
  `id_detalle_carrito` bigint(20) NOT NULL,
  `id_carrito` bigint(20) NOT NULL,
  `id_producto` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario_al_momento` decimal(10,3) NOT NULL,
  `subtotal` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_carrito`
--

INSERT INTO `detalle_carrito` (`id_detalle_carrito`, `id_carrito`, `id_producto`, `cantidad`, `precio_unitario_al_momento`, `subtotal`) VALUES
(1, 1, 1, 5, 20.000, 100.000),
(2, 2, 2, 3, 15.500, 46.500),
(3, 3, 3, 2, 30.000, 45.000),
(4, 4, 4, 7, 12.000, 84.000),
(5, 5, 5, 2, 50.000, 100.000),
(6, 6, 6, 4, 25.000, 100.000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id_detalle_pedido` bigint(20) NOT NULL,
  `id_pedido` bigint(20) NOT NULL,
  `id_producto` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario_al_momento` decimal(10,3) NOT NULL,
  `subtotal` decimal(10,3) NOT NULL,
  `descuento_aplicado_monto` decimal(10,3) DEFAULT 0.000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id_detalle_pedido`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario_al_momento`, `subtotal`, `descuento_aplicado_monto`) VALUES
(1, 1, 1, 3, 10.000, 30.000, 0.000),
(2, 2, 2, 5, 8.000, 40.000, 5.000),
(3, 3, 3, 2, 12.500, 25.000, 0.000),
(4, 4, 4, 1, 20.000, 20.000, 2.000),
(5, 5, 5, 4, 6.500, 26.000, 1.500),
(6, 6, 6, 2, 15.000, 30.000, 0.000);

--
-- Disparadores `detalle_pedido`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_producto` AFTER INSERT ON `detalle_pedido` FOR EACH ROW BEGIN
    -- Restar la cantidad vendida (NEW.cantidad) del stock_disponible
    -- para el producto que se acaba de insertar en el detalle del pedido.
    UPDATE producto
    SET stock_disponible = stock_disponible - NEW.cantidad
    WHERE id_producto = NEW.id_producto; -- Usamos directamente el ID del producto de la nueva fila.
    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pedido`
--

CREATE TABLE `estado_pedido` (
  `id_estado_pedido` int(11) NOT NULL,
  `nombre_estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_pedido`
--

INSERT INTO `estado_pedido` (`id_estado_pedido`, `nombre_estado`) VALUES
(5, 'Cancelado'),
(4, 'Entregado'),
(3, 'Enviado'),
(1, 'Pendiente'),
(2, 'Procesando');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pqrs`
--

CREATE TABLE `estado_pqrs` (
  `id_estado_pqrs` int(11) NOT NULL,
  `nombre_estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_pqrs`
--

INSERT INTO `estado_pqrs` (`id_estado_pqrs`, `nombre_estado`) VALUES
(4, 'Cerrado'),
(2, 'En Progreso'),
(1, 'Pendiente'),
(3, 'Resuelto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` bigint(20) NOT NULL,
  `id_producto` bigint(20) NOT NULL,
  `id_agricultor` bigint(20) DEFAULT NULL,
  `vendido` int(11) NOT NULL DEFAULT 0,
  `fecha_Compra` datetime DEFAULT NULL,
  `cantidad_disponible` int(11) NOT NULL DEFAULT 0,
  `fecha_ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ubicacion_almacenamiento` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_producto`, `id_agricultor`, `vendido`, `fecha_Compra`, `cantidad_disponible`, `fecha_ultima_actualizacion`, `ubicacion_almacenamiento`) VALUES
(1, 1, 32, 0, NULL, 100, '2025-09-14 21:00:10', 'Finca El Roble'),
(2, 2, 33, 0, NULL, 50, '2025-09-14 21:00:10', 'Finca El Roble'),
(3, 3, 34, 0, NULL, 75, '2025-09-14 21:00:10', 'Finca El Roble'),
(4, 4, 32, 0, NULL, 120, '2025-09-14 21:00:10', 'Vereda La Esperanza'),
(5, 5, 33, 0, NULL, 60, '2025-09-14 21:00:10', 'Vereda La Esperanza'),
(6, 6, 34, 0, NULL, 30, '2025-09-14 21:00:10', 'Vereda La Esperanza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int(11) NOT NULL,
  `nombre_metodo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodo_pago`, `nombre_metodo`) VALUES
(5, 'Efectivo al Recibir'),
(3, 'PayPal'),
(1, 'Tarjeta de Crédito'),
(2, 'Tarjeta de Débito'),
(4, 'Transferencia Bancaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `id_oferta` int(11) NOT NULL,
  `nombre_oferta` varchar(100) NOT NULL,
  `descripcion_oferta` text DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `tipo_oferta` varchar(50) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `ofertas` (`id_oferta`, `nombre_oferta`, `descripcion_oferta`, `fecha_inicio`, `fecha_fin`, `tipo_oferta`, `activo`) VALUES
(1, 'Oferta 2x1 Tomates', 'Compra 2 tomates y paga 1.', '2025-05-01 00:00:00', '2025-05-10 23:59:59', '2x1', 1),
(2, 'Oferta Envío Gratis', 'Envío gratis en compras mayores a $50.', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'Envío Gratis', 1),
(3, 'Oferta Descuento por Cantidad', '10% de descuento al comprar 10 kg o más.', '2025-03-15 00:00:00', '2025-04-15 23:59:59', 'Descuento por Cantidad', 1),
(4, 'Oferta Combo Frutas', 'Pack de frutas a precio especial.', '2025-06-01 00:00:00', '2025-06-30 23:59:59', 'Descuento por Cantidad', 1),
(5, 'Oferta 3x2 Verduras', 'Compra 3 y paga 2.', '2025-07-01 00:00:00', '2025-07-15 23:59:59', '3x2', 1),
(6, 'Oferta Fin de Semana', 'Descuentos especiales solo fines de semana.', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'Descuento por Cantidad', 1),
(7, 'Oferta Festival de Cítricos', 'Descuento en todos los cítricos.', '2025-08-01 00:00:00', '2025-08-10 23:59:59', 'Porcentaje', 1),
(8, 'Oferta Pack de Hierbas', 'Paquete de hierbas frescas con descuento.', '2025-09-01 00:00:00', '2025-09-30 23:59:59', 'Descuento por Cantidad', 1),
(9, 'Oferta Día del Agricultor', 'Descuento especial para agricultores.', '2025-10-01 00:00:00', '2025-10-05 23:59:59', 'Porcentaje', 1),
(10, 'Oferta Liquidación de Temporada', 'Últimos productos con descuento.', '2025-11-01 00:00:00', '2025-11-15 23:59:59', 'Monto Fijo', 1),
(11, 'Oferta Pack Sazonadores', 'Combo de especias a precio rebajado.', '2025-04-01 00:00:00', '2025-04-30 23:59:59', 'Descuento por Cantidad', 1),
(12, 'Oferta Promo Maíz', 'Maíz en oferta por tiempo limitado.', '2025-02-15 00:00:00', '2025-03-15 23:59:59', 'Porcentaje', 1),
(13, 'Oferta Frutas Tropicales', 'Descuento en frutas tropicales.', '2025-07-20 00:00:00', '2025-08-20 23:59:59', 'Porcentaje', 1),
(14, 'Oferta Verduras de Invierno', 'Paquete especial para invierno.', '2025-12-01 00:00:00', '2025-12-31 23:59:59', 'Monto Fijo', 1),
(15, 'Oferta Semana Verde', 'Descuento en productos verdes.', '2025-04-10 00:00:00', '2025-04-17 23:59:59', 'Descuento por Cantidad', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` bigint(20) NOT NULL,
  `id_usuario` bigint(20) NOT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `total_pedido` decimal(10,2) NOT NULL,
  `id_metodo_pago` int(11) NOT NULL,
  `direccion_envio` varchar(255) NOT NULL,
  `ciudad_envio` varchar(100) NOT NULL,
  `codigo_postal_envio` varchar(20) DEFAULT NULL,
  `id_estado_pedido` int(11) NOT NULL,
  `fecha_entrega_estimada` datetime DEFAULT NULL,
  `fecha_entrega_real` datetime DEFAULT NULL,
  `numero_seguimiento` varchar(100) DEFAULT NULL,
  `notas_pedido` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `fecha_pedido`, `total_pedido`, `id_metodo_pago`, `direccion_envio`, `ciudad_envio`, `codigo_postal_envio`, `id_estado_pedido`, `fecha_entrega_estimada`, `fecha_entrega_real`, `numero_seguimiento`, `notas_pedido`) VALUES
(1, 1, '2025-05-10 10:15:00', 150.75, 1, 'Cra 10 #20-30', 'Bogotá', '110111', 4, '2025-05-15 18:00:00', '2025-05-14 17:30:00', 'TRACK001', 'Entregar en horario de oficina.'),
(2, 2, '2025-05-11 11:00:00', 80.00, 2, 'Calle 45 #67-89', 'Medellín', '050021', 3, '2025-05-16 12:00:00', NULL, 'TRACK002', NULL),
(3, 3, '2025-05-12 09:30:00', 200.00, 3, 'Av 3 #12-34', 'Cali', '760001', 2, '2025-05-17 16:00:00', NULL, 'TRACK003', 'Revisar productos antes de enviar.'),
(4, 4, '2025-05-13 14:45:00', 350.50, 4, 'Cra 8 #44-12', 'Barranquilla', '080001', 1, '2025-05-18 19:00:00', NULL, 'TRACK004', 'Cliente pidió factura.'),
(5, 5, '2025-05-14 16:20:00', 120.00, 5, 'Calle 9 #10-11', 'Pereira', '660001', 5, '2025-05-19 17:00:00', '2025-05-19 16:45:00', 'TRACK005', NULL),
(6, 6, '2025-05-15 08:10:00', 450.25, 1, 'Transv 21 #55-32', 'Bucaramanga', '680001', 4, '2025-05-20 15:00:00', '2025-05-19 14:30:00', 'TRACK006', 'Dejar con conserje si no está el cliente.'),
(7, 7, '2025-05-16 12:00:00', 75.00, 2, 'Calle 70 #88-90', 'Cartagena', '130001', 3, '2025-05-21 13:00:00', NULL, 'TRACK007', NULL),
(8, 8, '2025-05-17 13:30:00', 95.00, 3, 'Av 6N #13-14', 'Cúcuta', '540001', 2, '2025-05-22 17:00:00', NULL, 'TRACK008', NULL),
(9, 9, '2025-05-18 15:40:00', 220.00, 4, 'Cra 15 #22-33', 'Ibagué', '730001', 1, '2025-05-23 18:00:00', NULL, 'TRACK009', 'Cliente solicitó llamada previa.'),
(10, 10, '2025-05-19 10:25:00', 130.00, 5, 'Calle 100 #20-10', 'Neiva', '410001', 5, '2025-05-24 16:00:00', '2025-05-24 15:50:00', 'TRACK010', NULL),
(11, 11, '2025-05-20 09:15:00', 300.00, 1, 'Oficina 1', 'Bogotá', '110111', 4, '2025-05-25 18:00:00', '2025-05-24 17:30:00', 'TRACK011', NULL),
(12, 12, '2025-05-21 14:00:00', 50.00, 2, 'Cra 9 #33-22', 'Cali', '760001', 3, '2025-05-26 12:00:00', NULL, 'TRACK012', NULL),
(13, 13, '2025-05-22 08:45:00', 400.00, 3, 'Calle 50 #60-70', 'Medellín', '050021', 2, '2025-05-27 16:00:00', NULL, 'TRACK013', NULL),
(14, 14, '2025-05-23 11:30:00', 250.75, 4, 'Cra 18 #40-20', 'Cartagena', '130001', 1, '2025-05-28 19:00:00', NULL, 'TRACK014', 'Entregar a seguridad.'),
(15, 15, '2025-05-24 17:45:00', 175.00, 5, 'Oficina 9', 'Barranquilla', '080001', 5, '2025-05-29 17:00:00', '2025-05-29 16:55:00', 'TRACK015', NULL),
(16, 16, '2025-05-25 10:00:00', 190.00, 1, 'Av Central #33-44', 'Manizales', '170001', 4, '2025-05-30 15:00:00', '2025-05-29 14:30:00', 'TRACK016', NULL),
(17, 17, '2025-05-26 13:15:00', 85.00, 2, 'Cra 77 #10-10', 'Cúcuta', '540001', 3, '2025-05-31 13:00:00', NULL, 'TRACK017', NULL),
(18, 18, '2025-05-27 14:30:00', 220.00, 3, 'Calle 13 #8-20', 'Pasto', '520001', 2, '2025-06-01 17:00:00', NULL, 'TRACK018', 'Verificar dirección.'),
(19, 19, '2025-05-28 16:00:00', 140.00, 4, 'Calle 6 #1-23', 'Tunja', '150001', 1, '2025-06-02 18:00:00', NULL, 'TRACK019', NULL),
(20, 20, '2025-05-29 09:30:00', 165.00, 5, 'Zona Industrial 5', 'Montería', '230001', 5, '2025-06-03 16:00:00', '2025-06-03 15:50:00', 'TRACK020', NULL),
(21, 21, '2025-05-30 10:10:00', 130.50, 1, 'Finca El Roble', 'Tolima', '730001', 4, '2025-06-04 18:00:00', '2025-06-03 17:30:00', 'TRACK021', NULL),
(22, 22, '2025-05-31 11:20:00', 70.00, 2, 'Vereda La Esperanza', 'Huila', '410001', 3, '2025-06-05 12:00:00', NULL, 'TRACK022', NULL),
(23, 23, '2025-06-01 09:00:00', 210.00, 3, 'Finca San José', 'Nariño', '520001', 2, '2025-06-06 16:00:00', NULL, 'TRACK023', NULL),
(24, 24, '2025-06-02 14:50:00', 320.00, 4, 'Zona Rural Km 12', 'Meta', '180001', 1, '2025-06-07 19:00:00', NULL, 'TRACK024', 'Llamar antes de entregar.'),
(25, 25, '2025-06-03 16:30:00', 100.00, 5, 'Camino Real #123', 'Cauca', '760001', 5, '2025-06-08 17:00:00', '2025-06-08 16:50:00', 'TRACK025', NULL),
(26, 26, '2025-06-04 09:45:00', 275.00, 1, 'Sector El Bosque', 'Antioquia', '050021', 4, '2025-06-09 15:00:00', '2025-06-08 14:30:00', 'TRACK026', NULL),
(27, 27, '2025-06-05 11:10:00', 90.00, 2, 'Finca Las Palmas', 'Caldas', '170001', 3, '2025-06-10 13:00:00', NULL, 'TRACK027', NULL),
(28, 28, '2025-06-06 13:25:00', 230.00, 3, 'Km 4 Vía al Mar', 'La Guajira', '440001', 2, '2025-06-11 17:00:00', NULL, 'TRACK028', NULL),
(29, 29, '2025-06-07 15:00:00', 125.00, 4, 'Vereda Los Pinos #45', 'Santander', '680001', 1, '2025-06-12 18:00:00', NULL, 'TRACK029', 'Por favor, dejar en portería si no hay nadie.'),
(30, 30, '2025-06-08 10:20:00', 180.00, 5, 'Calle 7 #89-12', 'Villavicencio', '500001', 5, '2025-06-13 17:00:00', '2025-06-13 16:50:00', 'TRACK030', 'Cliente pidió embalaje extra para regalo.'),
(31, 31, '2025-06-09 11:00:00', 190.00, 1, 'Cra 50 #100-110', 'Cali', '760001', 4, '2025-06-14 17:00:00', '2025-06-13 16:45:00', 'TRACK031', 'Incluir tarjeta de cumpleaños.'),
(32, 32, '2025-06-10 09:30:00', 150.50, 2, 'Calle 80 #20-30', 'Pereira', '660001', 3, '2025-06-15 13:00:00', NULL, 'TRACK032', 'Revisar condiciones de garantía.'),
(33, 33, '2025-06-11 12:00:00', 200.00, 3, 'Av 2 #15-20', 'Medellín', '050021', 2, '2025-06-16 17:00:00', NULL, 'TRACK033', 'Verificar disponibilidad de producto.'),
(34, 34, '2025-06-12 10:30:00', 250.75, 4, 'Calle 45 #34-56', 'Barranquilla', '080001', 1, '2025-06-17 19:00:00', NULL, 'TRACK034', 'Llamar antes de la entrega.'),
(35, 35, '2025-06-13 14:00:00', 120.00, 5, 'Cra 21 #56-67', 'Ibagué', '730001', 5, '2025-06-18 15:00:00', '2025-06-18 14:45:00', 'TRACK035', NULL),
(36, 36, '2025-06-14 16:20:00', 130.25, 1, 'Calle 90 #22-35', 'Cúcuta', '540001', 4, '2025-06-19 18:00:00', '2025-06-18 17:30:00', 'TRACK036', 'Cliente solicitó factura.'),
(37, 37, '2025-06-15 10:00:00', 170.50, 2, 'Calle 100 #30-40', 'Neiva', '410001', 3, '2025-06-20 12:00:00', NULL, 'TRACK037', 'Confirmar producto antes de enviar.'),
(38, 38, '2025-06-16 09:45:00', 220.00, 3, 'Cra 80 #15-25', 'Medellín', '050021', 2, '2025-06-21 16:00:00', NULL, 'TRACK038', 'Incluir nota personalizada.'),
(39, 39, '2025-06-17 12:15:00', 180.00, 4, 'Calle 50 #70-80', 'Pasto', '520001', 1, '2025-06-22 17:00:00', NULL, 'TRACK039', 'Cliente pidió llamada antes de la entrega.'),
(40, 40, '2025-06-18 13:00:00', 150.00, 5, 'Av 100 #40-50', 'Manizales', '170001', 5, '2025-06-23 16:00:00', '2025-06-23 15:45:00', 'TRACK040', NULL),
(41, 41, '2025-06-19 14:30:00', 220.25, 1, 'Calle 110 #10-20', 'Cali', '760001', 4, '2025-06-24 17:00:00', '2025-06-23 16:30:00', 'TRACK041', 'Entregar en horario nocturno.'),
(42, 42, '2025-06-20 10:45:00', 180.75, 2, 'Cra 70 #22-33', 'Barranquilla', '080001', 3, '2025-06-25 15:00:00', NULL, 'TRACK042', 'Confirmar dirección antes de enviar.'),
(43, 43, '2025-06-21 13:30:00', 260.00, 3, 'Calle 60 #90-100', 'Pereira', '660001', 2, '2025-06-26 17:00:00', NULL, 'TRACK043', 'Incluir tarjeta de agradecimiento.'),
(44, 44, '2025-06-22 11:10:00', 210.50, 4, 'Cra 15 #50-60', 'Neiva', '410001', 1, '2025-06-27 18:00:00', NULL, 'TRACK044', 'Verificar estado del producto.'),
(45, 45, '2025-06-23 09:20:00', 170.00, 5, 'Calle 30 #45-50', 'Medellín', '050021', 5, '2025-06-28 16:00:00', '2025-06-28 15:50:00', 'TRACK045', NULL),
(46, 46, '2025-06-24 14:00:00', 195.75, 1, 'Calle 120 #15-25', 'Cali', '760001', 4, '2025-06-29 18:00:00', '2025-06-28 17:30:00', 'TRACK046', 'Dejar paquete en conserjería.'),
(47, 47, '2025-06-25 13:15:00', 140.00, 2, 'Calle 50 #80-90', 'Pereira', '660001', 3, '2025-06-30 14:00:00', NULL, 'TRACK047', 'Llamar antes de entregar.'),
(48, 48, '2025-06-26 11:50:00', 230.00, 3, 'Calle 40 #60-70', 'Medellín', '050021', 2, '2025-07-01 16:00:00', NULL, 'TRACK048', 'Verificar cantidad antes de envío.'),
(49, 49, '2025-06-27 12:40:00', 270.50, 4, 'Av 25 #20-30', 'Neiva', '410001', 1, '2025-07-02 19:00:00', NULL, 'TRACK049', 'Confirmar antes de enviar.'),
(50, 50, '2025-06-28 09:00:00', 160.00, 5, 'Calle 110 #25-35', 'Manizales', '170001', 5, '2025-07-03 17:00:00', '2025-07-03 16:40:00', 'TRACK050', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles`
--

CREATE TABLE `perfiles` (
  `id_perfil` int(11) NOT NULL,
  `id_usuario` bigint(20) DEFAULT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `biografia` text DEFAULT NULL,
  `url_foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pqrs`
--

CREATE TABLE `pqrs` (
  `id_pqrs` bigint(20) NOT NULL,
  `id_usuario` bigint(20) NOT NULL,
  `id_tipo_pqrs` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `id_estado_pqrs` int(11) NOT NULL,
  `fecha_ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `respuesta_administrador` text DEFAULT NULL,
  `id_administrador_respuesta` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pqrs`
--

INSERT INTO `pqrs` (`id_pqrs`, `id_usuario`, `id_tipo_pqrs`, `asunto`, `descripcion`, `fecha_creacion`, `id_estado_pqrs`, `fecha_ultima_actualizacion`, `respuesta_administrador`, `id_administrador_respuesta`) VALUES
(1, 1, 1, 'Consulta sobre envío', '¿Cuánto tarda el envío a Medellín?', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'El envío tarda entre 3-5 días hábiles.', 11),
(2, 2, 2, 'Problema con el pago', 'Mi pago fue rechazado y el dinero descontado.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(3, 3, 3, 'Reclamo por producto dañado', 'Recibí el producto en mal estado, solicito cambio.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(4, 4, 4, 'Sugerencia para app', 'Sería útil una sección para valorar productos.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Gracias por su sugerencia, la evaluaremos.', 12),
(5, 5, 1, 'Petición de factura', 'Por favor, envíen la factura de mi compra.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Factura enviada al correo.', 13),
(6, 6, 2, 'Queja por retraso', 'El pedido no llegó en el tiempo indicado.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(7, 7, 1, 'Consulta sobre garantía', '¿Cuánto dura la garantía de los productos?', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'La garantía es de 6 meses.', 14),
(8, 8, 3, 'Reclamo por mal servicio', 'El soporte no respondió mi llamada.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(9, 9, 4, 'Sugerencia para nuevos productos', 'Agregar productos orgánicos locales.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Tomamos en cuenta su sugerencia.', 15),
(10, 10, 2, 'Problema con el cobro', 'Me cobraron doble por un pedido.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(11, 11, 1, 'Petición de cambio de dirección', 'Necesito cambiar la dirección de entrega.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Dirección actualizada correctamente.', 16),
(12, 12, 4, 'Sugerencia de mejora', 'Incluir más métodos de pago.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Estamos trabajando en ello.', 17),
(13, 13, 2, 'Queja por producto equivocado', 'Recibí un producto diferente al pedido.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(14, 14, 3, 'Reclamo por retraso en entrega', 'El pedido llegó con retraso.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(15, 15, 1, 'Consulta sobre promociones', '¿Cuándo habrá promociones?', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Las promociones son mensuales.', 18),
(16, 16, 4, 'Sugerencia para la app móvil', 'Agregar notificaciones push.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Gracias por la sugerencia.', 19),
(17, 17, 2, 'Queja por cancelación de pedido', 'Cancelaron mi pedido sin aviso.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(18, 18, 1, 'Petición de soporte', 'Necesito ayuda con mi cuenta.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Soporte contactado.', 20),
(19, 19, 3, 'Reclamo por producto dañado', 'Producto llegó roto.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(20, 20, 4, 'Sugerencia sobre embalaje', 'Usar embalaje ecológico.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Evaluaremos esta opción.', 11),
(21, 21, 2, 'Queja por falta de stock', 'No había stock del producto.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(22, 22, 1, 'Petición de información', 'Detalles sobre el producto X.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Información enviada.', 12),
(23, 23, 3, 'Reclamo por mala atención', 'Personal poco amable.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(24, 24, 4, 'Sugerencia para el sitio web', 'Mejorar la búsqueda.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Gracias, lo consideraremos.', 13),
(25, 25, 2, 'Queja por error en factura', 'Factura con datos erróneos.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(26, 26, 1, 'Petición de devolución', 'Solicito devolución de producto.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Proceso de devolución iniciado.', 14),
(27, 27, 3, 'Reclamo por retraso en respuesta', 'No contestan mis mensajes.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(28, 28, 4, 'Sugerencia para atención al cliente', 'Chat en vivo 24/7.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Evaluamos la implementación.', 15),
(29, 29, 2, 'Queja por problemas técnicos', 'La app se cierra sola.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(30, 30, 3, 'Reclamo por cobro extra', 'Me cobraron un monto diferente al indicado.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(31, 31, 1, 'Consulta sobre nuevos productos', '¿Tendrán más productos orgánicos?', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Sí, estamos trabajando en nuevos productos.', 21),
(32, 32, 2, 'Problema con la cuenta', 'No puedo acceder a mi cuenta, la contraseña no funciona.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(33, 33, 3, 'Reclamo por mal estado del empaque', 'El paquete llegó roto, necesito un reemplazo.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(34, 34, 4, 'Sugerencia para mejorar la app', 'Sería útil poder guardar productos en favoritos.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Gracias por la sugerencia, la tomaremos en cuenta.', 22),
(35, 35, 1, 'Petición de factura de compra', 'Solicito factura por mi compra reciente.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'La factura fue enviada a su correo.', 23),
(36, 36, 2, 'Queja por pedido incompleto', 'Faltó un producto en mi pedido.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(37, 37, 1, 'Consulta sobre garantías extendidas', '¿Puedo extender la garantía de mi compra?', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'No ofrecemos garantías extendidas por el momento.', 24),
(38, 38, 3, 'Reclamo por mala atención al cliente', 'El soporte no fue de ayuda, me colgaron.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(39, 39, 4, 'Sugerencia para productos sostenibles', 'Agregar más productos ecológicos.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Tomaremos en cuenta su sugerencia.', 25),
(40, 40, 2, 'Problema con la suscripción', 'No me llegan los correos con descuentos.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(41, 41, 1, 'Petición de reembolso', 'Solicito un reembolso por un pedido no entregado.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Reembolso procesado y enviado a su cuenta.', 26),
(42, 42, 4, 'Sugerencia de mejora para el sitio web', 'La página de pagos es muy lenta.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Gracias por su sugerencia, la estamos revisando.', 27),
(43, 43, 2, 'Queja por mal servicio de entrega', 'El pedido llegó tarde y en mal estado.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(44, 44, 1, 'Consulta sobre productos en oferta', '¿Cuáles son los productos en descuento este mes?', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'Puede consultar los productos en oferta en nuestra página.', 28),
(45, 45, 3, 'Reclamo por artículos faltantes en el paquete', 'Recibí menos productos de los que pedí.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(46, 46, 4, 'Sugerencia para mejorar la búsqueda de productos', 'Incluir filtros por precio en la búsqueda.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Agradecemos su sugerencia, la estamos evaluando.', 29),
(47, 47, 2, 'Queja por error en el cobro', 'Me cobraron más de lo que indicaba el carrito.', '2025-09-14 21:00:11', 2, '2025-09-14 21:00:11', NULL, NULL),
(48, 48, 1, 'Petición de cambio de producto', 'Quisiera cambiar un producto que no me gusta.', '2025-09-14 21:00:11', 3, '2025-09-14 21:00:11', 'El proceso de cambio está en marcha.', 30),
(49, 49, 3, 'Reclamo por mala calidad del producto', 'El producto no es como esperaba, tiene defectos.', '2025-09-14 21:00:11', 1, '2025-09-14 21:00:11', NULL, NULL),
(50, 50, 4, 'Sugerencia para la app móvil', 'Sería útil poder realizar seguimiento de los pedidos.', '2025-09-14 21:00:11', 4, '2025-09-14 21:00:11', 'Gracias por la sugerencia, lo tomaremos en cuenta.', 31);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` bigint(20) NOT NULL,
  `nombre_producto` varchar(200) NOT NULL,
  `descripcion_producto` text DEFAULT NULL,
  `precio_unitario` decimal(10,3) NOT NULL,
  `unidad_medida` varchar(50) NOT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `id_SubCategoria` int(11) NOT NULL,
  `id_usuario` bigint(20) DEFAULT NULL,
  `estado_producto` varchar(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_ultima_modificacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre_producto`, `descripcion_producto`, `precio_unitario`, `unidad_medida`, `url_imagen`, `id_SubCategoria`, `id_usuario`, `estado_producto`, `fecha_creacion`, `fecha_ultima_modificacion`, `cantidad`) VALUES
(1, 'Carne Molida Especial ', 'Carne de res magra, ideal para guisos y hamburguesas.', 15.500, 'kg', 'https://cdn.pixabay.com/photo/2021/10/18/09/45/ground-beef-6720584_1280.jpg', 3, 52, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:22:02', 24),
(2, 'Bistec de Res', 'Cortes seleccionados de res, perfectos para asar.', 18.750, 'kg', 'https://placehold.co/200x200/C70039/FFFFFF?text=BistecRes', 3, 52, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:22:50', 3),
(3, 'Pechuga de Pollo', 'Pechuga de pollo fresca, sin hueso ni piel.', 12.200, 'kg', 'https://placehold.co/200x200/900C3F/FFFFFF?text=PechugaPollo', 2, 52, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:22:55', NULL),
(4, 'Muslos de Pollo', 'Muslos de pollo con piel y hueso, ideales para hornear.', 9.800, 'kg', 'https://placehold.co/200x200/581845/FFFFFF?text=MuslosPollo', 2, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(5, 'Naranjas Jugosas', 'Naranjas frescas y dulces, perfectas para jugo.', 3.500, 'kg', 'https://placehold.co/200x200/FFC300/000000?text=Naranjas', 5, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(6, 'Limones Verdes', 'Limones ácidos, ideales para bebidas y cocina.', 2.100, 'kg', 'https://placehold.co/200x200/DAF7A6/000000?text=Limones', 5, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(7, 'Arroz Blanco', 'Arroz de grano largo, básico en la cocina.', 4.100, 'kg', 'http://localhost:3000/images/Banano.jpeg', 9, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', 1),
(8, 'Avena en Hojuelas', 'Avena integral para desayunos y repostería.', 6.700, 'unidad', 'https://placehold.co/200x200/87CEEB/000000?text=Avena', 9, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(9, 'Huevos Criollos (Docena)', 'Huevos de gallina criolla, frescos y de granja.', 10.000, 'docena', 'https://placehold.co/200x200/FFD700/000000?text=Huevos', 10, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(10, 'Leche Entera UHT', 'Leche de vaca entera, larga duración.', 4.500, 'litro', 'https://placehold.co/200x200/ADD8E6/000000?text=Leche', 12, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(11, 'Papa Pastusa', 'Papa de tamaño mediano, ideal para todo uso.', 2.800, 'kg', 'https://placehold.co/200x200/8B4513/FFFFFF?text=Papa', 14, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL),
(12, 'Lechuga Romana', 'Lechuga fresca de hojas crujientes.', 1.500, 'unidad', 'https://placehold.co/200x200/3CB371/FFFFFF?text=Lechuga', 17, 3, 'Activo', '2025-09-14 21:00:10', '2025-09-28 11:06:23', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_descuento`
--

CREATE TABLE `producto_descuento` (
  `id_producto` bigint(20) NOT NULL,
  `id_descuento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_descuento`
--

INSERT INTO `producto_descuento` (`id_producto`, `id_descuento`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_imagenes`
--

CREATE TABLE `producto_imagenes` (
  `id_imagen` bigint(20) NOT NULL,
  `id_producto` bigint(20) NOT NULL,
  `url_imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_imagenes`
--

INSERT INTO `producto_imagenes` (`id_imagen`, `id_producto`, `url_imagen`) VALUES
(1, 1, 'https://cdn.pixabay.com/photo/2020/09/20/11/25/meat-5586849_1280.jpg'),
(2, 1, 'https://cdn.pixabay.com/photo/2024/01/09/14/44/cow-8497722_1280.jpg'),
(3, 1, 'https://cdn.pixabay.com/photo/2018/02/08/15/02/meat-3139641_1280.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_oferta`
--

CREATE TABLE `producto_oferta` (
  `id_producto` bigint(20) NOT NULL,
  `id_oferta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_oferta`
--

INSERT INTO `producto_oferta` (`id_producto`, `id_oferta`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion_rol` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `descripcion_rol`) VALUES
(1, 'cliente', 'Persona que consume productos o servicios.'),
(2, 'administrador', 'Encargado de la administración del sistema.'),
(3, 'agricultor', 'Persona dedicada a la agricultura.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria`
--

CREATE TABLE `subcategoria` (
  `id_SubCategoria` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subcategoria`
--

INSERT INTO `subcategoria` (`id_SubCategoria`, `nombre`, `id_categoria`) VALUES
(1, 'Carne de cerdo', 1),
(2, 'Carne de pollo', 1),
(3, 'Carne de res', 1),
(4, 'Pescado', 1),
(5, 'Cítricos', 2),
(6, 'Frutas dulces', 2),
(7, 'Frutas exóticas', 2),
(8, 'Leguminosas', 3),
(9, 'Cereales', 3),
(10, 'Huevos criollos', 4),
(11, 'Quesos', 5),
(12, 'Leche', 5),
(13, 'Yogures', 5),
(14, 'Papa', 6),
(15, 'Yuca', 6),
(16, 'Ñame', 6),
(17, 'Hojas verdes', 7),
(18, 'Raíces', 7),
(19, 'Flores comestibles', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pqrs`
--

CREATE TABLE `tipo_pqrs` (
  `id_tipo_pqrs` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_pqrs`
--

INSERT INTO `tipo_pqrs` (`id_tipo_pqrs`, `nombre_tipo`) VALUES
(1, 'Petición'),
(2, 'Queja'),
(3, 'Reclamo'),
(4, 'Sugerencia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `correo_electronico` varchar(150) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `documento_identidad` varchar(50) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `password_hash`, `correo_electronico`, `id_rol`, `documento_identidad`, `estado`) VALUES
(1, 'juan.ramirez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'juan.ramirez@example.com', 1, '100000021', 'Activo'),
(2, 'sofia.gomez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'sofia.gomez@example.com', 1, '100000022', 'Activo'),
(3, 'andres.morales', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'andres.morales@example.com', 1, '100000023', 'Activo'),
(4, 'paola.salazar', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'paola.salazar@example.com', 1, '100000024', 'Activo'),
(5, 'jose.figueroa', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'jose.figueroa@example.com', 1, '100000025', 'Activo'),
(6, 'marta.palomino', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'marta.palomino@example.com', 1, '100000026', 'Activo'),
(7, 'luis.mendoza', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'luis.mendoza@example.com', 1, '100000027', 'Activo'),
(8, 'marcela.romero', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'marcela.romero@example.com', 1, '100000028', 'Activo'),
(9, 'laura.gomez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'laura.gomez@example.com', 1, '100000001', 'Activo'),
(10, 'carlos.perez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'carlos.perez@example.com', 1, '100000002', 'Activo'),
(11, 'maria.rojas', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'maria.rojas@example.com', 1, '100000003', 'Activo'),
(12, 'julian.martinez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'julian.martinez@example.com', 1, '100000004', 'Activo'),
(13, 'sandra.nieves', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'sandra.nieves@example.com', 1, '100000005', 'Activo'),
(14, 'fernando.soto', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'fernando.soto@example.com', 1, '100000006', 'Activo'),
(15, 'luisa.moreno', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'luisa.moreno@example.com', 1, '100000007', 'Activo'),
(16, 'ricardo.diaz', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'ricardo.diaz@example.com', 1, '100000008', 'Activo'),
(17, 'natalia.ospina', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'natalia.ospina@example.com', 1, '100000009', 'Activo'),
(18, 'diego.castillo', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'diego.castillo@example.com', 1, '100000010', 'Activo'),
(19, 'admin.juana', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'juana.admin@example.com', 2, '200000001', 'Activo'),
(20, 'admin.luis', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'luis.admin@example.com', 2, '200000002', 'Activo'),
(21, 'admin.monica', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'monica.admin@example.com', 2, '200000003', 'Activo'),
(22, 'admin.esteban', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'esteban.admin@example.com', 2, '200000004', 'Activo'),
(23, 'admin.camila', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'camila.admin@example.com', 2, '200000005', 'Activo'),
(24, 'admin.david', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'david.admin@example.com', 2, '200000006', 'Activo'),
(25, 'admin.andrea', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'andrea.admin@example.com', 2, '200000007', 'Activo'),
(26, 'admin.sebastian', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'sebastian.admin@example.com', 2, '200000008', 'Activo'),
(27, 'admin.ana', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'ana.admin@example.com', 2, '200000009', 'Activo'),
(28, 'admin.jorge', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'jorge.admin@example.com', 2, '200000010', 'Activo'),
(29, 'admin.mario', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'mario.admin@example.com', 2, '200000021', 'Activo'),
(30, 'admin.tamara', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'tamara.admin@example.com', 2, '200000022', 'Activo'),
(31, 'admin.ricardo', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'ricardo.admin@example.com', 2, '200000023', 'Activo'),
(32, 'admin.carmen', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'carmen.admin@example.com', 2, '200000024', 'Activo'),
(33, 'javier', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'javier.agro@example.com', 3, '300000001', 'Activo'),
(34, 'elena', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'elena.agro@example.com', 3, '300000002', 'Activo'),
(35, 'andres', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'andres.agro@example.com', 3, '300000003', 'Activo'),
(36, 'sofia', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'sofia.agro@example.com', 3, '300000004', 'Activo'),
(37, 'mateo', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'mateo.agro@example.com', 3, '300000005', 'Activo'),
(38, 'valentina', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'valentina.agro@example.com', 3, '300000006', 'Activo'),
(39, 'cristian', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'cristian.agro@example.com', 3, '300000007', 'Activo'),
(40, 'isabela', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'isabela.agro@example.com', 3, '300000008', 'Activo'),
(41, 'felipe', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'felipe.agro@example.com', 3, '300000009', 'Activo'),
(42, 'daniela', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'daniela.agro@example.com', 3, '300000010', 'Activo'),
(43, 'ana.martinez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'ana.martinez@example.com', 3, '300000021', 'Activo'),
(44, 'lucas.gomez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'lucas.gomez@example.com', 3, '300000022', 'Activo'),
(45, 'jorge.figueroa', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'jorge.figueroa@example.com', 3, '300000023', 'Activo'),
(46, 'carolina.sanchez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'carolina.sanchez@example.com', 3, '300000024', 'Activo'),
(47, 'camilo.rodriguez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'camilo.rodriguez@example.com', 3, '300000025', 'Activo'),
(48, 'veronica.paredes', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'veronica.paredes@example.com', 3, '300000026', 'Activo'),
(49, 'pedro.gonzalez', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'pedro.gonzalez@example.com', 3, '300000027', 'Activo'),
(50, 'mariana.morales', '0530e0d1838430054034151bbc8a67fa1d5db9c9', 'mariana.morales@example.com', 3, '300000028', 'Activo'),
(51, 'Juan Suarez', 'bd4b67accb1f47a860c9d70b5684752722edb435', 'jZuares@example.com', 1, '12005678', 'Activo'),
(52, '1234', '', 'juliana@gmail.com', 3, '1024482979', 'activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre_categoria` (`nombre_categoria`);

--
-- Indices de la tabla `categoria_descuento`
--
ALTER TABLE `categoria_descuento`
  ADD PRIMARY KEY (`id_categoria`,`id_descuento`),
  ADD KEY `id_descuento` (`id_descuento`);

--
-- Indices de la tabla `categoria_oferta`
--
ALTER TABLE `categoria_oferta`
  ADD PRIMARY KEY (`id_categoria`,`id_oferta`),
  ADD KEY `id_oferta` (`id_oferta`);

--
-- Indices de la tabla `comentario_resena`
--
ALTER TABLE `comentario_resena`
  ADD PRIMARY KEY (`id_comentario_resena`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_administrador_moderador` (`id_administrador_moderador`);

--
-- Indices de la tabla `descuentos`
--
ALTER TABLE `descuentos`
  ADD PRIMARY KEY (`id_descuento`),
  ADD UNIQUE KEY `codigo_descuento` (`codigo_descuento`);

--
-- Indices de la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD PRIMARY KEY (`id_detalle_carrito`),
  ADD UNIQUE KEY `id_carrito` (`id_carrito`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id_detalle_pedido`),
  ADD UNIQUE KEY `id_pedido` (`id_pedido`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
  ADD PRIMARY KEY (`id_estado_pedido`),
  ADD UNIQUE KEY `nombre_estado` (`nombre_estado`);

--
-- Indices de la tabla `estado_pqrs`
--
ALTER TABLE `estado_pqrs`
  ADD PRIMARY KEY (`id_estado_pqrs`),
  ADD UNIQUE KEY `nombre_estado` (`nombre_estado`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `id_producto` (`id_producto`,`id_agricultor`),
  ADD KEY `id_agricultor` (`id_agricultor`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodo_pago`),
  ADD UNIQUE KEY `nombre_metodo` (`nombre_metodo`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id_oferta`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD UNIQUE KEY `numero_seguimiento` (`numero_seguimiento`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`),
  ADD KEY `id_estado_pedido` (`id_estado_pedido`);

--
-- Indices de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  ADD PRIMARY KEY (`id_perfil`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD PRIMARY KEY (`id_pqrs`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_tipo_pqrs` (`id_tipo_pqrs`),
  ADD KEY `id_estado_pqrs` (`id_estado_pqrs`),
  ADD KEY `id_administrador_respuesta` (`id_administrador_respuesta`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_SubCategoria` (`id_SubCategoria`),
  ADD KEY `idx_producto_usuario` (`id_usuario`);

--
-- Indices de la tabla `producto_descuento`
--
ALTER TABLE `producto_descuento`
  ADD PRIMARY KEY (`id_producto`,`id_descuento`),
  ADD KEY `id_descuento` (`id_descuento`);

--
-- Indices de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `producto_oferta`
--
ALTER TABLE `producto_oferta`
  ADD PRIMARY KEY (`id_producto`,`id_oferta`),
  ADD KEY `id_oferta` (`id_oferta`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD PRIMARY KEY (`id_SubCategoria`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `tipo_pqrs`
--
ALTER TABLE `tipo_pqrs`
  ADD PRIMARY KEY (`id_tipo_pqrs`),
  ADD UNIQUE KEY `nombre_tipo` (`nombre_tipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `comentario_resena`
--
ALTER TABLE `comentario_resena`
  MODIFY `id_comentario_resena` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `descuentos`
--
ALTER TABLE `descuentos`
  MODIFY `id_descuento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  MODIFY `id_detalle_carrito` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id_detalle_pedido` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
  MODIFY `id_estado_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estado_pqrs`
--
ALTER TABLE `estado_pqrs`
  MODIFY `id_estado_pqrs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id_oferta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  MODIFY `id_perfil` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  MODIFY `id_pqrs` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  MODIFY `id_imagen` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  MODIFY `id_SubCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `tipo_pqrs`
--
ALTER TABLE `tipo_pqrs`
  MODIFY `id_tipo_pqrs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `categoria_descuento`
--
ALTER TABLE `categoria_descuento`
  ADD CONSTRAINT `categoria_descuento_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `categoria_descuento_ibfk_2` FOREIGN KEY (`id_descuento`) REFERENCES `descuentos` (`id_descuento`);

--
-- Filtros para la tabla `categoria_oferta`
--
ALTER TABLE `categoria_oferta`
  ADD CONSTRAINT `categoria_oferta_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `categoria_oferta_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id_oferta`);

--
-- Filtros para la tabla `comentario_resena`
--
ALTER TABLE `comentario_resena`
  ADD CONSTRAINT `comentario_resena_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `comentario_resena_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `comentario_resena_ibfk_3` FOREIGN KEY (`id_administrador_moderador`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD CONSTRAINT `detalle_carrito_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`),
  ADD CONSTRAINT `detalle_carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`id_agricultor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  ADD CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`id_estado_pedido`) REFERENCES `estado_pedido` (`id_estado_pedido`);

--
-- Filtros para la tabla `perfiles`
--
ALTER TABLE `perfiles`
  ADD CONSTRAINT `perfiles_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD CONSTRAINT `pqrs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `pqrs_ibfk_2` FOREIGN KEY (`id_tipo_pqrs`) REFERENCES `tipo_pqrs` (`id_tipo_pqrs`),
  ADD CONSTRAINT `pqrs_ibfk_3` FOREIGN KEY (`id_estado_pqrs`) REFERENCES `estado_pqrs` (`id_estado_pqrs`),
  ADD CONSTRAINT `pqrs_ibfk_4` FOREIGN KEY (`id_administrador_respuesta`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_SubCategoria`) REFERENCES `subcategoria` (`id_SubCategoria`);

--
-- Filtros para la tabla `producto_descuento`
--
ALTER TABLE `producto_descuento`
  ADD CONSTRAINT `producto_descuento_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `producto_descuento_ibfk_2` FOREIGN KEY (`id_descuento`) REFERENCES `descuentos` (`id_descuento`);

--
-- Filtros para la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD CONSTRAINT `producto_imagenes_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `producto_oferta`
--
ALTER TABLE `producto_oferta`
  ADD CONSTRAINT `producto_oferta_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `producto_oferta_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id_oferta`);

--
-- Filtros para la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD CONSTRAINT `subcategoria_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
