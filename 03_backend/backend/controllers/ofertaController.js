const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

const getUserId = (req) => req.user?.id_usuario || req.usuario?.id || req.query.id_usuario;


const getAllPromocionesByProductorId = async (req, res) => {
  try {
    const id_usuario = getUserId(req);

    if (!id_usuario) return res.status(401).json({ error: "Usuario no autenticado." });

    const sql = `
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
        p.url_imagen,
        DATE_FORMAT(d.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
        DATE_FORMAT(d.fecha_fin, '%Y-%m-%d') AS fecha_fin
      FROM producto_descuento pd
      INNER JOIN producto p ON pd.id_producto = p.id_producto
      INNER JOIN inventario i ON p.id_producto = i.id_producto
      INNER JOIN descuentos d ON pd.id_descuento = d.id_descuento
      WHERE i.id_agricultor = :id_usuario
      ORDER BY d.fecha_fin DESC;
    `;

    const data = await sequelize.query(sql, {
      replacements: { id_usuario },
      type: QueryTypes.SELECT,
    });

    res.json(data);
  } catch (error) {
    console.error(" Error al obtener promociones:", error);
    res.status(500).json({ error: "Error al obtener promociones" });
  }
};

const createDescuento = async (req, res) => {
  const id_usuario = req.user?.id_usuario;
  const { idProducto, porcentaje, fechaInicio, fechaFin } = req.body;

  if (!id_usuario)
    return res.status(401).json({ error: "Usuario no autenticado." });

  try {

    const [producto] = await sequelize.query(
      `SELECT p.id_producto, i.id_agricultor 
       FROM producto p
       INNER JOIN inventario i ON p.id_producto = i.id_producto
       WHERE p.id_producto = :idProducto AND i.id_agricultor = :id_usuario`,
      { replacements: { idProducto, id_usuario }, type: QueryTypes.SELECT }
    );

    if (!producto)
      return res
        .status(404)
        .json({ error: "Producto no encontrado o no pertenece al productor." });

    const estado = "Pendiente";



    const nombre_descuento = `Descuento ${porcentaje}`;
    const tipo_descuento = "Porcentaje";

    const t = await sequelize.transaction();
    try {
      const insertDesc = `
        INSERT INTO descuentos (id_productor, nombre_descuento, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, codigo_descuento, activo)
        VALUES (:id_usuario, :nombre_descuento, :tipo_descuento, :porcentaje, :fechaInicio, :fechaFin, NULL, 1);
      `;

      await sequelize.query(insertDesc, {
        replacements: { id_usuario, nombre_descuento, tipo_descuento, porcentaje, fechaInicio, fechaFin },
        transaction: t,
      });

      const linkSql = `
        INSERT INTO producto_descuento (id_producto, id_descuento)
        VALUES (:idProducto, LAST_INSERT_ID());
      `;
      await sequelize.query(linkSql, { replacements: { idProducto }, transaction: t });

  
      const [{ lastId }] = await sequelize.query("SELECT LAST_INSERT_ID() as lastId;", { transaction: t, type: QueryTypes.SELECT });

      await t.commit();

      res.json({ mensaje: "Descuento creado correctamente.", id_descuento: lastId });
      return;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (error) {
    console.error(" Error al crear descuento:", error);
    res.status(500).json({ error: "Error al crear descuento" });
  }
};



const updateDescuento = async (req, res) => {
  const id_usuario = req.user?.id_usuario;
  const { idDescuento } = req.params;
  const { porcentaje, fechaInicio, fechaFin, estado } = req.body;

  if (!id_usuario)
    return res.status(401).json({ error: "Usuario no autenticado." });

  try {
    const sql = `
      UPDATE descuentos
      SET valor_descuento = :porcentaje, fecha_inicio = :fechaInicio,
          fecha_fin = :fechaFin, estado = :estado
      WHERE id_descuento = :idDescuento;
    `;
    await sequelize.query(sql, {
      replacements: { porcentaje, fechaInicio, fechaFin, estado, idDescuento },
    });

    res.json({ mensaje: "Descuento actualizado correctamente." });
  } catch (error) {
    console.error(" Error al actualizar descuento:", error);
    res.status(500).json({ error: "Error al actualizar descuento" });
  }
};

const deleteDescuento = async (req, res) => {
  const id_usuario = req.user?.id_usuario;
  const { idDescuento } = req.params;

  if (!id_usuario)
    return res.status(401).json({ error: "Usuario no autenticado." });

  try {
    await sequelize.query(
      `DELETE FROM producto_descuento WHERE id_descuento = :idDescuento`,
      { replacements: { idDescuento } }
    );
    await sequelize.query(
      `DELETE FROM descuentos WHERE id_descuento = :idDescuento`,
      { replacements: { idDescuento } }
    );

    res.json({ mensaje: "Descuento eliminado correctamente." });
  } catch (error) {
    console.error(" Error al eliminar descuento:", error);
    res.status(500).json({ error: "Error al eliminar descuento" });
  }
};

module.exports = {
  getAllPromocionesByProductorId,
  createDescuento,
  updateDescuento,
  deleteDescuento,
};
