-- Actualizar la columna estado de la tabla descuentos para agregar 'Eliminada' como opción

ALTER TABLE descuentos 
MODIFY COLUMN estado ENUM('Pendiente','Aprobado','Rechazado','Eliminada') DEFAULT 'Pendiente';

-- Este script actualiza el tipo ENUM de la columna estado para incluir la opción 'Eliminada'
-- Después de ejecutar esto, el código del backend podrá marcar promociones como eliminadas
-- sin perder los datos existentes.
