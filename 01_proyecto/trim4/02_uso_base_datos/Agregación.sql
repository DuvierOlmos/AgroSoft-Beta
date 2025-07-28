-- COINSULTAS DE AGREGACION --

-- Total de comentarios "aprobados" por producto: --
SELECT productos.nombre_producto, COUNT(comentario_resena.id_comentario_resena) AS total_aprobados
FROM comentario_resena
JOIN productos ON comentario_resena.id_producto = productos.id_producto
WHERE comentario_resena.estado_comentario = 'Aprobado'
GROUP BY productos.nombre_producto;

-- numero de pedidos por estado --
SELECT estado.nombre_estado as estado, COUNT(pedidos.id_pedido) AS total_pedidos
FROM pedidos
JOIN estado_pedido estado ON pedidos.id_estado_pedido = estado.id_estado_pedido
GROUP BY estado.nombre_estado;

-- suma de pedios por cuidad --
SELECT ciudad_envio, FORMAT(SUM(total_pedido), 0) AS total_ventas
FROM pedidos
GROUP BY ciudad_envio;

-- promedio de stock por productos --
SELECT productos.nombre_producto,format(AVG(inventario.cantidad_disponible),0) AS promedio_stock
FROM inventario 
JOIN productos  ON inventario.id_producto = productos.id_producto
GROUP BY productos.nombre_producto;

-- total de ventas por metodo de pago --
SELECT metodo_pago.nombre_metodo as metodo_pago, 
  CONCAT('$', FORMAT(SUM(pedidos.total_pedido), 2)) AS total_ventas
FROM pedidos
JOIN metodo_pago ON pedidos.id_metodo_pago = metodo_pago.id_metodo_pago
GROUP BY metodo_pago.nombre_metodo;

-- productos con mayor y menor precio por categoria --
SELECT categorias.nombre_categoria,
  CONCAT('$', FORMAT(MAX(productos.precio_unitario), 3)) AS precio_maximo,
  CONCAT('$', FORMAT(MIN(productos.precio_unitario), 3)) AS precio_minimo
FROM productos
JOIN categorias ON productos.id_categoria = categorias.id_categoria
GROUP BY categorias.nombre_categoria;

-- numero de PQRS segun su estado --
SELECT estado_pqrs.nombre_estado,
COUNT(pqrs.id_pqrs) AS total_pqrs
FROM pqrs
JOIN estado_pqrs ON pqrs.id_estado_pqrs = estado_pqrs.id_estado_pqrs
GROUP BY estado_pqrs.nombre_estado;

-- agricultores con un stock mayor a 200 --
SELECT usuarios.nombre_usuario,
  format(SUM(inventario.cantidad_disponible),0) AS total_stock
FROM inventario
JOIN usuarios ON inventario.id_agricultor = usuarios.id_usuario
GROUP BY usuarios.nombre_usuario
HAVING total_stock > 200;

-- muestra el total de las ventas de los agricultores y sus cuidades si superan el valor de $200 --
SELECT usuarios.nombre_usuario AS agricultor,pedidos.ciudad_envio AS ciudad,
  CONCAT('$', FORMAT(SUM(pedidos.total_pedido), 2)) AS total_ventas
FROM pedidos
JOIN detalle_pedido ON pedidos.id_pedido = detalle_pedido.id_pedido
JOIN inventario ON detalle_pedido.id_producto = inventario.id_producto
JOIN usuarios ON inventario.id_agricultor = usuarios.id_usuario
GROUP BY usuarios.nombre_usuario, pedidos.ciudad_envio
HAVING SUM(pedidos.total_pedido) > 200;


-- muestra el estado de PQRS de cada usuario y cuantas tiene en total --
SELECT usuarios.nombre_usuario AS usuario,estado_pqrs.nombre_estado AS estado_pqrs,
  COUNT(pqrs.id_pqrs) AS total_pqrs
FROM pqrs
JOIN usuarios ON pqrs.id_usuario = usuarios.id_usuario
JOIN estado_pqrs ON pqrs.id_estado_pqrs = estado_pqrs.id_estado_pqrs
WHERE estado_pqrs.nombre_estado != 'Cerrado'
GROUP BY usuarios.nombre_usuario, estado_pqrs.nombre_estado;








