import db  from "../config/db.js";

export const Orden = {
  

  getByProductorId: async (idProductor) => {
    const [rows] = await db.query(`
      SELECT DISTINCT
        p.id_pedido AS id,
        ...
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN estado_pedido e ON p.id_estado_pedido = e.id_estado_pedido
      JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido  // VINCULO 1
      JOIN producto pr ON dp.id_producto = pr.id_producto    // VINCULO 2
      WHERE pr.id_usuario = ? // FILTRO POR PRODUCTOR ID
      ORDER BY p.fecha_pedido DESC;
    `, [idProductor]);
    return rows;
  },
  /**
   * Obtiene todas las órdenes que contienen productos vendidos por el productor especificado.
   * Usa 'pr.id_usuario' como ID del productor, según tu esquema.
   * @param {number} idProductor - El ID del usuario productor.
   */
  getByProductorId: async (idProductor) => {
    const [rows] = await db.query(`
      SELECT DISTINCT
        p.id_pedido AS id,
        u.nombre_usuario AS cliente,
        p.fecha_pedido AS fecha,
        e.nombre_estado AS estado,
        p.total_pedido AS total,
        p.direccion_envio,
        p.ciudad_envio,
        p.codigo_postal_envio,
        p.numero_seguimiento
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN estado_pedido e ON p.id_estado_pedido = e.id_estado_pedido
      JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
      JOIN producto pr ON dp.id_producto = pr.id_producto
      WHERE pr.id_usuario = ? 
      ORDER BY p.fecha_pedido DESC;
    `, [idProductor]);
    return rows;
  },

  updateEstado: async (id, nuevoEstado) => {
    const [rows] = await db.query(
      `UPDATE pedidos 
        SET id_estado_pedido = (
          SELECT id_estado_pedido 
          FROM estado_pedido 
          WHERE nombre_estado = ?
        )
        WHERE id_pedido = ?`,
      [nuevoEstado, id]
    );
    return rows;
  }
};