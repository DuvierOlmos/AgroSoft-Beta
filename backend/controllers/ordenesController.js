import { Orden } from "../models/orden.js";
import db  from "../config/db.js";
export const obtenerOrdenes = async (req, res) => {
  
  const { idProductor } = req.params; 
  
  if (!idProductor) {
     return res.status(400).json({ error: "ID de productor es requerido." });
  }

  try {
    const rows = await Orden.getByProductorId(idProductor); 
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener órdenes por productor:", error);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

export const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await Orden.updateEstado(id, estado);

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar estado de la orden" });
  }
};

export const obtenerDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        dp.id_detalle_pedido,
        p.nombre_producto,
        dp.cantidad,
        dp.subtotal
      FROM detalle_pedido dp
      JOIN producto p ON dp.id_producto = p.id_producto
      WHERE dp.id_pedido = ?;
    `, [id]);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener detalle de orden:", error);
    res.status(500).json({ error: "Error al obtener detalle de la orden" });
  }
};