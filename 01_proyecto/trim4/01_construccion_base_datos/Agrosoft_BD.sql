use Agrosoft2;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion_rol TEXT
);

CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- Almacenar siempre el HASH de la contraseña, no el texto plano
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,
    id_rol INT NOT NULL,
    documento_identidad VARCHAR(50) UNIQUE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion_categoria TEXT
);

CREATE TABLE productos (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(200) NOT NULL,
    id_agricultor BIGINT default 1,
    descripcion_producto TEXT,
    precio_unitario DECIMAL(10, 3) NOT NULL,
    unidad_medida VARCHAR(50) NOT NULL, -- 'kg', 'unidad', 'docena', 'litro'
    url_imagen VARCHAR(255),
    id_categoria INT NOT NULL,
    estado_producto VARCHAR(20) NOT NULL, -- 'Activo', 'Inactivo', 'Agotado'
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_agricultor) REFERENCES usuarios(id_usuario)
);

CREATE TABLE inventario (
    id_inventario BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    id_agricultor BIGINT, 
    cantidad_disponible INT NOT NULL DEFAULT 0,
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ubicacion_almacenamiento VARCHAR(255),
    UNIQUE (id_producto, id_agricultor), -- Restricción: un agricultor solo tiene un registro de inventario por producto
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
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
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
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
    id_administrador_respuesta BIGINT, -- FK a Usuarios.id_usuario (con rol 'Administrador')
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_tipo_pqrs) REFERENCES tipo_pqrs(id_tipo_pqrs),
    FOREIGN KEY (id_estado_pqrs) REFERENCES estado_pqrs(id_estado_pqrs),
    FOREIGN KEY (id_administrador_respuesta) REFERENCES usuarios(id_usuario)
);


CREATE TABLE descuentos (
    id_descuento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_descuento VARCHAR(100) NOT NULL,
    tipo_descuento VARCHAR(20) NOT NULL, -- Ej: 'Porcentaje', 'Monto Fijo'
    valor_descuento DECIMAL(5, 2) NOT NULL, -- Ej: 0.15 para 15%, 10.00 para $10
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
    tipo_oferta VARCHAR(50) NOT NULL, -- Ej: '2x1', 'Descuento por Cantidad', 'Envío Gratis'
    activo BOOLEAN NOT NULL DEFAULT TRUE
);


CREATE TABLE producto_descuento (
    id_producto BIGINT NOT NULL,
    id_descuento INT NOT NULL,
    PRIMARY KEY (id_producto, id_descuento), -- Clave primaria compuesta
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_descuento) REFERENCES descuentos(id_descuento)
);


CREATE TABLE producto_oferta (
    id_producto BIGINT NOT NULL,
    id_oferta INT NOT NULL,
    PRIMARY KEY (id_producto, id_oferta), -- Clave primaria compuesta
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
);


CREATE TABLE categoria_descuento (
    id_categoria INT NOT NULL,
    id_descuento INT NOT NULL,
    PRIMARY KEY (id_categoria, id_descuento), -- Clave primaria compuesta
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_descuento) REFERENCES descuentos(id_descuento)
);


CREATE TABLE categoria_oferta (
    id_categoria INT NOT NULL,
    id_oferta INT NOT NULL,
    PRIMARY KEY (id_categoria, id_oferta), -- Clave primaria compuesta
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
);

CREATE TABLE estado_pedido (
    id_estado_pedido INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE -- Ej: 'Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'
);

CREATE TABLE metodo_pago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre_metodo VARCHAR(100) NOT NULL UNIQUE -- Ej: 'Tarjeta de Crédito', 'PayPal', 'Transferencia Bancaria', 'Efectivo al Recibir'
);


CREATE TABLE pedidos (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL, -- Cliente que realiza el pedido
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
    UNIQUE (id_pedido, id_producto), -- Un producto solo aparece una vez por pedido
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE comentario_resena (
    id_comentario_resena BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    calificacion INT, -- Ej: 1 a 5 estrellas
    texto_comentario TEXT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_comentario VARCHAR(20) NOT NULL, --  'Aprobado', 'Pendiente', 'Rechazado'
    id_administrador_moderador BIGINT, --  Usuarios.id_usuario (con rol 'Administrador')
    CHECK (calificacion >= 1 AND calificacion <= 5 OR calificacion IS NULL), -- Asegura que la calificación esté en el rango o sea nula
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_administrador_moderador) REFERENCES usuarios(id_usuario)
);

INSERT INTO roles (nombre_rol, descripcion_rol) VALUES
('cliente', 'Persona que consume productos o servicios.'),
('administrador', 'Encargado de la administración del sistema.'),
('agricultor', 'Persona dedicada a la agricultura.');

INSERT INTO usuarios (
    nombre_usuario,
    contrasena,
    correo_electronico,
    id_rol,
    documento_identidad
) VALUES
-- Clientes (id_rol = 1
('juan.ramirez', '$2y$10$hash21cliente', 'juan.ramirez@example.com', 1, '100000021'),
('sofia.gomez', '$2y$10$hash22cliente', 'sofia.gomez@example.com', 1, '100000022'),
('andres.morales', '$2y$10$hash23cliente', 'andres.morales@example.com', 1,'100000023'),
('paola.salazar', '$2y$10$hash24cliente', 'paola.salazar@example.com', 1,  '100000024'),
('jose.figueroa', '$2y$10$hash25cliente', 'jose.figueroa@example.com', 1,  '100000025'),
('marta.palomino', '$2y$10$hash26cliente', 'marta.palomino@example.com', 1, '100000026'),
('luis.mendoza', '$2y$10$hash27cliente', 'luis.mendoza@example.com', 1,  '100000027'),
('marcela.romero', '$2y$10$hash28cliente', 'marcela.romero@example.com', 1, '100000028'),
('laura.gomez', '$2y$10$hash1cliente', 'laura.gomez@example.com', 1,  '100000001'),
('carlos.perez', '$2y$10$hash2cliente', 'carlos.perez@example.com', 1, '100000002'),
('maria.rojas', '$2y$10$hash3cliente', 'maria.rojas@example.com', 1,  '100000003'),
('julian.martinez', '$2y$10$hash4cliente', 'julian.martinez@example.com', 1, '100000004'),
('sandra.nieves', '$2y$10$hash5cliente', 'sandra.nieves@example.com', 1, '100000005'),
('fernando.soto', '$2y$10$hash6cliente', 'fernando.soto@example.com', 1,  '100000006'),
('luisa.moreno', '$2y$10$hash7cliente', 'luisa.moreno@example.com', 1, '100000007'),
('ricardo.diaz', '$2y$10$hash8cliente', 'ricardo.diaz@example.com', 1, '100000008'),
('natalia.ospina', '$2y$10$hash9cliente', 'natalia.ospina@example.com', 1, '100000009'),
('diego.castillo', '$2y$10$hash10cliente', 'diego.castillo@example.com', 1, '100000010'),

-- Administradores (id_rol = 2)
('admin.juana', '$2y$10$hash1admin', 'juana.admin@example.com', 2,  '200000001'),
('admin.luis', '$2y$10$hash2admin', 'luis.admin@example.com', 2,'200000002'),
('admin.monica', '$2y$10$hash3admin', 'monica.admin@example.com', 2, '200000003'),
('admin.esteban', '$2y$10$hash4admin', 'esteban.admin@example.com', 2,  '200000004'),
('admin.camila', '$2y$10$hash5admin', 'camila.admin@example.com', 2,  '200000005'),
('admin.david', '$2y$10$hash6admin', 'david.admin@example.com', 2,  '200000006'),
('admin.andrea', '$2y$10$hash7admin', 'andrea.admin@example.com', 2,'200000007'),
('admin.sebastian', '$2y$10$hash8admin', 'sebastian.admin@example.com', 2,  '200000008'),
('admin.ana', '$2y$10$hash9admin', 'ana.admin@example.com', 2,  '200000009'),
('admin.jorge', '$2y$10$hash10admin', 'jorge.admin@example.com', 2,  '200000010'),
('admin.mario', '$2y$10$hash21admin', 'mario.admin@example.com', 2, '200000021'),
('admin.tamara', '$2y$10$hash22admin', 'tamara.admin@example.com', 2, '200000022'),
('admin.ricardo', '$2y$10$hash23admin', 'ricardo.admin@example.com', 2,  '200000023'),
('admin.carmen', '$2y$10$hash24admin', 'carmen.admin@example.com', 2,  '200000024'),

-- Agricultores (id_rol = 3)
('javier', '$2y$10$hash1agro', 'javier.agro@example.com', 3,'300000001'),
('elena', '$2y$10$hash2agro', 'elena.agro@example.com', 3, '300000002'),
('andres', '$2y$10$hash3agro', 'andres.agro@example.com', 3, '300000003'),
('sofia', '$2y$10$hash4agro', 'sofia.agro@example.com', 3,  '300000004'),
('mateo', '$2y$10$hash5agro', 'mateo.agro@example.com', 3,  '300000005'),
('valentina', '$2y$10$hash6agro', 'valentina.agro@example.com', 3,  '300000006'),
('cristian', '$2y$10$hash7agro', 'cristian.agro@example.com', 3,'300000007'),
('isabela', '$2y$10$hash8agro', 'isabela.agro@example.com', 3,  '300000008'),
('felipe', '$2y$10$hash9agro', 'felipe.agro@example.com', 3, '300000009'),
('daniela', '$2y$10$hash10agro', 'daniela.agro@example.com', 3,  '300000010'),
('ana.martinez', '$2y$10$hash21agro', 'ana.martinez@example.com', 3, '300000021'),
('lucas.gomez', '$2y$10$hash22agro', 'lucas.gomez@example.com', 3,  '300000022'),
('jorge.figueroa', '$2y$10$hash23agro', 'jorge.figueroa@example.com', 3, '300000023'),
('carolina.sanchez', '$2y$10$hash24agro', 'carolina.sanchez@example.com', 3, '300000024'),
('camilo.rodriguez', '$2y$10$hash25agro', 'camilo.rodriguez@example.com', 3, '300000025'),
('veronica.paredes', '$2y$10$hash26agro', 'veronica.paredes@example.com', 3, '300000026'),
('pedro.gonzalez', '$2y$10$hash27agro', 'pedro.gonzalez@example.com', 3, '300000027'),
('mariana.morales', '$2y$10$hash28agro', 'mariana.morales@example.com', 3,'300000028');

INSERT INTO categorias (nombre_categoria, descripcion_categoria) VALUES
('Frutas', 'Frutas frescas cultivadas en fincas campesinas.'),
('Verduras', 'Hortalizas y verduras frescas para consumo diario.'),
('Granos', 'Productos como arroz, fríjol, lentejas y maíz.'),
('Tubérculos', 'Papa, yuca, ñame y otros cultivos de raíz.'),
('Lácteos', 'Leche, quesos, yogures y otros derivados.'),
('Carnes', 'Carne de res, cerdo, pollo y pescado criollo.'),
('Huevos', 'Huevos campesinos frescos.'),
('Hierbas Aromáticas', 'Hierbas como albahaca, cilantro, perejil, entre otras.'),
('Semillas', 'Semillas para siembra de productos agrícolas.'),
('Fertilizantes Naturales', 'Compost, humus de lombriz y otros abonos orgánicos.'),
('Plantas Medicinales', 'Manzanilla, menta, ruda, sábila y más.'),
('Café', 'Café cultivado por productores rurales.'),
('Cacao', 'Granos y productos derivados del cacao.'),
('Miel', 'Miel de abejas artesanal y natural.'),
('Mermeladas', 'Conservas y mermeladas hechas por campesinos.'),
('Panela', 'Panela en bloque o pulverizada.'),
('Aceites Naturales', 'Aceites extraídos de plantas o semillas.'),
('Bebidas Naturales', 'Jugos, infusiones y bebidas artesanales.'),
('Conservas', 'Verduras y frutas conservadas artesanalmente.'),
('Artesanías', 'Productos hechos a mano por comunidades rurales.'),
('Harinas', 'Harinas de yuca, maíz, plátano y más.'),
('Frutos Secos', 'Maní, nueces, almendras y otros.'),
('Productos Orgánicos', 'Certificados sin químicos ni pesticidas.'),
('Viveros', 'Plantas ornamentales y de jardín.'),
('Insumos Agrícolas', 'Herramientas, guantes, mallas, etc.'),
('Gallinas Criollas', 'Gallinas y pollitos criados libremente.'),
('Pescado de Río', 'Pescado fresco cultivado en fincas rurales.'),
('Productos de Panadería', 'Pan campesino, arepas, bizcochos y más.'),
('Forraje', 'Alimento para animales de granja.'),
('Comida Preparada', 'Platos típicos listos para llevar.'),
('Frutos Exóticos', 'Frutas tropicales y exóticas como maracuyá, pitahaya, etc.'),
('Productos de la Granja', 'Productos frescos y artesanales de la granja como leche, huevos, etc.'),
('Especias', 'Especias para sazonar y condimentar alimentos de manera natural.'),
('Té y Hierbas Secas', 'Té y hierbas secas cultivadas localmente para infusiones.'),
('Cereales', 'Arroz, avena, cebada, y otros cereales cultivados en tierras rurales.'),
('Aceitunas', 'Aceitunas cultivadas de forma orgánica en fincas campesinas.'),
('Productos Ecológicos', 'Productos agrícolas cultivados sin pesticidas ni químicos.'),
('Vino Artesanal', 'Vino hecho a mano con uvas cultivadas de manera natural.'),
('Salsas Caseras', 'Salsas y condimentos elaborados de forma artesanal.'),
('Aloe Vera', 'Productos derivados del Aloe Vera cultivados sin químicos.'),
('Papas Criollas', 'Papas criollas cultivadas de forma sostenible y sin químicos.'),
('Cereal de Grano Entero', 'Cereales sin procesar para una alimentación saludable.'),
('Vino de Fruta', 'Vino producido de frutas cultivadas localmente de forma orgánica.'),
('Alimentos Deshidratados', 'Frutas y verduras deshidratadas para conservar sus nutrientes.'),
('Productos de Apicultura', 'Productos derivados de la apicultura como polen, cera, etc.'),
('Sistemas de Riego', 'Equipos y herramientas para riego de cultivos agrícolas.'),
('Comida Vegana', 'Productos 100% vegetales y sin productos de origen animal.'),
('Alimentos Sin Gluten', 'Productos elaborados sin gluten para personas con intolerancia.'),
('Productos Gourmet', 'Productos gourmet y especializados como trufas, aceites premium, etc.'),
('Nueces y Semillas', 'Nueces, almendras, pistachos, y otras semillas para consumo.'),
('Mermeladas Caseras', 'Mermeladas caseras y naturales sin conservantes.'),
('Aceite de Oliva', 'Aceite de oliva extra virgen producido en fincas rurales.'),
('Productos Antioxidantes', 'Frutas y productos con propiedades antioxidantes.'),
('Jabones Naturales', 'Jabones y productos de higiene elaborados artesanalmente.'),
('Arroz Integral', 'Arroz integral producido de manera sostenible y ecológica.'),
('Patatas Dulces', 'Patatas dulces cultivadas sin pesticidas ni fertilizantes químicos.');

INSERT INTO productos (
    nombre_producto,
    descripcion_producto,
    precio_unitario,
    unidad_medida,
    url_imagen,
    id_categoria,
    estado_producto,
    fecha_creacion,
    fecha_ultima_modificacion
) VALUES
('Banano criollo', 'Banano dulce cultivado en finca campesina.', 1.200, 'kg', 'https://ejemplo.com/img/banano.jpg', 1, 'Activo', NOW(), NOW()),
('Lechuga crespa', 'Lechuga fresca ideal para ensaladas.', 0.800, 'unidad', 'https://ejemplo.com/img/lechuga.jpg', 2, 'Activo', NOW(), NOW()),
('Fríjol bola roja', 'Fríjol seco producido artesanalmente.', 4.500, 'kg', 'https://ejemplo.com/img/frijol.jpg', 3, 'Agotado', NOW(), NOW()),
('Papa criolla', 'Papa amarilla de excelente calidad.', 2.000, 'kg', 'https://ejemplo.com/img/papa.jpg', 4, 'Activo', NOW(), NOW()),
('Queso campesino', 'Queso fresco elaborado artesanalmente.', 6.000, 'kg', 'https://ejemplo.com/img/queso.jpg', 5, 'Activo', NOW(), NOW()),
('Pollo campesino', 'Pollo criado libre de hormonas.', 12.000, 'kg', 'https://ejemplo.com/img/pollo.jpg', 6, 'Inactivo', NOW(), NOW()),
('Huevos rojos', 'Huevos frescos de gallinas criollas.', 5.500, 'docena', 'https://ejemplo.com/img/huevos.jpg', 7, 'Activo', NOW(), NOW()),
('Cilantro fresco', 'Hierba aromática para cocinar.', 0.300, 'unidad', 'https://ejemplo.com/img/cilantro.jpg', 8, 'Activo', NOW(), NOW()),
('Semilla de maíz', 'Semilla seleccionada para siembra.', 3.000, 'kg', 'https://ejemplo.com/img/maiz.jpg', 9, 'Activo', NOW(), NOW()),
('Humus de lombriz', 'Fertilizante orgánico natural.', 7.000, 'kg', 'https://ejemplo.com/img/humus.jpg', 10, 'Activo', NOW(), NOW()),
('Menta', 'Planta medicinal y aromática.', 1.50, 'manojo', 'https://ejemplo.com/img/menta.jpg', 11, 'Agotado', NOW(), NOW()),
('Café tostado', 'Café de origen campesino.', 15.000, 'kg', 'https://ejemplo.com/img/cafe.jpg', 12, 'Activo', NOW(), NOW()),
('Cacao en grano', 'Granos secos para chocolatería.', 10.000, 'kg', 'https://ejemplo.com/img/cacao.jpg', 13, 'Activo', NOW(), NOW()),
('Miel pura', 'Miel natural sin aditivos.', 8.50, 'litro', 'https://ejemplo.com/img/miel.jpg', 14, 'Activo', NOW(), NOW()),
('Mermelada de mora', 'Mermelada artesanal sin conservantes.', 4.500, 'unidad', 'https://ejemplo.com/img/mermelada.jpg', 15, 'Inactivo', NOW(), NOW()),
('Panela orgánica', 'Panela en bloque sin refinar.', 2.500, 'kg', 'https://ejemplo.com/img/panela.jpg', 16, 'Activo', NOW(), NOW()),
('Aceite de ajonjolí', 'Aceite extraído en frío.', 12.000, 'litro', 'https://ejemplo.com/img/aceite.jpg', 17, 'Agotado', NOW(), NOW()),
('Infusión de cidrón', 'Bebida natural relajante.', 1.800, 'unidad', 'https://ejemplo.com/img/infusion.jpg', 18, 'Activo', NOW(), NOW()),
('Conserva de piña', 'Trozos de piña en almíbar artesanal.', 3.500, 'unidad', 'https://ejemplo.com/img/piña.jpg', 19, 'Activo', NOW(), NOW()),
('Canastos de fique', 'Canastos tejidos a mano.', 25.000, 'unidad', 'https://ejemplo.com/img/canasto.jpg', 20, 'Activo', NOW(), NOW()),
('Harina de plátano', 'Harina seca para uso culinario.', 6.000, 'kg', 'https://ejemplo.com/img/harina.jpg', 21, 'Inactivo', NOW(), NOW()),
('Maní tostado', 'Fruto seco listo para consumo.', 4.000, 'kg', 'https://ejemplo.com/img/mani.jpg', 22, 'Activo', NOW(), NOW()),
('Verduras orgánicas', 'Cultivo libre de agroquímicos.', 3.200, 'kg', 'https://ejemplo.com/img/organico.jpg', 23, 'Activo', NOW(), NOW()),
('Planta de albahaca', 'Ideal para huerta en casa.', 2.000, 'unidad', 'https://ejemplo.com/img/albahaca.jpg', 24, 'Activo', NOW(), NOW()),
('Guantes de cuero', 'Guantes resistentes para labranza.', 10.000, 'unidad', 'https://ejemplo.com/img/guantes.jpg', 25, 'Agotado', NOW(), NOW()),
('Gallina ponedora', 'Ave lista para producción de huevos.', 20.000, 'unidad', 'https://ejemplo.com/img/gallina.jpg', 26, 'Activo', NOW(), NOW()),
('Tilapia roja', 'Pescado de río fresco.', 9.000, 'kg', 'https://ejemplo.com/img/tilapia.jpg', 27, 'Activo', NOW(), NOW()),
('Pan de maíz', 'Pan artesanal campesino.', 1.500, 'unidad', 'https://ejemplo.com/img/pan.jpg', 28, 'Activo', NOW(), NOW()),
('Silo de maíz', 'Forraje para animales.', 3.000, 'kg', 'https://ejemplo.com/img/silo.jpg', 29, 'Activo', NOW(), NOW()),
('Tamales campesinos', 'Tamales típicos listos para consumo.', 4.000, 'unidad', 'https://ejemplo.com/img/tamal.jpg', 30, 'Activo', NOW(), NOW()),
('Frutos Exóticos', 'Frutas tropicales y exóticas como maracuyá, pitahaya, etc.', 2.500, 'kg', 'https://ejemplo.com/img/frutos_exoticos.jpg', 1, 'Activo', NOW(), NOW()),
('Salsas Caseras', 'Salsas y condimentos elaborados de forma artesanal.', 4.000, 'unidad', 'https://ejemplo.com/img/salsas.jpg', 5, 'Activo', NOW(), NOW()),
('Vino Artesanal', 'Vino hecho a mano con uvas cultivadas de manera natural.', 20.000, 'litro', 'https://ejemplo.com/img/vino.jpg', 12, 'Activo', NOW(), NOW()),
('Mermeladas Caseras', 'Mermeladas caseras y naturales sin conservantes.', 4.800, 'unidad', 'https://ejemplo.com/img/mermelada_casera.jpg', 15, 'Activo', NOW(), NOW()),
('Frutos Secos', 'Maní, nueces, almendras y otros.', 6.000, 'kg', 'https://ejemplo.com/img/frutos_secos.jpg', 22, 'Activo', NOW(), NOW()),
('Productos Orgánicos', 'Productos certificados sin químicos ni pesticidas.', 12.000, 'kg', 'https://ejemplo.com/img/productos_organicos.jpg', 23, 'Activo', NOW(), NOW()),
('Aceites Naturales', 'Aceites extraídos de plantas o semillas.', 10.000, 'litro', 'https://ejemplo.com/img/aceites.jpg', 17, 'Activo', NOW(), NOW()),
('Viveros', 'Plantas ornamentales y de jardín.', 8.000, 'unidad', 'https://ejemplo.com/img/viveros.jpg', 24, 'Activo', NOW(), NOW()),
('Insumos Agrícolas', 'Herramientas, guantes, mallas, etc.', 15.000, 'unidad', 'https://ejemplo.com/img/insumos.jpg', 29, 'Activo', NOW(), NOW()),
('Gallinas Criollas', 'Gallinas y pollitos criados libremente.', 18.000, 'unidad', 'https://ejemplo.com/img/gallinas_criollas.jpg', 26, 'Activo', NOW(), NOW()),
('Pescado de Río', 'Pescado fresco cultivado en fincas rurales.', 8.000, 'kg', 'https://ejemplo.com/img/pescado_rio.jpg', 27, 'Activo', NOW(), NOW()),
('Comida Preparada', 'Platos típicos listos para llevar.', 5.000, 'unidad', 'https://ejemplo.com/img/comida_preparada.jpg', 30, 'Activo', NOW(), NOW()),
('Jabones Naturales', 'Jabones y productos de higiene elaborados artesanalmente.', 3.500, 'unidad', 'https://ejemplo.com/img/jabon.jpg', 18, 'Activo', NOW(), NOW()),
('Arroz Integral', 'Arroz integral producido de manera sostenible y ecológica.', 4.000, 'kg', 'https://ejemplo.com/img/arroz_integral.jpg', 22, 'Activo', NOW(), NOW()),
('Cereal de Grano Entero', 'Cereales sin procesar para una alimentación saludable.', 3.500, 'kg', 'https://ejemplo.com/img/cereal.jpg', 22, 'Activo', NOW(), NOW()),
('Vino de Fruta', 'Vino producido de frutas cultivadas localmente de forma orgánica.', 18.000, 'litro', 'https://ejemplo.com/img/vino_fruta.jpg', 12, 'Activo', NOW(), NOW()),
('Alimentos Deshidratados', 'Frutas y verduras deshidratadas para conservar sus nutrientes.', 5.000, 'kg', 'https://ejemplo.com/img/deshidratados.jpg', 3, 'Activo', NOW(), NOW()),
('Aceite de Oliva', 'Aceite de oliva extra virgen producido en fincas rurales.', 14.000, 'litro', 'https://ejemplo.com/img/aceite_oliva.jpg', 17, 'Activo', NOW(), NOW()),
('Frutas Exóticas', 'Frutas tropicales de cultivo orgánico como pitanga, maracuyá, etc.', 3.000, 'kg', 'https://ejemplo.com/img/frutas_exoticas.jpg', 1, 'Activo', NOW(), NOW()),
('Productos Gourmet', 'Productos gourmet y especializados como trufas, aceites premium, etc.', 22.000, 'kg', 'https://ejemplo.com/img/productos_gourmet.jpg', 5, 'Activo', NOW(), NOW()),
('Alimentos Veganos', 'Productos 100% vegetales y sin productos de origen animal.', 6.000, 'kg', 'https://ejemplo.com/img/alimentos_veganos.jpg', 23, 'Activo', NOW(), NOW());

INSERT INTO inventario(
  id_producto,
  id_agricultor,
  cantidad_disponible,
  ubicacion_almacenamiento
) VALUES
(1, 32, 100.000, 'Finca El Roble'),
(2, 33, 50.000, 'Finca El Roble'),
(3, 34, 75.000, 'Finca El Roble'),
(4, 32, 120.000, 'Vereda La Esperanza'),
(5, 32, 60.000, 'Vereda La Esperanza'),
(6, 32, 30.000, 'Vereda La Esperanza'),
(7, 33, 200.000, 'Finca San José'),
(8, 33, 40.000, 'Finca San José'),
(9, 33, 80.000, 'Finca San José'),
(10, 34, 55.000, 'Zona Rural Km 12'),
(11, 34, 120.000, 'Zona Rural Km 12'),
(12, 34, 90.000, 'Zona Rural Km 12'),
(13, 35, 150.000, 'Camino Real #123'),
(14, 35, 70.000, 'Camino Real #123'),
(15, 35, 40.000, 'Camino Real #123'),
(16, 36, 80.000, 'Sector El Bosque'),
(17, 36, 25.000, 'Sector El Bosque'),
(18, 36, 60.000, 'Sector El Bosque'),
(19, 37, 45.000, 'Finca Las Palmas'),
(20, 37, 35.000, 'Finca Las Palmas'),
(21, 37, 100.000, 'Finca Las Palmas'),
(22, 38, 90.000, 'Km 4 Vía al Mar'),
(23, 38, 120.000, 'Km 4 Vía al Mar'),
(24, 48, 30.000, 'Km 4 Vía al Mar'),
(25, 49, 10.000, 'Vereda Los Pinos'),
(26, 49, 5.000, 'Vereda Los Pinos'),
(27, 49, 75.000, 'Vereda Los Pinos'),
(28, 40, 20.000, 'Finca Santa Clara'),
(29, 40, 110.000, 'Finca Santa Clara'),
(30, 40, 55.000, 'Finca Santa Clara'),
(31, 41, 80.000, 'Finca El Paraíso'),
(32, 41, 60.000, 'Finca El Paraíso'),
(33, 32, 100.000, 'Vereda El Río'),
(34, 32, 40.000, 'Vereda El Río'),
(35, 33, 120.000, 'Camino Real #456'),
(36, 33, 75.000, 'Camino Real #456'),
(37, 34, 200.000, 'Finca La Nueva Esperanza'),
(38, 34, 50.000, 'Finca La Nueva Esperanza'),
(39, 35, 90.000, 'Sector El Carmen'),
(40, 35, 150.000, 'Sector El Carmen'),
(41, 36, 120.000, 'Finca Los Andes'),
(42, 36, 80.000, 'Finca Los Andes'),
(43, 37, 100.000, 'Vereda Las Palmas'),
(44, 37, 60.000, 'Vereda Las Palmas'),
(45, 38, 110.000, 'Zona Rural La Cumbre'),
(46, 38, 70.000, 'Zona Rural La Cumbre'),
(47, 39, 90.000, 'Finca El Laurel'),
(48, 39, 40.000, 'Finca El Laurel'),
(49, 40, 55.000, 'Vereda Los Naranjos'),
(50, 40, 125.000, 'Vereda Los Naranjos');


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
(6, '2025-06-01 09:15:00', '2025-06-02 08:30:00', 'Abandonado'),
(7, '2025-06-05 13:45:00', '2025-06-07 14:00:00', 'Activo'),
(8, '2025-05-22 10:20:00', '2025-06-01 11:30:00', 'Completado'),
(9, '2025-06-03 12:00:00', '2025-06-04 13:00:00', 'Abandonado'),
(10, '2025-06-06 09:00:00', '2025-06-10 10:00:00', 'Activo'),
(11, '2025-05-25 14:30:00', '2025-06-01 15:00:00', 'Completado'),
(12, '2025-06-02 08:00:00', '2025-06-03 09:30:00', 'Abandonado'),
(13, '2025-06-04 10:00:00', '2025-06-10 11:00:00', 'Activo'),
(14, '2025-06-07 10:00:00', '2025-06-10 15:30:00', 'Activo'),
(15, '2025-06-08 14:15:00', '2025-06-09 10:45:00', 'Completado'),
(16, '2025-06-09 12:30:00', '2025-06-10 16:00:00', 'Abandonado'),
(17, '2025-06-10 09:00:00', '2025-06-10 10:30:00', 'Activo'),
(18, '2025-06-11 11:00:00', '2025-06-11 12:30:00', 'Completado'),
(19, '2025-06-12 13:00:00', '2025-06-12 14:30:00', 'Abandonado'),
(20, '2025-06-13 14:30:00', '2025-06-13 16:00:00', 'Activo'),
(21, '2025-06-14 10:45:00', '2025-06-14 12:00:00', 'Completado'),
(22, '2025-06-15 09:30:00', '2025-06-15 10:45:00', 'Abandonado'),
(23, '2025-06-16 12:00:00', '2025-06-16 14:00:00', 'Activo'),
(24, '2025-06-17 11:30:00', '2025-06-17 13:00:00', 'Completado'),
(25, '2025-06-18 10:00:00', '2025-06-18 11:30:00', 'Abandonado'),
(26, '2025-06-19 13:30:00', '2025-06-19 15:00:00', 'Activo'),
(27, '2025-06-20 10:00:00', '2025-06-20 12:00:00', 'Completado'),
(28, '2025-06-21 12:30:00', '2025-06-21 14:00:00', 'Abandonado'),
(29, '2025-06-22 13:00:00', '2025-06-22 14:30:00', 'Activo'),
(30, '2025-06-23 10:30:00', '2025-06-23 12:00:00', 'Completado'),
(31, '2025-06-24 09:15:00', '2025-06-24 10:45:00', 'Abandonado'),
(32, '2025-06-25 14:00:00', '2025-06-25 15:30:00', 'Activo'),
(33, '2025-06-26 10:30:00', '2025-06-26 12:00:00', 'Completado'),
(34, '2025-06-27 11:00:00', '2025-06-27 12:30:00', 'Abandonado'),
(35, '2025-06-28 14:00:00', '2025-06-28 15:30:00', 'Activo'),
(36, '2025-06-29 13:00:00', '2025-06-29 14:30:00', 'Completado'),
(37, '2025-06-30 10:00:00', '2025-06-30 11:30:00', 'Abandonado'),
(38, '2025-07-01 12:00:00', '2025-07-01 13:30:00', 'Activo'),
(39, '2025-07-02 10:00:00', '2025-07-02 11:30:00', 'Completado'),
(40, '2025-07-03 14:00:00', '2025-07-03 15:30:00', 'Abandonado'),
(41, '2025-07-04 13:00:00', '2025-07-04 14:30:00', 'Activo'),
(42, '2025-07-05 10:30:00', '2025-07-05 12:00:00', 'Completado'),
(43, '2025-07-06 14:00:00', '2025-07-06 15:30:00', 'Abandonado'),
(44, '2025-07-07 12:30:00', '2025-07-07 14:00:00', 'Activo'),
(45, '2025-07-08 10:00:00', '2025-07-08 11:30:00', 'Completado'),
(46, '2025-07-09 13:00:00', '2025-07-09 14:30:00', 'Abandonado'),
(47, '2025-07-10 14:00:00', '2025-07-10 15:30:00', 'Activo'),
(48, '2025-07-11 12:30:00', '2025-07-11 14:00:00', 'Completado'),
(49, '2025-07-12 10:00:00', '2025-07-12 11:30:00', 'Abandonado'),
(50, '2025-07-13 14:00:00', '2025-07-13 15:30:00', 'Activo');
 


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
(6, 6, 4, 25.000, 100.000),
(7, 7, 10, 8.000, 80.000),
(8, 8, 6, 14.000, 84.000),
(9, 9, 1, 60.000, 60.000),
(10, 10, 2.5, 22.000, 55.000),
(11, 11, 3, 40.000, 120.000),
(12, 12, 5, 18.000, 90.000),
(13, 13, 2, 33.000, 66.000),
(14, 14, 7.5, 10.000, 75.000),
(15, 15, 1, 45.000, 45.000),
(16, 16, 4.2, 27.000, 113.400),
(17, 17, 8, 9.500, 76.000),
(18, 18, 6.5, 20.000, 130.000),
(19, 19, 1.3, 55.000, 71.500),
(20, 20, 3, 17.000, 51.000),
(21, 21, 2, 35.000, 70.000),
(22, 22, 5.5, 16.000, 88.000),
(23, 23, 1, 38.000, 38.000),
(24, 24, 7, 12.500, 87.500),
(25, 25, 2.2, 49.000, 107.800),
(26, 26, 4, 23.000, 92.000),
(27, 27, 9, 7.000, 63.000),
(28, 28, 6, 13.000, 78.000),
(29, 29, 1.7, 62.000, 105.400),
(30, 30, 3, 21.000, 63.000),
(31, 31, 4, 18.000, 72.000),
(32, 32, 6, 22.000, 132.000),
(33, 33, 2.5, 28.000, 70.000),
(34, 34, 3, 14.000, 42.000),
(35, 35, 1, 50.000, 50.000),
(36, 36, 7, 35.000, 245.000),
(37, 37, 8, 9.000, 72.000),
(38, 38, 5, 30.000, 150.000),
(39, 39, 1.5, 55.000, 82.500),
(40, 40, 2, 27.000, 54.000),
(41, 41, 4, 15.500, 62.000),
(42, 42, 6, 19.000, 114.000),
(43, 43, 3, 45.000, 135.000),
(44, 44, 2, 25.000, 50.000),
(45, 45, 1.2, 40.000, 48.000),
(46, 46, 5, 22.500, 112.500),
(47, 47, 4.5, 30.000, 135.000),
(48, 48, 6, 13.000, 78.000),
(49, 49, 2, 34.000, 68.000),
(50, 50, 3.2, 17.000, 54.400);

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
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
(11, 11), (12, 12), (13, 13), (14, 14), (15, 15);


INSERT INTO producto_oferta (id_producto, id_oferta) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
(11, 11), (12, 12), (13, 13), (14, 14), (15, 15);

INSERT INTO categoria_descuento (id_categoria, id_descuento) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 1), (7, 2), (8, 3), (9, 4), (10, 5),
(1, 2), (2, 3), (3, 4), (4, 5), (5, 1),
(6, 2), (7, 3), (8, 4), (9, 5), (10, 1),
(1, 3), (2, 4), (3, 5), (4, 1), (5, 2),
(6, 3), (7, 4), (8, 5), (9, 1), (10, 2),
(11, 1), (12, 2), (13, 3), (14, 4), (15, 5),
(11, 2), (12, 3), (13, 4), (14, 5), (15, 1),
(11, 3), (12, 4), (13, 5), (14, 1), (15, 2);


INSERT INTO categoria_oferta (id_categoria, id_oferta) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 1), (7, 2), (8, 3), (9, 4), (10, 5),
(1, 2), (2, 3), (3, 4), (4, 5), (5, 1),
(6, 2), (7, 3), (8, 4), (9, 5), (10, 1),
(1, 3), (2, 4), (3, 5), (4, 1), (5, 2),
(6, 3), (7, 4), (8, 5), (9, 1), (10, 2),
(11, 1), (12, 2), (13, 3), (14, 4), (15, 5),
(11, 2), (12, 3), (13, 4), (14, 5), (15, 1),
(11, 3), (12, 4), (13, 5), (14, 1), (15, 2);

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
(6, 6, 2, 15.000, 30.000, 0.000),
(7, 7, 3, 11.000, 33.000, 3.000),
(8, 8, 7, 5.000, 35.000, 0.000),
(9, 9, 6, 9.000, 54.000, 6.000),
(10, 10, 5, 7.000, 35.000, 0.000),
(11, 1, 1, 10.000, 10.000, 0.000),
(12, 2, 2, 8.000, 16.000, 2.000),
(13, 3, 3, 12.500, 37.500, 0.000),
(14, 4, 1, 20.000, 20.000, 1.000),
(15, 5, 2, 6.500, 13.000, 0.000),
(16, 6, 4, 15.000, 60.000, 5.000),
(17, 7, 1, 11.000, 11.000, 0.000),
(18, 8, 5, 5.000, 25.000, 0.000),
(19, 9, 3, 9.000, 27.000, 0.000),
(20, 10, 2, 7.000, 14.000, 0.000),
(21, 1, 2, 10.000, 20.000, 0.000),
(22, 2, 1, 8.000, 8.000, 0.000),
(23, 3, 4, 12.500, 50.000, 3.000),
(24, 4, 2, 20.000, 40.000, 0.000),
(25, 5, 3, 6.500, 19.500, 0.000),
(26, 6, 1, 15.000, 15.000, 0.000),
(27, 7, 5, 11.000, 55.000, 5.000),
(28, 8, 2, 5.000, 10.000, 0.000),
(29, 9, 3, 9.000, 27.000, 0.000),
(30, 10, 1, 7.000, 7.000, 0.000),
(31, 11, 3, 10.000, 30.000, 1.000),
(32, 12, 4, 9.000, 36.000, 0.000),
(33, 13, 2, 12.500, 25.000, 2.000),
(34, 14, 1, 20.000, 20.000, 0.000),
(35, 15, 5, 6.500, 32.500, 0.000),
(36, 16, 3, 15.000, 45.000, 3.000),
(37, 17, 2, 11.000, 22.000, 1.000),
(38, 18, 4, 5.000, 20.000, 0.000),
(39, 19, 3, 9.000, 27.000, 1.500),
(40, 20, 5, 7.000, 35.000, 0.000),
(41, 11, 2, 10.000, 20.000, 0.000),
(42, 12, 1, 9.000, 9.000, 1.000),
(43, 13, 3, 12.500, 37.500, 0.000),
(44, 14, 2, 20.000, 40.000, 2.000),
(45, 15, 1, 6.500, 6.500, 0.000),
(46, 16, 4, 15.000, 60.000, 5.000),
(47, 17, 3, 11.000, 33.000, 1.000),
(48, 18, 2, 5.000, 10.000, 0.000),
(49, 19, 1, 9.000, 9.000, 0.000),
(50, 20, 3, 7.000, 21.000, 0.000);

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
(6, 6, 5, 'Muy satisfecho, volveré a comprar.', 'Aprobado', 15),
(7, 7, 1, 'Producto defectuoso, no lo recomiendo.', 'Rechazado', 16),
(8, 8, NULL, 'No puedo darle una calificación aún.', 'Pendiente', NULL),
(9, 9, 3, 'Regular, cumple su función.', 'Aprobado', 17),
(10, 10, 4, 'Me gusta mucho, buen producto.', 'Aprobado', 18),
(11, 1, 5, 'Excelente, la atención al cliente fue muy buena.', 'Aprobado', 19),
(12, 2, 4, 'Producto correcto, llegó a tiempo.', 'Aprobado', 20),
(13, 3, 2, 'No recomiendo este producto.', 'Rechazado', 11),
(14, 4, 3, 'Está bien para el precio.', 'Pendiente', NULL),
(15, 5, 4, 'Muy buen producto, volveré a comprar.', 'Aprobado', 12),
(16, 6, 5, 'Excelente calidad, muy recomendado.', 'Aprobado', 13),
(17, 7, 1, 'Mal producto, llegó dañado.', 'Rechazado', 14),
(18, 8, 3, 'Cumple con lo esperado.', 'Aprobado', 15),
(19, 9, 4, 'Buen producto, recomendable.', 'Aprobado', 16),
(20, 10, 2, 'No cumplió mis expectativas.', 'Pendiente', NULL),
(21, 1, 5, 'Muy buen producto, lo recomiendo.', 'Aprobado', 17),
(22, 2, 3, 'Está bien pero podría mejorar.', 'Pendiente', NULL),
(23, 3, 4, 'Buena calidad y buen precio.', 'Aprobado', 18),
(24, 4, 2, 'No me gustó mucho.', 'Rechazado', 19),
(25, 5, 5, 'Excelente, volveré a comprar.', 'Aprobado', 20),
(26, 6, 4, 'Satisfecho con la compra.', 'Aprobado', 11),
(27, 7, 3, 'Regular, no muy impresionado.', 'Pendiente', NULL),
(28, 8, 1, 'Producto malo, no lo recomiendo.', 'Rechazado', 12),
(29, 9, 5, 'Excelente calidad y atención.', 'Aprobado', 13),
(30, 10, 4, 'Muy buen producto.', 'Aprobado', 14),
(31, 11, 4, 'Producto muy bueno, aunque podría mejorar en el embalaje.', 'Aprobado', 15),
(32, 12, 5, 'Excelente calidad, totalmente recomendado.', 'Aprobado', 16),
(33, 13, 3, 'Producto bueno pero la talla no es exacta.', 'Pendiente', NULL),
(34, 14, 4, 'Cumple con lo prometido, buen producto.', 'Aprobado', 17),
(35, 15, 2, 'No lo volvería a comprar, no es lo que esperaba.', 'Rechazado', 18),
(36, 16, 4, 'Buen producto, aunque el precio podría ser más accesible.', 'Aprobado', 19),
(37, 17, 5, 'Muy satisfecho, volveré a comprar sin duda.', 'Aprobado', 20),
(38, 18, 1, 'Producto defectuoso, no me funcionó.', 'Rechazado', 11),
(39, 19, 3, 'Cumple su función, pero podría mejorar la calidad.', 'Pendiente', NULL),
(40, 20, 4, 'Muy buen producto, lo recomiendo.', 'Aprobado', 12),
(41, 11, 5, 'Excelente producto, superó mis expectativas.', 'Aprobado', 13),
(42, 12, 4, 'Buen producto, aunque el envío tardó un poco.', 'Aprobado', 14),
(43, 13, 2, 'Producto de mala calidad, no lo recomiendo.', 'Rechazado', 15),
(44, 14, 3, 'Regular, el producto funciona pero no es tan bueno como esperaba.', 'Pendiente', NULL),
(45, 15, 5, 'Producto de excelente calidad, muy contento con mi compra.', 'Aprobado', 16),
(46, 16, 4, 'Buen producto, aunque el servicio de entrega podría mejorar.', 'Aprobado', 17),
(47, 17, 5, 'Muy buen producto, volveré a comprar.', 'Aprobado', 18),
(48, 18, 2, 'Producto llegó dañado, no lo recomiendo.', 'Rechazado', 19),
(49, 19, 3, 'Está bien, aunque esperaba más calidad por el precio.', 'Pendiente', NULL),
(50, 20, 4, 'Producto muy bueno, cumplió con mis expectativas.', 'Aprobado', 20);

select*from categorias;
ALTER TABLE categorias ADD estado VARCHAR(20) DEFAULT 'Activo';
ALTER TABLE usuarios ADD estado VARCHAR(20) DEFAULT 'Activo';
ALTER TABLE productos ADD cantidad int;
INSERT INTO usuarios (nombre_usuario, contrasena, correo_electronico, id_rol, documento_identidad, estado)
VALUES ('Juan Perez', 'hash_contrasena', 'juan@example.com', 1, '12345678', 'Activo');
