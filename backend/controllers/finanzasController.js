import  db  from "../config/db.js";

// Función auxiliar para obtener el ID de usuario de la solicitud
const getUserId = (req) => {
    // Priorizamos una simulación de sesión (req.usuario.id) sobre el query parameter
    return req.usuario ? req.usuario.id : req.query.id_usuario; 
};

// 📊 Controlador para obtener datos financieros principales
export const getDatosFinancieros = async (req, res) => {
    try {
        const id_usuario = getUserId(req);

        if (!id_usuario) {
             return res.status(401).json({ error: "ID de usuario requerido para datos financieros." });
        }

        // Obtener ID del estado 'Entregado' una vez
        const [estadoEntregadoResult] = await db.query(
            "SELECT id_estado_pedido FROM estado_pedido WHERE nombre_estado = 'Entregado'"
        );
        const idEstadoEntregado = estadoEntregadoResult.length > 0 ? estadoEntregadoResult[0].id_estado_pedido : null;

        if (!idEstadoEntregado) {
             return res.status(500).json({ error: "Estado 'Entregado' no encontrado." });
        }

        // CORRECCIÓN: Se usa dp.precio_unitario_al_momento
        const [ingresosResult] = await db.query(`
            SELECT COALESCE(SUM(dp.cantidad * dp.precio_unitario_al_momento), 0) AS ingresos_totales
            FROM detalle_pedido dp
            JOIN producto p ON dp.id_producto = p.id_producto
            JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
            WHERE p.id_usuario = ?
              AND ped.id_estado_pedido = ?;
        `, [id_usuario, idEstadoEntregado]);

        // Consulta de Costos/Ventas Netas (usando subtotal - descuento, filtrado por usuario)
        const [costosResult] = await db.query(`
            SELECT COALESCE(SUM(dp.subtotal - dp.descuento_aplicado_monto), 0) AS costos_totales
            FROM detalle_pedido dp
            JOIN producto p ON dp.id_producto = p.id_producto
            JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
            WHERE p.id_usuario = ?
              AND ped.id_estado_pedido = ?;
        `, [id_usuario, idEstadoEntregado]);

        const ingresos_totales = Number(ingresosResult[0].ingresos_totales) || 0;
        const costos_totales = Number(costosResult[0].costos_totales) || 0;
        const ganancia_bruta = ingresos_totales - costos_totales;

        res.json({
            ingresos: ingresos_totales,
            costos: costos_totales,
            ganancia: ganancia_bruta,
        });
    } catch (error) {
        console.error("Error al obtener los datos financieros:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📈 Ventas por mes
export const getVentasPorMes = async (req, res) => {
    try {
        const id_usuario = getUserId(req);
        if (!id_usuario) return res.status(401).json({ error: "ID de usuario requerido." });

        // CORRECCIÓN: Se usa dp.precio_unitario_al_momento
        const [results] = await db.query(`
            SELECT MONTH(ped.fecha_pedido) AS mes, SUM(dp.cantidad * dp.precio_unitario_al_momento) AS totalVentas
            FROM detalle_pedido dp
            JOIN producto p ON dp.id_producto = p.id_producto
            JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
            WHERE p.id_usuario = ?
            GROUP BY mes
            ORDER BY mes;
        `, [id_usuario]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener ventas por mes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🛒 Productos más vendidos
export const getProductosMasVendidos = async (req, res) => {
    try {
        const id_usuario = getUserId(req);
        if (!id_usuario) return res.status(401).json({ error: "ID de usuario requerido." });

        // Filtro por id_usuario
        const [results] = await db.query(`
            SELECT p.nombre_producto, SUM(dp.cantidad) AS cantidadVendida
            FROM detalle_pedido dp
            JOIN producto p ON dp.id_producto = p.id_producto
            WHERE p.id_usuario = ?
            GROUP BY p.nombre_producto
            ORDER BY cantidadVendida DESC
            LIMIT 5;
        `, [id_usuario]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener productos más vendidos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 📦 Estado de las órdenes
export const getOrdenesEstado = async (req, res) => {
    try {
        const id_usuario = getUserId(req);
        if (!id_usuario) return res.status(401).json({ error: "ID de usuario requerido." });

        // Filtro por id_usuario
        const [results] = await db.query(`
            SELECT
                CASE
                    WHEN ep.nombre_estado = 'Entregado' THEN 'Completadas'
                    ELSE 'Activas'
                END AS estado,
                COUNT(DISTINCT p.id_pedido) AS total
            FROM pedidos p
            JOIN estado_pedido ep ON p.id_estado_pedido = ep.id_estado_pedido
            WHERE p.id_pedido IN ( 
                SELECT dp.id_pedido
                FROM detalle_pedido dp
                JOIN producto prod ON dp.id_producto = prod.id_producto
                WHERE prod.id_usuario = ?
            )
            GROUP BY estado;
        `, [id_usuario]);

        const ordenes = {
            activas: results.find((item) => item.estado === "Activas")?.total || 0,
            completadas: results.find((item) => item.estado === "Completadas")?.total || 0,
        };

        res.status(200).json(ordenes);
    } catch (error) {
        console.error("Error al obtener el estado de las órdenes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};