USE agrosoft2;

-- Obtener todos los usuarios registrados -- 1
SELECT * FROM usuarios;




-- Muestra todos los productos activos -- 2
SELECT nombre_producto, estado_producto
FROM productos
WHERE estado_producto = 'Activo';




 -- Muestra todos los productos agotados -- 3
 SELECT nombre_producto, estado_producto
 FROM productos
 WHERE estado_producto = 'agotado';
 
 
 
 
 -- Muestra todos los productos inactivos -- 4
SELECT nombre_producto, estado_producto
 FROM productos
 WHERE estado_producto = 'inactivo';
 
 
 
 
 -- Categorias con nombre "fruta" -- 5
 SELECT *
 FROM categorias 
 WHERE nombre_categoria LIKE '%Fruta%';
 
 
 

 -- Productos calificados con 5 estrellas -- 6
  SELECT DISTINCT calificacion as estrellas,  nombre_producto
  FROM comentario_resena , productos 
  WHERE calificacion = 5;
  
  
  
 -- Muestra detalles de los descuentos activos --7
SELECT nombre_descuento, tipo_descuento, valor_descuento FROM descuentos WHERE activo = TRUE;




-- Muestra las ofertas que finalizan despues del 31 de diciembre de 2025 --8
SELECT nombre_oferta, fecha_fin, tipo_oferta 
FROM ofertas 
WHERE fecha_fin > '2025-12-31';




-- Encuentra los pedidos realizados por un cliente en especifico -- 9
SELECT *
FROM pedidos 
WHERE id_usuario = 25;



-- Muestra los pedidos en carrito con cantidad mayor a 5 -- 10
SELECT id_carrito, id_producto , cantidad , subtotal
FROM detalle_carrito
WHERE cantidad > 5;


-- Muestra los pedidos con ciudad de envio "Bogotá" -- 
SELECT id_pedido, direccion_envio, ciudad_envio
FROM pedidos
WHERE ciudad_envio = 'Bogotá';