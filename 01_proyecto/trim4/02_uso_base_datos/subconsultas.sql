
-- nombre de los usuarios y el total de pedidos que a realizado--
SELECT 
  usuarios.nombre_usuario,
  (SELECT COUNT(*)
   FROM pedidos
   WHERE pedidos.id_usuario = usuarios.id_usuario) AS total_pedidos
FROM 
  usuarios;
  
 -- muestra promedio de calificacion por producto -- 
  SELECT 
  productos.nombre_producto,
  (SELECT 
  format(AVG(calificacion),0)
   FROM comentario_resena
   WHERE comentario_resena.id_producto = productos.id_producto) AS promedio_calificacion
	FROM productos;
  

 -- pedidos mayores al promedio general -- 
  SELECT 
  pedidos.id_pedido,concat("$",format(total_pedido,2)) as total
FROM pedidos
WHERE pedidos.total_pedido > 
(SELECT 
AVG(total_pedido) FROM pedidos);


-- muestra carritos con total de productos --
SELECT 
  carrito.id_carrito,
  temporal.total_productos
FROM 
  carrito
JOIN (
  SELECT 
    detalle_carrito.id_carrito,
    format(SUM(detalle_carrito.cantidad),0) AS total_productos
  FROM 
    detalle_carrito
  GROUP BY 
    detalle_carrito.id_carrito
) AS temporal ON carrito.id_carrito = temporal.id_carrito;


  
  -- total de ventas por cuidad--
SELECT 
ciudad_envio,total_ciudad
FROM (
  SELECT 
    ciudad_envio,format(SUM(total_pedido),0) AS total_ciudad
  FROM pedidos
  GROUP BY ciudad_envio
) AS temporal
WHERE total_ciudad > 500;


-- Agricultores que tienen productos con más de 2 reseñas aprobadas--
SELECT 
  usuarios.nombre_usuario AS agricultor
FROM 
  usuarios
WHERE 
  usuarios.id_usuario IN (
    SELECT inventario.id_agricultor
    FROM inventario
    JOIN comentario_resena ON inventario.id_producto = comentario_resena.id_producto
    WHERE comentario_resena.estado_comentario = 'Aprobado'
    GROUP BY inventario.id_agricultor
    HAVING COUNT(comentario_resena.id_comentario_resena) > 2
  );
  

 --  Clientes que tienen carritos abandonados con más de 3 productos --
 SELECT 
  usuarios.nombre_usuario,
  carrito.id_carrito,
  format(SUM(detalle_carrito.cantidad),0) AS total_productos
FROM carrito
JOIN 
  usuarios ON carrito.id_usuario = usuarios.id_usuario
JOIN 
  detalle_carrito ON carrito.id_carrito = detalle_carrito.id_carrito
WHERE carrito.estado_carrito = 'Abandonado'
GROUP BY usuarios.nombre_usuario,carrito.id_carrito
HAVING total_productos > 3;



-- Agricultores que han vendido más que el promedio de ventas de todos los agricultores --
SELECT 
  usuarios.nombre_usuario AS agricultor,
  CONCAT('$', FORMAT(SUM(detalle_pedido.cantidad * productos.precio_unitario), 2)) AS total_ventas
FROM 
  detalle_pedido
JOIN 
  productos ON detalle_pedido.id_producto = productos.id_producto
JOIN 
  inventario ON productos.id_producto = inventario.id_producto
JOIN 
  usuarios ON inventario.id_agricultor = usuarios.id_usuario
GROUP BY 
  usuarios.nombre_usuario
HAVING 
  SUM(detalle_pedido.cantidad * productos.precio_unitario) > (
    SELECT AVG(total)
    FROM (
      SELECT 
        SUM(detalle_pedido.cantidad * productos.precio_unitario) AS total
      FROM 
        detalle_pedido
      JOIN 
        productos ON detalle_pedido.id_producto = productos.id_producto
      JOIN 
        inventario ON productos.id_producto = inventario.id_producto
      GROUP BY 
        inventario.id_agricultor
    ) AS temporal
  );


  -- muestra agricultores que tienen al menos 2 productos en stock con descuento activo --
SELECT 
  usuarios.nombre_usuario AS agricultor,
  productos.nombre_producto AS producto
FROM 
  usuarios
JOIN 
  inventario ON inventario.id_agricultor = usuarios.id_usuario
JOIN 
  productos ON inventario.id_producto = productos.id_producto
JOIN 
  producto_descuento ON inventario.id_producto = producto_descuento.id_producto
JOIN 
  descuentos ON producto_descuento.id_descuento = descuentos.id_descuento
WHERE 
  descuentos.activo = 1 -- Filtra para mostrar solo descuentos que están activos.
  AND inventario.id_agricultor IN (
    SELECT 
      inventario.id_agricultor
    FROM 
      inventario
    JOIN 
      producto_descuento ON inventario.id_producto = producto_descuento.id_producto
    JOIN 
      descuentos ON producto_descuento.id_descuento = descuentos.id_descuento
    WHERE 
      descuentos.activo = 1
    GROUP BY 
      inventario.id_agricultor
    HAVING 
      COUNT(DISTINCT inventario.id_producto) >= 2
  );


