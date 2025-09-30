create database Agrosoft;
use Agrosoft;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion_rol TEXT
);

CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, 
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,
    id_rol INT NOT NULL,
    documento_identidad VARCHAR(50) UNIQUE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE SubCategoria(
	id_SubCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    id_categoria int,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) on DELETE CASCADE
);
CREATE TABLE producto (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(200) NOT NULL,
    descripcion_producto TEXT,
    precio_unitario DECIMAL(10, 3) NOT NULL,
    unidad_medida VARCHAR(50) NOT NULL, 
    url_imagen VARCHAR(255),
    id_SubCategoria INT NOT NULL,
    estado_producto VARCHAR(20) NOT NULL, 
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_SubCategoria) REFERENCES SubCategoria (id_SubCategoria)
);

CREATE TABLE inventario (
    id_inventario BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    id_agricultor BIGINT, 
    vendido int not null default 0,
    fecha_Compra datetime default null,
    cantidad_disponible INT NOT NULL DEFAULT 0,
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ubicacion_almacenamiento VARCHAR(255),
    UNIQUE (id_producto, id_agricultor), -- Restricción: un agricultor solo tiene un registro de inventario por producto
    FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
    FOREIGN KEY (id_agricultor) REFERENCES usuarios(id_usuario)
);


CREATE TABLE carrito (
    id_carrito BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE, -- Un usuario tiene un único carrito activo
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado_carrito VARCHAR(20) NOT NULL, -- 'Activo', 'Completado', 'Abandonado'
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);


CREATE TABLE detalle_carrito (
    id_detalle_carrito BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_carrito BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario_al_momento DECIMAL(10, 3) NOT NULL,
    subtotal DECIMAL(10, 3) NOT NULL,
    UNIQUE (id_carrito, id_producto), -- Un producto solo aparece una vez por carrito
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);


CREATE TABLE tipo_pqrs (
    id_tipo_pqrs INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE --  'Petición', 'Queja', 'Reclamo', 'Sugerencia'
);


CREATE TABLE estado_pqrs (
    id_estado_pqrs INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE -- 'Pendiente', 'En Progreso', 'Resuelto', 'Cerrado'
);


CREATE TABLE pqrs (
    id_pqrs BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL, -- Usuario que envía la PQR
    id_tipo_pqrs INT NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado_pqrs INT NOT NULL,
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    respuesta_administrador TEXT,
    id_administrador_respuesta BIGINT, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_tipo_pqrs) REFERENCES tipo_pqrs(id_tipo_pqrs),
    FOREIGN KEY (id_estado_pqrs) REFERENCES estado_pqrs(id_estado_pqrs),
    FOREIGN KEY (id_administrador_respuesta) REFERENCES usuarios(id_usuario)
);


CREATE TABLE descuentos (
    id_descuento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_descuento VARCHAR(100) NOT NULL,
    tipo_descuento VARCHAR(20) NOT NULL, 
    valor_descuento DECIMAL(5, 2) NOT NULL, 
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    codigo_descuento VARCHAR(50) UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);


CREATE TABLE ofertas (
    id_oferta INT AUTO_INCREMENT PRIMARY KEY,
    nombre_oferta VARCHAR(100) NOT NULL,
    descripcion_oferta TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    tipo_oferta VARCHAR(50) NOT NULL, 
    activo BOOLEAN NOT NULL DEFAULT TRUE
);


CREATE TABLE producto_descuento (
    id_producto BIGINT NOT NULL,
    id_descuento INT NOT NULL,
    PRIMARY KEY (id_producto, id_descuento), 
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_descuento) REFERENCES descuentos(id_descuento)
);


CREATE TABLE producto_oferta (
    id_producto BIGINT NOT NULL,
    id_oferta INT NOT NULL,
    PRIMARY KEY (id_producto, id_oferta), 
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
);


CREATE TABLE categoria_descuento (
    id_categoria INT NOT NULL,
    id_descuento INT NOT NULL,
    PRIMARY KEY (id_categoria, id_descuento), 
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_descuento) REFERENCES descuentos(id_descuento)
);


CREATE TABLE categoria_oferta (
    id_categoria INT NOT NULL,
    id_oferta INT NOT NULL,
    PRIMARY KEY (id_categoria, id_oferta),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
);

CREATE TABLE estado_pedido (
    id_estado_pedido INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE 
);

CREATE TABLE metodo_pago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre_metodo VARCHAR(100) NOT NULL UNIQUE 
);


CREATE TABLE pedidos (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL, 
    fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_pedido DECIMAL(10, 2) NOT NULL,
    id_metodo_pago INT NOT NULL,
    direccion_envio VARCHAR(255) NOT NULL,
    ciudad_envio VARCHAR(100) NOT NULL,
    codigo_postal_envio VARCHAR(20),
    id_estado_pedido INT NOT NULL,
    fecha_entrega_estimada DATETIME,
    fecha_entrega_real DATETIME,
    numero_seguimiento VARCHAR(100) UNIQUE,
    notas_pedido TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago),
    FOREIGN KEY (id_estado_pedido) REFERENCES estado_pedido(id_estado_pedido)
);

CREATE TABLE detalle_pedido (
    id_detalle_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario_al_momento DECIMAL(10, 3) NOT NULL,
    subtotal DECIMAL(10, 3) NOT NULL,
    descuento_aplicado_monto DECIMAL(10, 3) DEFAULT 0.00,
    UNIQUE (id_pedido, id_producto), 
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE comentario_resena (
    id_comentario_resena BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    calificacion INT, 
    texto_comentario TEXT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_comentario VARCHAR(20) NOT NULL, 
    id_administrador_moderador BIGINT, 
    CHECK (calificacion >= 1 AND calificacion <= 5 OR calificacion IS NULL), 
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_administrador_moderador) REFERENCES usuarios(id_usuario)
);

INSERT INTO roles (nombre_rol, descripcion_rol) VALUES
('cliente', 'Persona que consume productos o servicios.'),
('administrador', 'Encargado de la administración del sistema.'),
('agricultor', 'Persona dedicada a la agricultura.');

INSERT INTO usuarios (
    nombre_usuario,
    password_hash,
    correo_electronico,
    id_rol,
    documento_identidad
) VALUES

('juan.ramirez', SHA1('micontrasena'), 'juan.ramirez@example.com', 1, '100000021'),
('sofia.gomez', SHA1('micontrasena'), 'sofia.gomez@example.com', 1, '100000022'),
('andres.morales', SHA1('micontrasena'), 'andres.morales@example.com', 1,'100000023'),
('paola.salazar', SHA1('micontrasena'), 'paola.salazar@example.com', 1,  '100000024'),
('jose.figueroa', SHA1('micontrasena'), 'jose.figueroa@example.com', 1,  '100000025'),
('marta.palomino', SHA1('micontrasena'), 'marta.palomino@example.com', 1, '100000026'),
('luis.mendoza', SHA1('micontrasena'), 'luis.mendoza@example.com', 1,  '100000027'),
('marcela.romero', SHA1('micontrasena'), 'marcela.romero@example.com', 1, '100000028'),
('laura.gomez', SHA1('micontrasena'), 'laura.gomez@example.com', 1,  '100000001'),
('carlos.perez', SHA1('micontrasena'), 'carlos.perez@example.com', 1, '100000002'),
('maria.rojas', SHA1('micontrasena'), 'maria.rojas@example.com', 1,  '100000003'),
('julian.martinez', SHA1('micontrasena'), 'julian.martinez@example.com', 1, '100000004'),
('sandra.nieves', SHA1('micontrasena'), 'sandra.nieves@example.com', 1, '100000005'),
('fernando.soto', SHA1('micontrasena'), 'fernando.soto@example.com', 1,  '100000006'),
('luisa.moreno', SHA1('micontrasena'), 'luisa.moreno@example.com', 1, '100000007'),
('ricardo.diaz', SHA1('micontrasena'), 'ricardo.diaz@example.com', 1, '100000008'),
('natalia.ospina', SHA1('micontrasena'), 'natalia.ospina@example.com', 1, '100000009'),
('diego.castillo', SHA1('micontrasena'), 'diego.castillo@example.com', 1, '100000010'),

('admin.juana', SHA1('micontrasena'), 'juana.admin@example.com', 2,  '200000001'),
('admin.luis', SHA1('micontrasena'), 'luis.admin@example.com', 2,'200000002'),
('admin.monica', SHA1('micontrasena'), 'monica.admin@example.com', 2, '200000003'),
('admin.esteban', SHA1('micontrasena'), 'esteban.admin@example.com', 2,  '200000004'),
('admin.camila', SHA1('micontrasena'), 'camila.admin@example.com', 2,  '200000005'),
('admin.david', SHA1('micontrasena'), 'david.admin@example.com', 2,  '200000006'),
('admin.andrea', SHA1('micontrasena'), 'andrea.admin@example.com', 2,'200000007'),
('admin.sebastian', SHA1('micontrasena'), 'sebastian.admin@example.com', 2,  '200000008'),
('admin.ana', SHA1('micontrasena'), 'ana.admin@example.com', 2,  '200000009'),
('admin.jorge', SHA1('micontrasena'), 'jorge.admin@example.com', 2,  '200000010'),
('admin.mario', SHA1('micontrasena'), 'mario.admin@example.com', 2, '200000021'),
('admin.tamara', SHA1('micontrasena'), 'tamara.admin@example.com', 2, '200000022'),
('admin.ricardo', SHA1('micontrasena'), 'ricardo.admin@example.com', 2,  '200000023'),
('admin.carmen', SHA1('micontrasena'), 'carmen.admin@example.com', 2,  '200000024'),


('javier', SHA1('micontrasena'), 'javier.agro@example.com', 3,'300000001'),
('elena', SHA1('micontrasena'), 'elena.agro@example.com', 3, '300000002'),
('andres', SHA1('micontrasena'), 'andres.agro@example.com', 3, '300000003'),
('sofia', SHA1('micontrasena'), 'sofia.agro@example.com', 3,  '300000004'),
('mateo', SHA1('micontrasena'), 'mateo.agro@example.com', 3,  '300000005'),
('valentina', SHA1('micontrasena'), 'valentina.agro@example.com', 3,  '300000006'),
('cristian', SHA1('micontrasena'), 'cristian.agro@example.com', 3,'300000007'),
('isabela', SHA1('micontrasena'), 'isabela.agro@example.com', 3,  '300000008'),
('felipe', SHA1('micontrasena'), 'felipe.agro@example.com', 3, '300000009'),
('daniela', SHA1('micontrasena'), 'daniela.agro@example.com', 3,  '300000010'),
('ana.martinez', SHA1('micontrasena'), 'ana.martinez@example.com', 3, '300000021'),
('lucas.gomez', SHA1('micontrasena'), 'lucas.gomez@example.com', 3,  '300000022'),
('jorge.figueroa', SHA1('micontrasena'), 'jorge.figueroa@example.com', 3, '300000023'),
('carolina.sanchez', SHA1('micontrasena'), 'carolina.sanchez@example.com', 3, '300000024'),
('camilo.rodriguez', SHA1('micontrasena'), 'camilo.rodriguez@example.com', 3, '300000025'),
('veronica.paredes', SHA1('micontrasena'), 'veronica.paredes@example.com', 3, '300000026'),
('pedro.gonzalez', SHA1('micontrasena'), 'pedro.gonzalez@example.com', 3, '300000027'),
('mariana.morales', SHA1('micontrasena'), 'mariana.morales@example.com', 3,'300000028');

INSERT INTO categorias (nombre_categoria) VALUES
('Carnes'),
('Frutas'),
('Granos'),
('Huevos'),
('Lácteos'),
('Tubérculos'),
('Verduras' );

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Carne de cerdo', 1),
('Carne de pollo', 1),
('Carne de res', 1),
('Pescado', 1);

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Cítricos', 2),
('Frutas dulces', 2),
('Frutas exóticas', 2);

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Leguminosas', 3),
('Cereales', 3);

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Huevos criollos', 4);

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Quesos', 5),
('Leche', 5),
('Yogures', 5);

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Papa', 6),
('Yuca', 6),
('Ñame', 6);

INSERT INTO SubCategoria (nombre, id_categoria) VALUES
('Hojas verdes', 7),
('Raíces', 7),
('Flores comestibles', 7);


INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Carne Molida Especial', 'Carne de res magra, ideal para guisos y hamburguesas.', 15.500, 'kg', 'https://placehold.co/200x200/FF5733/FFFFFF?text=CarneMolida', 3, 'Activo'),
('Bistec de Res', 'Cortes seleccionados de res, perfectos para asar.', 18.750, 'kg', 'https://placehold.co/200x200/C70039/FFFFFF?text=BistecRes', 3, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Pechuga de Pollo', 'Pechuga de pollo fresca, sin hueso ni piel.', 12.200, 'kg', 'https://placehold.co/200x200/900C3F/FFFFFF?text=PechugaPollo', 2, 'Activo'),
('Muslos de Pollo', 'Muslos de pollo con piel y hueso, ideales para hornear.', 9.800, 'kg', 'https://placehold.co/200x200/581845/FFFFFF?text=MuslosPollo', 2, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Naranjas Jugosas', 'Naranjas frescas y dulces, perfectas para jugo.', 3.500, 'kg', 'https://placehold.co/200x200/FFC300/000000?text=Naranjas', 5, 'Activo'),
('Limones Verdes', 'Limones ácidos, ideales para bebidas y cocina.', 2.100, 'kg', 'https://placehold.co/200x200/DAF7A6/000000?text=Limones', 5, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Arroz Blanco', 'Arroz de grano largo, básico en la cocina.', 4.100, 'kg', 'https://placehold.co/200x200/ADD8E6/000000?text=Arroz', 9, 'Activo'),
('Avena en Hojuelas', 'Avena integral para desayunos y repostería.', 6.700, 'unidad', 'https://placehold.co/200x200/87CEEB/000000?text=Avena', 9, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Huevos Criollos (Docena)', 'Huevos de gallina criolla, frescos y de granja.', 10.000, 'docena', 'https://placehold.co/200x200/FFD700/000000?text=Huevos', 10, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Leche Entera UHT', 'Leche de vaca entera, larga duración.', 4.500, 'litro', 'https://placehold.co/200x200/ADD8E6/000000?text=Leche', 12, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Papa Pastusa', 'Papa de tamaño mediano, ideal para todo uso.', 2.800, 'kg', 'https://placehold.co/200x200/8B4513/FFFFFF?text=Papa', 14, 'Activo');
INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto) VALUES
('Lechuga Romana', 'Lechuga fresca de hojas crujientes.', 1.500, 'unidad', 'https://placehold.co/200x200/3CB371/FFFFFF?text=Lechuga', 17, 'Activo');

INSERT INTO inventario(id_producto, id_agricultor, cantidad_disponible, ubicacion_almacenamiento) VALUES
(1, 32, 100, 'Finca El Roble'),
(2, 33, 50, 'Finca El Roble'),
(3, 34, 75, 'Finca El Roble'),
(4, 32, 120, 'Vereda La Esperanza'),
(5, 33, 60, 'Vereda La Esperanza'),
(6, 34, 30, 'Vereda La Esperanza');

INSERT INTO carrito (
  id_usuario,
  fecha_creacion,
  fecha_ultima_actualizacion,
  estado_carrito
) VALUES
(1, '2025-06-01 10:00:00', '2025-06-10 15:00:00', 'Activo'),
(2, '2025-05-20 08:30:00', '2025-06-05 12:45:00', 'Completado'),
(3, '2025-06-02 14:00:00', '2025-06-03 09:00:00', 'Abandonado'),
(4, '2025-06-04 16:30:00', '2025-06-10 18:00:00', 'Activo'),
(5, '2025-05-18 11:00:00', '2025-05-25 10:00:00', 'Completado'),
(6, '2025-06-01 09:15:00', '2025-06-02 08:30:00', 'Abandonado');


INSERT INTO detalle_carrito (
  id_carrito,
  id_producto,
  cantidad,
  precio_unitario_al_momento,
  subtotal
) VALUES
(1, 1, 5, 20.000, 100.000),
(2, 2, 3, 15.500, 46.500),
(3, 3, 1.5, 30.000, 45.000),
(4, 4, 7, 12.000, 84.000),
(5, 5, 2, 50.000, 100.000),
(6, 6, 4, 25.000, 100.000);


INSERT INTO tipo_pqrs (nombre_tipo) VALUES
('Petición'),
('Queja'),
('Reclamo'),
('Sugerencia');

INSERT INTO estado_pqrs (nombre_estado) VALUES
('Pendiente'),
('En Progreso'),
('Resuelto'),
('Cerrado');

INSERT INTO pqrs (
    id_usuario,
    id_tipo_pqrs,
    asunto,
    descripcion,
    id_estado_pqrs,
    respuesta_administrador,
    id_administrador_respuesta
) VALUES
(1, 1, 'Consulta sobre envío', '¿Cuánto tarda el envío a Medellín?', 3, 'El envío tarda entre 3-5 días hábiles.', 11),
(2, 2, 'Problema con el pago', 'Mi pago fue rechazado y el dinero descontado.', 2, NULL, NULL),
(3, 3, 'Reclamo por producto dañado', 'Recibí el producto en mal estado, solicito cambio.', 1, NULL, NULL),
(4, 4, 'Sugerencia para app', 'Sería útil una sección para valorar productos.', 4, 'Gracias por su sugerencia, la evaluaremos.', 12),
(5, 1, 'Petición de factura', 'Por favor, envíen la factura de mi compra.', 3, 'Factura enviada al correo.', 13),
(6, 2, 'Queja por retraso', 'El pedido no llegó en el tiempo indicado.', 2, NULL, NULL),
(7, 1, 'Consulta sobre garantía', '¿Cuánto dura la garantía de los productos?', 3, 'La garantía es de 6 meses.', 14),
(8, 3, 'Reclamo por mal servicio', 'El soporte no respondió mi llamada.', 1, NULL, NULL),
(9, 4, 'Sugerencia para nuevos productos', 'Agregar productos orgánicos locales.', 4, 'Tomamos en cuenta su sugerencia.', 15),
(10, 2, 'Problema con el cobro', 'Me cobraron doble por un pedido.', 2, NULL, NULL),
(11, 1, 'Petición de cambio de dirección', 'Necesito cambiar la dirección de entrega.', 3, 'Dirección actualizada correctamente.', 16),
(12, 4, 'Sugerencia de mejora', 'Incluir más métodos de pago.', 4, 'Estamos trabajando en ello.', 17),
(13, 2, 'Queja por producto equivocado', 'Recibí un producto diferente al pedido.', 2, NULL, NULL),
(14, 3, 'Reclamo por retraso en entrega', 'El pedido llegó con retraso.', 1, NULL, NULL),
(15, 1, 'Consulta sobre promociones', '¿Cuándo habrá promociones?', 3, 'Las promociones son mensuales.', 18),
(16, 4, 'Sugerencia para la app móvil', 'Agregar notificaciones push.', 4, 'Gracias por la sugerencia.', 19),
(17, 2, 'Queja por cancelación de pedido', 'Cancelaron mi pedido sin aviso.', 2, NULL, NULL),
(18, 1, 'Petición de soporte', 'Necesito ayuda con mi cuenta.', 3, 'Soporte contactado.', 20),
(19, 3, 'Reclamo por producto dañado', 'Producto llegó roto.', 1, NULL, NULL),
(20, 4, 'Sugerencia sobre embalaje', 'Usar embalaje ecológico.', 4, 'Evaluaremos esta opción.', 11),
(21, 2, 'Queja por falta de stock', 'No había stock del producto.', 2, NULL, NULL),
(22, 1, 'Petición de información', 'Detalles sobre el producto X.', 3, 'Información enviada.', 12),
(23, 3, 'Reclamo por mala atención', 'Personal poco amable.', 1, NULL, NULL),
(24, 4, 'Sugerencia para el sitio web', 'Mejorar la búsqueda.', 4, 'Gracias, lo consideraremos.', 13),
(25, 2, 'Queja por error en factura', 'Factura con datos erróneos.', 2, NULL, NULL),
(26, 1, 'Petición de devolución', 'Solicito devolución de producto.', 3, 'Proceso de devolución iniciado.', 14),
(27, 3, 'Reclamo por retraso en respuesta', 'No contestan mis mensajes.', 1, NULL, NULL),
(28, 4, 'Sugerencia para atención al cliente', 'Chat en vivo 24/7.', 4, 'Evaluamos la implementación.', 15),
(29, 2, 'Queja por problemas técnicos', 'La app se cierra sola.', 2, NULL, NULL),
(30, 3, 'Reclamo por cobro extra', 'Me cobraron un monto diferente al indicado.', 1, NULL, NULL),
(31, 1, 'Consulta sobre nuevos productos', '¿Tendrán más productos orgánicos?', 3, 'Sí, estamos trabajando en nuevos productos.', 21),
(32, 2, 'Problema con la cuenta', 'No puedo acceder a mi cuenta, la contraseña no funciona.', 2, NULL, NULL),
(33, 3, 'Reclamo por mal estado del empaque', 'El paquete llegó roto, necesito un reemplazo.', 1, NULL, NULL),
(34, 4, 'Sugerencia para mejorar la app', 'Sería útil poder guardar productos en favoritos.', 4, 'Gracias por la sugerencia, la tomaremos en cuenta.', 22),
(35, 1, 'Petición de factura de compra', 'Solicito factura por mi compra reciente.', 3, 'La factura fue enviada a su correo.', 23),
(36, 2, 'Queja por pedido incompleto', 'Faltó un producto en mi pedido.', 2, NULL, NULL),
(37, 1, 'Consulta sobre garantías extendidas', '¿Puedo extender la garantía de mi compra?', 3, 'No ofrecemos garantías extendidas por el momento.', 24),
(38, 3, 'Reclamo por mala atención al cliente', 'El soporte no fue de ayuda, me colgaron.', 1, NULL, NULL),
(39, 4, 'Sugerencia para productos sostenibles', 'Agregar más productos ecológicos.', 4, 'Tomaremos en cuenta su sugerencia.', 25),
(40, 2, 'Problema con la suscripción', 'No me llegan los correos con descuentos.', 2, NULL, NULL),
(41, 1, 'Petición de reembolso', 'Solicito un reembolso por un pedido no entregado.', 3, 'Reembolso procesado y enviado a su cuenta.', 26),
(42, 4, 'Sugerencia de mejora para el sitio web', 'La página de pagos es muy lenta.', 4, 'Gracias por su sugerencia, la estamos revisando.', 27),
(43, 2, 'Queja por mal servicio de entrega', 'El pedido llegó tarde y en mal estado.', 2, NULL, NULL),
(44, 1, 'Consulta sobre productos en oferta', '¿Cuáles son los productos en descuento este mes?', 3, 'Puede consultar los productos en oferta en nuestra página.', 28),
(45, 3, 'Reclamo por artículos faltantes en el paquete', 'Recibí menos productos de los que pedí.', 1, NULL, NULL),
(46, 4, 'Sugerencia para mejorar la búsqueda de productos', 'Incluir filtros por precio en la búsqueda.', 4, 'Agradecemos su sugerencia, la estamos evaluando.', 29),
(47, 2, 'Queja por error en el cobro', 'Me cobraron más de lo que indicaba el carrito.', 2, NULL, NULL),
(48, 1, 'Petición de cambio de producto', 'Quisiera cambiar un producto que no me gusta.', 3, 'El proceso de cambio está en marcha.', 30),
(49, 3, 'Reclamo por mala calidad del producto', 'El producto no es como esperaba, tiene defectos.', 1, NULL, NULL),
(50, 4, 'Sugerencia para la app móvil', 'Sería útil poder realizar seguimiento de los pedidos.', 4, 'Gracias por la sugerencia, lo tomaremos en cuenta.', 31);


INSERT INTO descuentos (
    nombre_descuento, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, codigo_descuento, activo
) VALUES
('Descuento Primavera', 'Porcentaje', 0.150, '2025-03-01 00:00:00', '2025-05-31 23:59:59', 'PRIMAVERA15', TRUE),
('Descuento Verano', 'Porcentaje', 0.200, '2025-06-01 00:00:00', '2025-08-31 23:59:59', 'VERANO20', TRUE),
('Descuento Invierno', 'Monto Fijo', 10.000, '2025-12-01 00:00:00', '2025-12-31 23:59:59', 'INVIERNO10', TRUE),
('Descuento Otoño', 'Porcentaje', 0.100, '2025-09-01 00:00:00', '2025-11-30 23:59:59', 'OTOÑO10', TRUE),
('Descuento Cliente Nuevo', 'Monto Fijo', 5.000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'NUEVO5', TRUE),
('Descuento Festivo', 'Porcentaje', 0.250, '2025-12-24 00:00:00', '2025-12-26 23:59:59', 'FESTIVO25', TRUE),
('Descuento Semana Santa', 'Porcentaje', 0.180, '2025-04-10 00:00:00', '2025-04-20 23:59:59', 'SEMANA18', TRUE),
('Descuento Aniversario', 'Monto Fijo', 15.000, '2025-07-15 00:00:00', '2025-07-20 23:59:59', 'ANIVERSARIO15', TRUE),
('Descuento Black Friday', 'Porcentaje', 0.300, '2025-11-27 00:00:00', '2025-11-29 23:59:59', 'BLACK30', TRUE),
('Descuento Cyber Monday', 'Porcentaje', 0.280, '2025-11-30 00:00:00', '2025-12-01 23:59:59', 'CYBER28', TRUE),
('Descuento Productos Frescos', 'Monto Fijo', 3.000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'FRESCOS3', TRUE),
('Descuento Navidad', 'Porcentaje', 0.220, '2025-12-15 00:00:00', '2025-12-25 23:59:59', 'NAVIDAD22', TRUE),
('Descuento Fin de Semana', 'Monto Fijo', 7.000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'FINSEM7', TRUE),
('Descuento Clientes Frecuentes', 'Porcentaje', 0.120, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'FRECUENTE12', TRUE),
('Descuento Liquidación', 'Porcentaje', 0.400, '2025-06-01 00:00:00', '2025-06-15 23:59:59', 'LIQUIDA40', TRUE);

INSERT INTO ofertas (
    nombre_oferta, descripcion_oferta, fecha_inicio, fecha_fin, tipo_oferta, activo
) VALUES
('Oferta 2x1 Tomates', 'Compra 2 tomates y paga 1.', '2025-05-01 00:00:00', '2025-05-10 23:59:59', '2x1', TRUE),
('Oferta Envío Gratis', 'Envío gratis en compras mayores a $50.', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'Envío Gratis', TRUE),
('Oferta Descuento por Cantidad', '10% de descuento al comprar 10 kg o más.', '2025-03-15 00:00:00', '2025-04-15 23:59:59', 'Descuento por Cantidad', TRUE),
('Oferta Combo Frutas', 'Pack de frutas a precio especial.', '2025-06-01 00:00:00', '2025-06-30 23:59:59', 'Descuento por Cantidad', TRUE),
('Oferta 3x2 Verduras', 'Compra 3 y paga 2.', '2025-07-01 00:00:00', '2025-07-15 23:59:59', '3x2', TRUE),
('Oferta Fin de Semana', 'Descuentos especiales solo fines de semana.', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'Descuento por Cantidad', TRUE),
('Oferta Festival de Cítricos', 'Descuento en todos los cítricos.', '2025-08-01 00:00:00', '2025-08-10 23:59:59', 'Porcentaje', TRUE),
('Oferta Pack de Hierbas', 'Paquete de hierbas frescas con descuento.', '2025-09-01 00:00:00', '2025-09-30 23:59:59', 'Descuento por Cantidad', TRUE),
('Oferta Día del Agricultor', 'Descuento especial para agricultores.', '2025-10-01 00:00:00', '2025-10-05 23:59:59', 'Porcentaje', TRUE),
('Oferta Liquidación de Temporada', 'Últimos productos con descuento.', '2025-11-01 00:00:00', '2025-11-15 23:59:59', 'Monto Fijo', TRUE),
('Oferta Pack Sazonadores', 'Combo de especias a precio rebajado.', '2025-04-01 00:00:00', '2025-04-30 23:59:59', 'Descuento por Cantidad', TRUE),
('Oferta Promo Maíz', 'Maíz en oferta por tiempo limitado.', '2025-02-15 00:00:00', '2025-03-15 23:59:59', 'Porcentaje', TRUE),
('Oferta Frutas Tropicales', 'Descuento en frutas tropicales.', '2025-07-20 00:00:00', '2025-08-20 23:59:59', 'Porcentaje', TRUE),
('Oferta Verduras de Invierno', 'Paquete especial para invierno.', '2025-12-01 00:00:00', '2025-12-31 23:59:59', 'Monto Fijo', TRUE),
('Oferta Semana Verde', 'Descuento en productos verdes.', '2025-04-10 00:00:00', '2025-04-17 23:59:59', 'Descuento por Cantidad', TRUE);

INSERT INTO producto_descuento (id_producto, id_descuento) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6);


INSERT INTO producto_oferta (id_producto, id_oferta) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6);

INSERT INTO categoria_descuento (id_categoria, id_descuento) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 1);


INSERT INTO categoria_oferta (id_categoria, id_oferta) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 1);

INSERT INTO estado_pedido (nombre_estado) VALUES
('Pendiente'),
('Procesando'),
('Enviado'),
('Entregado'),
('Cancelado');

INSERT INTO metodo_pago (nombre_metodo) VALUES
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('PayPal'),
('Transferencia Bancaria'),
('Efectivo al Recibir');

INSERT INTO pedidos (
    id_usuario,
    fecha_pedido,
    total_pedido,
    id_metodo_pago,
    direccion_envio,
    ciudad_envio,
    codigo_postal_envio,
    id_estado_pedido,
    fecha_entrega_estimada,
    fecha_entrega_real,
    numero_seguimiento,
    notas_pedido
) VALUES
(1, '2025-05-10 10:15:00', 150.750, 1, 'Cra 10 #20-30', 'Bogotá', '110111', 4, '2025-05-15 18:00:00', '2025-05-14 17:30:00', 'TRACK001', 'Entregar en horario de oficina.'),
(2, '2025-05-11 11:00:00', 80.000, 2, 'Calle 45 #67-89', 'Medellín', '050021', 3, '2025-05-16 12:00:00', NULL, 'TRACK002', NULL),
(3, '2025-05-12 09:30:00', 200.000, 3, 'Av 3 #12-34', 'Cali', '760001', 2, '2025-05-17 16:00:00', NULL, 'TRACK003', 'Revisar productos antes de enviar.'),
(4, '2025-05-13 14:45:00', 350.500, 4, 'Cra 8 #44-12', 'Barranquilla', '080001', 1, '2025-05-18 19:00:00', NULL, 'TRACK004', 'Cliente pidió factura.'),
(5, '2025-05-14 16:20:00', 120.000, 5, 'Calle 9 #10-11', 'Pereira', '660001', 5, '2025-05-19 17:00:00', '2025-05-19 16:45:00', 'TRACK005', NULL),
(6, '2025-05-15 08:10:00', 450.250, 1, 'Transv 21 #55-32', 'Bucaramanga', '680001', 4, '2025-05-20 15:00:00', '2025-05-19 14:30:00', 'TRACK006', 'Dejar con conserje si no está el cliente.'),
(7, '2025-05-16 12:00:00', 75.000, 2, 'Calle 70 #88-90', 'Cartagena', '130001', 3, '2025-05-21 13:00:00', NULL, 'TRACK007', NULL),
(8, '2025-05-17 13:30:00', 95.000, 3, 'Av 6N #13-14', 'Cúcuta', '540001', 2, '2025-05-22 17:00:00', NULL, 'TRACK008', NULL),
(9, '2025-05-18 15:40:00', 220.000, 4, 'Cra 15 #22-33', 'Ibagué', '730001', 1, '2025-05-23 18:00:00', NULL, 'TRACK009', 'Cliente solicitó llamada previa.'),
(10, '2025-05-19 10:25:00', 130.000, 5, 'Calle 100 #20-10', 'Neiva', '410001', 5, '2025-05-24 16:00:00', '2025-05-24 15:50:00', 'TRACK010', NULL),
(11, '2025-05-20 09:15:00', 300.000, 1, 'Oficina 1', 'Bogotá', '110111', 4, '2025-05-25 18:00:00', '2025-05-24 17:30:00', 'TRACK011', NULL),
(12, '2025-05-21 14:00:00', 50.000, 2, 'Cra 9 #33-22', 'Cali', '760001', 3, '2025-05-26 12:00:00', NULL, 'TRACK012', NULL),
(13, '2025-05-22 08:45:00', 400.000, 3, 'Calle 50 #60-70', 'Medellín', '050021', 2, '2025-05-27 16:00:00', NULL, 'TRACK013', NULL),
(14, '2025-05-23 11:30:00', 250.750, 4, 'Cra 18 #40-20', 'Cartagena', '130001', 1, '2025-05-28 19:00:00', NULL, 'TRACK014', 'Entregar a seguridad.'),
(15, '2025-05-24 17:45:00', 175.000, 5, 'Oficina 9', 'Barranquilla', '080001', 5, '2025-05-29 17:00:00', '2025-05-29 16:55:00', 'TRACK015', NULL),
(16, '2025-05-25 10:00:00', 190.000, 1, 'Av Central #33-44', 'Manizales', '170001', 4, '2025-05-30 15:00:00', '2025-05-29 14:30:00', 'TRACK016', NULL),
(17, '2025-05-26 13:15:00', 85.000, 2, 'Cra 77 #10-10', 'Cúcuta', '540001', 3, '2025-05-31 13:00:00', NULL, 'TRACK017', NULL),
(18, '2025-05-27 14:30:00', 220.000, 3, 'Calle 13 #8-20', 'Pasto', '520001', 2, '2025-06-01 17:00:00', NULL, 'TRACK018', 'Verificar dirección.'),
(19, '2025-05-28 16:00:00', 140.000, 4, 'Calle 6 #1-23', 'Tunja', '150001', 1, '2025-06-02 18:00:00', NULL, 'TRACK019', NULL),
(20, '2025-05-29 09:30:00', 165.000, 5, 'Zona Industrial 5', 'Montería', '230001', 5, '2025-06-03 16:00:00', '2025-06-03 15:50:00', 'TRACK020', NULL),
(21, '2025-05-30 10:10:00', 130.500, 1, 'Finca El Roble', 'Tolima', '730001', 4, '2025-06-04 18:00:00', '2025-06-03 17:30:00', 'TRACK021', NULL),
(22, '2025-05-31 11:20:00', 70.000, 2, 'Vereda La Esperanza', 'Huila', '410001', 3, '2025-06-05 12:00:00', NULL, 'TRACK022', NULL),
(23, '2025-06-01 09:00:00', 210.000, 3, 'Finca San José', 'Nariño', '520001', 2, '2025-06-06 16:00:00', NULL, 'TRACK023', NULL),
(24, '2025-06-02 14:50:00', 320.000, 4, 'Zona Rural Km 12', 'Meta', '180001', 1, '2025-06-07 19:00:00', NULL, 'TRACK024', 'Llamar antes de entregar.'),
(25, '2025-06-03 16:30:00', 100.000, 5, 'Camino Real #123', 'Cauca', '760001', 5, '2025-06-08 17:00:00', '2025-06-08 16:50:00', 'TRACK025', NULL),
(26, '2025-06-04 09:45:00', 275.000, 1, 'Sector El Bosque', 'Antioquia', '050021', 4, '2025-06-09 15:00:00', '2025-06-08 14:30:00', 'TRACK026', NULL),
(27, '2025-06-05 11:10:00', 90.000, 2, 'Finca Las Palmas', 'Caldas', '170001', 3, '2025-06-10 13:00:00', NULL, 'TRACK027', NULL),
(28, '2025-06-06 13:25:00', 230.000, 3, 'Km 4 Vía al Mar', 'La Guajira', '440001', 2, '2025-06-11 17:00:00', NULL, 'TRACK028', NULL),
(29, '2025-06-07 15:00:00', 125.000, 4, 'Vereda Los Pinos #45', 'Santander', '680001', 1, '2025-06-12 18:00:00', NULL, 'TRACK029', 'Por favor, dejar en portería si no hay nadie.'),
(30, '2025-06-08 10:20:00', 180.000, 5, 'Calle 7 #89-12', 'Villavicencio', '500001', 5, '2025-06-13 17:00:00', '2025-06-13 16:50:00', 'TRACK030', 'Cliente pidió embalaje extra para regalo.'),
(31, '2025-06-09 11:00:00', 190.000, 1, 'Cra 50 #100-110', 'Cali', '760001', 4, '2025-06-14 17:00:00', '2025-06-13 16:45:00', 'TRACK031', 'Incluir tarjeta de cumpleaños.'),
(32, '2025-06-10 09:30:00', 150.500, 2, 'Calle 80 #20-30', 'Pereira', '660001', 3, '2025-06-15 13:00:00', NULL, 'TRACK032', 'Revisar condiciones de garantía.'),
(33, '2025-06-11 12:00:00', 200.000, 3, 'Av 2 #15-20', 'Medellín', '050021', 2, '2025-06-16 17:00:00', NULL, 'TRACK033', 'Verificar disponibilidad de producto.'),
(34, '2025-06-12 10:30:00', 250.750, 4, 'Calle 45 #34-56', 'Barranquilla', '080001', 1, '2025-06-17 19:00:00', NULL, 'TRACK034', 'Llamar antes de la entrega.'),
(35, '2025-06-13 14:00:00', 120.000, 5, 'Cra 21 #56-67', 'Ibagué', '730001', 5, '2025-06-18 15:00:00', '2025-06-18 14:45:00', 'TRACK035', NULL),
(36, '2025-06-14 16:20:00', 130.250, 1, 'Calle 90 #22-35', 'Cúcuta', '540001', 4, '2025-06-19 18:00:00', '2025-06-18 17:30:00', 'TRACK036', 'Cliente solicitó factura.'),
(37, '2025-06-15 10:00:00', 170.500, 2, 'Calle 100 #30-40', 'Neiva', '410001', 3, '2025-06-20 12:00:00', NULL, 'TRACK037', 'Confirmar producto antes de enviar.'),
(38, '2025-06-16 09:45:00', 220.000, 3, 'Cra 80 #15-25', 'Medellín', '050021', 2, '2025-06-21 16:00:00', NULL, 'TRACK038', 'Incluir nota personalizada.'),
(39, '2025-06-17 12:15:00', 180.000, 4, 'Calle 50 #70-80', 'Pasto', '520001', 1, '2025-06-22 17:00:00', NULL, 'TRACK039', 'Cliente pidió llamada antes de la entrega.'),
(40, '2025-06-18 13:00:00', 150.000, 5, 'Av 100 #40-50', 'Manizales', '170001', 5, '2025-06-23 16:00:00', '2025-06-23 15:45:00', 'TRACK040', NULL),
(41, '2025-06-19 14:30:00', 220.250, 1, 'Calle 110 #10-20', 'Cali', '760001', 4, '2025-06-24 17:00:00', '2025-06-23 16:30:00', 'TRACK041', 'Entregar en horario nocturno.'),
(42, '2025-06-20 10:45:00', 180.750, 2, 'Cra 70 #22-33', 'Barranquilla', '080001', 3, '2025-06-25 15:00:00', NULL, 'TRACK042', 'Confirmar dirección antes de enviar.'),
(43, '2025-06-21 13:30:00', 260.000, 3, 'Calle 60 #90-100', 'Pereira', '660001', 2, '2025-06-26 17:00:00', NULL, 'TRACK043', 'Incluir tarjeta de agradecimiento.'),
(44, '2025-06-22 11:10:00', 210.500, 4, 'Cra 15 #50-60', 'Neiva', '410001', 1, '2025-06-27 18:00:00', NULL, 'TRACK044', 'Verificar estado del producto.'),
(45, '2025-06-23 09:20:00', 170.000, 5, 'Calle 30 #45-50', 'Medellín', '050021', 5, '2025-06-28 16:00:00', '2025-06-28 15:50:00', 'TRACK045', NULL),
(46, '2025-06-24 14:00:00', 195.750, 1, 'Calle 120 #15-25', 'Cali', '760001', 4, '2025-06-29 18:00:00', '2025-06-28 17:30:00', 'TRACK046', 'Dejar paquete en conserjería.'),
(47, '2025-06-25 13:15:00', 140.000, 2, 'Calle 50 #80-90', 'Pereira', '660001', 3, '2025-06-30 14:00:00', NULL, 'TRACK047', 'Llamar antes de entregar.'),
(48, '2025-06-26 11:50:00', 230.000, 3, 'Calle 40 #60-70', 'Medellín', '050021', 2, '2025-07-01 16:00:00', NULL, 'TRACK048', 'Verificar cantidad antes de envío.'),
(49, '2025-06-27 12:40:00', 270.500, 4, 'Av 25 #20-30', 'Neiva', '410001', 1, '2025-07-02 19:00:00', NULL, 'TRACK049', 'Confirmar antes de enviar.'),
(50, '2025-06-28 09:00:00', 160.000, 5, 'Calle 110 #25-35', 'Manizales', '170001', 5, '2025-07-03 17:00:00', '2025-07-03 16:40:00', 'TRACK050', NULL);

	INSERT INTO detalle_pedido (
		id_pedido,
		id_producto,
		cantidad,
		precio_unitario_al_momento,
		subtotal,
		descuento_aplicado_monto
) VALUES
(1, 1, 3, 10.000, 30.000, 0.000),
(2, 2, 5, 8.000, 40.000, 5.000),
(3, 3, 2, 12.500, 25.000, 0.000),
(4, 4, 1, 20.000, 20.000, 2.000),
(5, 5, 4, 6.500, 26.000, 1.500),
(6, 6, 2, 15.000, 30.000, 0.000);


INSERT INTO comentario_resena (
    id_usuario,
    id_producto,
    calificacion,
    texto_comentario,
    estado_comentario,
    id_administrador_moderador
) VALUES
(1, 1, 5, 'Excelente producto, superó mis expectativas.', 'Aprobado', 11),
(2, 2, 4, 'Buen producto, aunque el envío demoró un poco.', 'Aprobado', 12),
(3, 3, 3, 'Calidad aceptable, pero esperaba más.', 'Pendiente', NULL),
(4, 4, 2, 'No cumplió con lo prometido, estoy decepcionado.', 'Rechazado', 13),
(5, 5, 4, 'Buen precio y calidad.', 'Aprobado', 14),
(6, 6, 5, 'Muy satisfecho, volveré a comprar.', 'Aprobado', 15);

create table perfiles(
	id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario  BIGINT,
    nombre_completo VARCHAR(100) NOT NULL,
    biografia text,
    url_foto VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

select*from categorias;
ALTER TABLE categorias ADD estado VARCHAR(20) DEFAULT 'Activo';
ALTER TABLE usuarios ADD estado VARCHAR(20) DEFAULT 'Activo';
ALTER TABLE producto ADD cantidad int;
INSERT INTO usuarios (nombre_usuario, password_hash, correo_electronico, id_rol, documento_identidad, estado)
VALUES ('Juan Suarez', sha1('hash_contrasena'), 'jZuares@example.com', 1, '12005678', 'Activo');
select*from usuarios;