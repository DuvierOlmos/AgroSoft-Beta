const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

// Función auxiliar para obtener el ID de usuario desde la petición
const getUserId = (req) => {
  return req.user?.id_usuario || req.usuario?.id_usuario || req.query.id_usuario;
};

// 📊 Datos financieros
const getDatosFinancieros = async (req, res) => {
  try {
    const id_usuario = getUserId(req);
    if (!id_usuario) {
      console.log("Usuario no autenticado - ID faltante");
      return res.status(401).json({ error: "Usuario no autenticado." });
    }

    console.log("Obteniendo datos financieros para usuario:", id_usuario);

    // 1. Primero obtenemos el ID del estado "Entregado"
    const estadoEntregado = await sequelize.query(
      "SELECT id_estado_pedido FROM estado_pedido WHERE nombre_estado = 'Entregado' LIMIT 1",
      { type: QueryTypes.SELECT }
    );

    if (!estadoEntregado.length) {
      console.log("Estado 'Entregado' no encontrado en la BD");
      return res.status(500).json({ error: "Estado 'Entregado' no encontrado." });
    }

    const idEstadoEntregado = estadoEntregado[0].id_estado_pedido;
    console.log("ID estado entregado:", idEstadoEntregado);

    // 2. Calculamos ingresos y ventas pendientes
    const ingresos = await sequelize.query(
      `
      SELECT 
        COALESCE(SUM(CASE 
          WHEN ped.id_estado_pedido = :idEstadoEntregado THEN dp.cantidad * dp.precio_unitario_al_momento 
          ELSE 0 
        END), 0) as ingresos_totales,
        COALESCE(SUM(CASE 
          WHEN ped.id_estado_pedido != :idEstadoEntregado THEN dp.cantidad * dp.precio_unitario_al_momento 
          ELSE 0 
        END), 0) as ventas_pendientes
      FROM detalle_pedido dp
      INNER JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
      INNER JOIN producto p ON dp.id_producto = p.id_producto
      WHERE p.id_usuario = :id_usuario
      `,
      {
        replacements: { id_usuario, idEstadoEntregado },
        type: QueryTypes.SELECT,
      }
    );

    // 3. Calculamos costos (suma de subtotales - descuentos)
    const costos = await sequelize.query(
      `
      SELECT 
        COALESCE(SUM(CASE 
          WHEN ped.id_estado_pedido = :idEstadoEntregado THEN (dp.subtotal - COALESCE(dp.descuento_aplicado_monto, 0))
          ELSE 0 
        END), 0) as costos_totales,
        COALESCE(SUM(CASE 
          WHEN ped.id_estado_pedido != :idEstadoEntregado THEN (dp.subtotal - COALESCE(dp.descuento_aplicado_monto, 0))
          ELSE 0 
        END), 0) as costos_pendientes
      FROM detalle_pedido dp
      INNER JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
      INNER JOIN producto p ON dp.id_producto = p.id_producto
      WHERE p.id_usuario = :id_usuario
      `,
      {
        replacements: { id_usuario, idEstadoEntregado },
        type: QueryTypes.SELECT,
      }
    );

    const ingresos_totales = Number(ingresos[0].ingresos_totales);
    const ventas_pendientes = Number(ingresos[0].ventas_pendientes);
    const costos_totales = Number(costos[0].costos_totales);
    const costos_pendientes = Number(costos[0].costos_pendientes);
    
    const ganancia = ingresos_totales - costos_totales;
    const ganancia_potencial = ventas_pendientes - costos_pendientes;

    console.log("Resumen financiero calculado:", {
      ingresos: ingresos_totales,
      ingresos_pendientes: ventas_pendientes,
      costos: costos_totales,
      costos_pendientes: costos_pendientes,
      ganancia_actual: ganancia,
      ganancia_potencial: ganancia_potencial
    });

    res.json({
      ingresos: {
        completados: ingresos_totales,
        pendientes: ventas_pendientes,
        total: ingresos_totales + ventas_pendientes
      },
      costos: {
        completados: costos_totales,
        pendientes: costos_pendientes,
        total: costos_totales + costos_pendientes
      },
      ganancia: {
        actual: ganancia,
        potencial: ganancia_potencial,
        total: ganancia + ganancia_potencial
      }
    });
  } catch (error) {
    console.error("Error al obtener datos financieros:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};

// 📈 Ventas por mes
const getVentasPorMes = async (req, res) => {
  try {
    const id_usuario = getUserId(req);
    if (!id_usuario) {
      return res.status(401).json({ error: "Usuario no autenticado." });
    }

    // Primero obtenemos el ID del estado "Entregado"
    const estadoEntregado = await sequelize.query(
      "SELECT id_estado_pedido FROM estado_pedido WHERE nombre_estado = 'Entregado' LIMIT 1",
      { type: QueryTypes.SELECT }
    );

    if (!estadoEntregado.length) {
      return res.status(500).json({ error: "Estado 'Entregado' no encontrado." });
    }

    const idEstadoEntregado = estadoEntregado[0].id_estado_pedido;

    const resultados = await sequelize.query(
      `
      WITH RECURSIVE meses AS (
        SELECT 1 as mes
        UNION ALL
        SELECT mes + 1 FROM meses WHERE mes < 12
      )
      SELECT 
        m.mes,
        COALESCE(SUM(CASE 
          WHEN ped.id_estado_pedido = :idEstadoEntregado THEN dp.cantidad * dp.precio_unitario_al_momento 
          ELSE 0 
        END), 0) as totalVentas,
        COALESCE(SUM(CASE 
          WHEN ped.id_estado_pedido != :idEstadoEntregado THEN dp.cantidad * dp.precio_unitario_al_momento 
          ELSE 0 
        END), 0) as ventasPendientes
      FROM meses m
      LEFT JOIN pedidos ped ON MONTH(ped.fecha_pedido) = m.mes
      LEFT JOIN detalle_pedido dp ON ped.id_pedido = dp.id_pedido
      LEFT JOIN producto p ON dp.id_producto = p.id_producto AND p.id_usuario = :id_usuario
      GROUP BY m.mes
      ORDER BY m.mes;
      `,
      {
        replacements: { id_usuario, idEstadoEntregado },
        type: QueryTypes.SELECT,
      }
    );

    // Normalizar los resultados
    const ventasPorMes = resultados.map(r => ({
      mes: Number(r.mes),
      totalVentas: Number(r.totalVentas) || 0
    }));

    console.log("Ventas por mes:", ventasPorMes);

    res.json(ventasPorMes);
  } catch (error) {
    console.error("Error al obtener ventas por mes:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};


const getProductosMasVendidos = async (req, res) => {
  try {
    const id_usuario = getUserId(req);
    if (!id_usuario) {
      return res.status(401).json({ error: "Usuario no autenticado." });
    }

    const estadoEntregado = await sequelize.query(
      "SELECT id_estado_pedido FROM estado_pedido WHERE nombre_estado = 'Entregado' LIMIT 1",
      { type: QueryTypes.SELECT }
    );

    if (!estadoEntregado.length) {
      return res.status(500).json({ error: "Estado 'Entregado' no encontrado." });
    }

    const idEstadoEntregado = estadoEntregado[0].id_estado_pedido;

    const resultados = await sequelize.query(
      `
      SELECT
        p.id_producto,
        p.nombre_producto,
        COALESCE(SUM(inv.vendido), 0) AS vendidoInventario,
        COALESCE(SUM(CASE WHEN ped.id_estado_pedido = :idEstadoEntregado THEN dp.cantidad ELSE 0 END), 0) AS vendidoDetalle,
        COALESCE(SUM(CASE WHEN ped.id_estado_pedido != :idEstadoEntregado THEN dp.cantidad ELSE 0 END), 0) AS cantidadPendiente,
        -- Usar inventario.vendido si existe (>0), en caso contrario usar lo registrado en detalle_pedido
        CASE WHEN COALESCE(SUM(inv.vendido), 0) > 0 THEN COALESCE(SUM(inv.vendido), 0)
             ELSE COALESCE(SUM(CASE WHEN ped.id_estado_pedido = :idEstadoEntregado THEN dp.cantidad ELSE 0 END), 0)
        END AS cantidadVendida
      FROM producto p
      LEFT JOIN inventario inv ON p.id_producto = inv.id_producto AND inv.id_agricultor = :id_usuario
      LEFT JOIN detalle_pedido dp ON p.id_producto = dp.id_producto
      LEFT JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
      WHERE p.id_usuario = :id_usuario
      GROUP BY p.id_producto, p.nombre_producto
      HAVING (COALESCE(SUM(inv.vendido),0) + COALESCE(SUM(CASE WHEN ped.id_estado_pedido = :idEstadoEntregado THEN dp.cantidad ELSE 0 END),0) + COALESCE(SUM(CASE WHEN ped.id_estado_pedido != :idEstadoEntregado THEN dp.cantidad ELSE 0 END),0)) > 0
      ORDER BY cantidadVendida DESC, cantidadPendiente DESC;
      `,
      {
        replacements: { id_usuario, idEstadoEntregado },
        type: QueryTypes.SELECT,
      }
    );

    console.log("Productos más vendidos:", resultados);

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};

// 📦 Estado de las órdenes
const getOrdenesEstado = async (req, res) => {
  try {
    const id_usuario = getUserId(req);
    if (!id_usuario) {
      return res.status(401).json({ error: "Usuario no autenticado." });
    }

    const resultados = await sequelize.query(
      `
      SELECT 
        CASE 
          WHEN ep.nombre_estado = 'Entregado' THEN 'Completadas'
          ELSE 'Activas'
        END as estado,
        COUNT(DISTINCT ped.id_pedido) as total
      FROM pedidos ped
      INNER JOIN estado_pedido ep ON ped.id_estado_pedido = ep.id_estado_pedido
      INNER JOIN detalle_pedido dp ON ped.id_pedido = dp.id_pedido
      INNER JOIN producto p ON dp.id_producto = p.id_producto
      WHERE p.id_usuario = :id_usuario
      GROUP BY CASE 
        WHEN ep.nombre_estado = 'Entregado' THEN 'Completadas'
        ELSE 'Activas'
      END;
      `,
      {
        replacements: { id_usuario },
        type: QueryTypes.SELECT,
      }
    );

    const ordenes = {
      activas: resultados.find(r => r.estado === 'Activas')?.total || 0,
      completadas: resultados.find(r => r.estado === 'Completadas')?.total || 0
    };

    console.log("Estado de órdenes:", ordenes);

    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener estado de órdenes:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};

module.exports = {
  getDatosFinancieros,
  getVentasPorMes,
  getProductosMasVendidos,
  getOrdenesEstado,
};
