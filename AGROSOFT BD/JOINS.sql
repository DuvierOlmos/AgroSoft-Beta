-- Mostrar roles asignados a usuarios (RIGHT JOIN)-- 1
SELECT rol.nombre_rol, usu.nombre_usuario
FROM roles rol
RIGHT JOIN usuarios usu ON rol.id_rol = usu.id_rol;

-- Mostrar el detalle de pedidos realizados con detalles del producto (INNER JOIN)--  2
SELECT pedidos.id_pedido, usuarios.nombre_usuario AS Comprador, productos.nombre_producto,
detalle.cantidad, detalle.precio_unitario_al_momento, detalle.subtotal

FROM detalle_pedido as detalle
INNER JOIN productos  ON detalle.id_producto = productos.id_producto
INNER JOIN pedidos  ON detalle.id_pedido = pedidos.id_pedido
INNER JOIN usuarios ON pedidos.id_usuario = usuarios.id_usuario;


-- Muestra todos los productos registrados con su categoria y precio, aun si no tiene categoria (LEFT JOIN) --3
SELECT  prod.nombre_producto, cat.nombre_categoria, prod.precio_unitario
FROM productos prod
LEFT JOIN categorias cat ON prod.id_categoria = cat.id_categoria;

-- Muestra los detalles y estados de las PQRS (INNER JOIN)-- 4
SELECT  pq.id_pqrs, usuarios.nombre_usuario, tp.nombre_tipo, ep.nombre_estado
FROM pqrs as pq
INNER JOIN usuarios  ON pq.id_usuario = usuarios.id_usuario
INNER JOIN tipo_pqrs tp ON pq.id_tipo_pqrs = tp.id_tipo_pqrs
INNER JOIN estado_pqrs ep ON pq.id_estado_pqrs = ep.id_estado_pqrs
WHERE ep.nombre_estado IN ('Pendiente', 'En Progreso')
order by id_pqrs asc;

-- Muestra todos los productos con o sin oferta activa (LEFT JOIN) -- 5
SELECT  productos.nombre_producto, ofe.nombre_oferta, ofe.tipo_oferta
FROM productos 
LEFT JOIN producto_oferta pof ON productos.id_producto = pof.id_producto
LEFT JOIN ofertas ofe ON pof.id_oferta = ofe.id_oferta
WHERE ofe.activo = TRUE OR ofe.id_oferta IS NULL;

-- Muestra el estado de los pedidos con nombre y ID (RIGHT JOIN - INNER JOIN) -- 6
SELECT p.id_pedido, usuarios.nombre_usuario, ep.nombre_estado
FROM usuarios 
RIGHT JOIN pedidos p ON usuarios.id_usuario = p.id_usuario
INNER JOIN estado_pedido ep ON p.id_estado_pedido = ep.id_estado_pedido;

-- Muestra inventario de agricultores activos con su ubicacion de almacenamiento (INNER JOIN) -- 7
SELECT  usu.nombre_usuario AS agricultor, pr.nombre_producto, i.cantidad_disponible,
i.ubicacion_almacenamiento
FROM inventario i
JOIN productos pr ON i.id_producto = pr.id_producto
JOIN usuarios usu ON i.id_agricultor = usu.id_usuario
JOIN roles rol ON usu.id_rol = rol.id_rol
WHERE rol.nombre_rol = 'Agricultor';

-- Muestra pedidos con seguimiento asignado y fecha estimada de entrega (INNER JOIN)-- 8
SELECT ped.id_pedido, usu.nombre_usuario, ped.numero_seguimiento, ped.fecha_entrega_estimada
FROM pedidos ped
JOIN usuarios usu ON ped.id_usuario = usu.id_usuario
WHERE ped.numero_seguimiento is not null;


-- Muestra los productos que han recibido reseñas (RIGHT JOIN) -- 9
SELECT prod.nombre_producto, cr.texto_comentario as reseña
FROM productos prod
RIGHT JOIN comentario_resena cr ON prod.id_producto = cr.id_producto;


-- Muestra todos los pedidos que aún no han sido entregados, con nombre del cliente, ciudad y estado del pedido (LEFT JOIN) -- 10
SELECT  ped.id_pedido, u.nombre_usuario AS cliente, ped.ciudad_envio, ep.nombre_estado AS estado_pedido, ped.fecha_entrega_real
FROM pedidos ped
LEFT JOIN usuarios u ON ped.id_usuario = u.id_usuario
LEFT JOIN estado_pedido ep ON ped.id_estado_pedido = ep.id_estado_pedido
WHERE ped.fecha_entrega_real IS NULL;
