// backend/models/oferta.js (Código FINAL y COMPLETO)

import db from '../config/db.js'; 

// Subconsulta para obtener la URL de la imagen principal del producto
const getImageUrlSubquery = `
    (SELECT 
        pi.url_imagen 
    FROM 
        producto_imagenes pi 
    WHERE 
        pi.id_producto = p.id_producto 
    ORDER BY 
        pi.id_imagen ASC 
    LIMIT 1) AS url_imagen
`;

// ------------------- READ (R) -------------------
export const getAllPromocionesByProductorId = async (idProductor) => {
    
    // Consulta para obtener TODAS las OFERTAS (COMENTADO TEMPORALMENTE)
    // const offersSql = `...`;

    // Consulta para obtener TODOS los DESCUENTOS
    const discountsSql = `
        SELECT
            d.id_descuento AS id_promocion,
            p.id_producto,
            p.nombre_producto AS producto,
            p.precio_unitario AS precio_original, 
            d.valor_descuento AS porcentaje_descuento,
            CONCAT('Descuento ', d.valor_descuento, '%') AS nombre,
            NULL AS descripcion, 
            'Descuento' AS tipo_deal,
            d.estado AS estado,
            -- Temporalmente deshabilitamos la subconsulta compleja.
            NULL AS url_imagen, 
            DATE_FORMAT(d.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
            DATE_FORMAT(d.fecha_fin, '%Y-%m-%d') AS fecha_fin
        FROM
            producto_descuento pd
        INNER JOIN
            producto p ON pd.id_producto = p.id_producto
        INNER JOIN
            inventario i ON p.id_producto = i.id_producto
        INNER JOIN
            descuentos d ON pd.id_descuento = d.id_descuento
        WHERE
            i.id_agricultor = ?
        ORDER BY
            d.fecha_fin DESC;
    `;

    try {
        // Ejecutar SOLO la consulta de Descuentos
        const [discounts] = await db.query(discountsSql, [Number(idProductor)]);
        
        // Devolver solo los descuentos
        return discounts; 
        
    } catch (error) {
        console.error("Error al obtener promociones:", error);
        throw new Error("Fallo al obtener promociones de la base de datos.");
    }
};

// ------------------- CREATE (C) -------------------
export const createDescuento = async ({ idProducto, porcentaje, fechaInicio, fechaFin }) => {
    const estadoInicial = 'Pendiente'; 
    
    const insertDescuentoSql = `
        INSERT INTO descuentos 
        (valor_descuento, fecha_inicio, fecha_fin, estado) 
        VALUES (?, ?, ?, ?);
    `;
    
    try {
        const [result] = await db.query(insertDescuentoSql, [porcentaje, fechaInicio, fechaFin, estadoInicial]);
        const idDescuento = result.insertId;

        const linkSql = `
            INSERT INTO producto_descuento (id_producto, id_descuento) 
            VALUES (?, ?);
        `;
        await db.query(linkSql, [idProducto, idDescuento]);

        return idDescuento;

    } catch (error) {
        console.error("Error al crear el descuento:", error);
        throw new Error("No se pudo registrar el descuento en la base de datos.");
    }
};

// ------------------- UPDATE (U) -------------------
export const updateOferta = async (idOferta, data) => {
    const { idProducto, nombre, descripcion, fechaInicio, fechaFin, estado } = data;
    
    const updateOfertaSql = `
        UPDATE ofertas 
        SET nombre_oferta = ?, descripcion_oferta = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
        WHERE id_oferta = ?;
    `;
    const [resultOferta] = await db.query(updateOfertaSql, [nombre, descripcion, fechaInicio, fechaFin, estado, idOferta]);
    
    if (idProducto) {
        const updateLinkSql = `UPDATE producto_oferta SET id_producto = ? WHERE id_oferta = ?;`;
        await db.query(updateLinkSql, [idProducto, idOferta]);
    }
    
    return resultOferta.affectedRows;
};

export const updateDescuento = async (idDescuento, data) => {
    const { idProducto, porcentaje, fechaInicio, fechaFin, estado } = data;
    
    const updateDescuentoSql = `
        UPDATE descuentos 
        SET valor_descuento = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
        WHERE id_descuento = ?;
    `;
    const [resultDescuento] = await db.query(updateDescuentoSql, [porcentaje, fechaInicio, fechaFin, estado, idDescuento]);

    if (idProducto) {
        const updateLinkSql = `UPDATE producto_descuento SET id_producto = ? WHERE id_descuento = ?;`;
        await db.query(updateLinkSql, [idProducto, idDescuento]);
    }
    
    return resultDescuento.affectedRows;
};

// ------------------- DELETE (D) -------------------
export const deleteOferta = async (idOferta) => {
    try {
        await db.query(`DELETE FROM producto_oferta WHERE id_oferta = ?`, [idOferta]);
        const [result] = await db.query(`DELETE FROM ofertas WHERE id_oferta = ?`, [idOferta]);
        return result.affectedRows; 
    } catch (error) {
        console.error("Error al eliminar la oferta:", error);
        throw new Error("No se pudo eliminar la oferta de la base de datos.");
    }
};

export const deleteDescuento = async (idDescuento) => {
    try {
        await db.query(`DELETE FROM producto_descuento WHERE id_descuento = ?`, [idDescuento]);
        const [result] = await db.query(`DELETE FROM descuentos WHERE id_descuento = ?`, [idDescuento]);
        return result.affectedRows; 
    } catch (error) {
        console.error("Error al eliminar el descuento:", error);
        throw new Error("No se pudo eliminar el descuento de la base de datos.");
    }
};