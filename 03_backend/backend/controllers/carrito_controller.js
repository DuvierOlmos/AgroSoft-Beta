const { sequelize, Carrito, DetalleCarrito, Producto, User } = require('../models');

console.log("🔍 Modelos cargados en carritoController:");
console.log("Carrito:", Carrito instanceof sequelize.Sequelize.Model);
console.log("DetalleCarrito:", DetalleCarrito instanceof sequelize.Sequelize.Model);
console.log("Producto:", Producto instanceof sequelize.Sequelize.Model);
const carritoController = {
    // ✅ Obtener el número de items del carrito
    getNumeroItems: async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const carrito = await Carrito.findOne({
                where: {
                    id_usuario,
                    estado_carrito: 'Activo'
                },
                include: [{
                    model: DetalleCarrito,
                    attributes: ['cantidad']
                }]
            });

            const numeroItems = carrito?.DetalleCarritos?.reduce(
                (total, item) => total + item.cantidad, 0
            ) || 0;

            res.json({
                success: true,
                data: numeroItems
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // ✅ Obtener carrito activo y sus items
    getCarritoActivo: async (req, res) => {
        try {
            const { id_usuario } = req.params;
            let carrito = await Carrito.findOne({
                where: {
                    id_usuario,
                    estado_carrito: 'Activo'
                },
                include: [{
                    model: DetalleCarrito,
                    include: [{
                        model: Producto,
                        attributes: ['nombre_producto', 'precio_unitario', 'url_imagen', 'unidad_medida', 'stock']
                    }]
                }]
            });

            if (!carrito) {
                carrito = await Carrito.create({
                    id_usuario,
                    estado_carrito: 'Activo'
                });
            }

            res.json({
                success: true,
                data: carrito
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // ✅ Obtener los items de un carrito
    getCarritoItems: async (req, res) => {
        try {
            const { id_carrito } = req.params;
            const items = await DetalleCarrito.findAll({
                where: { id_carrito },
                include: [{
                    model: Producto,
                    attributes: ['nombre_producto', 'precio_unitario', 'url_imagen', 'unidad_medida', 'stock']
                }]
            });

            res.json({
                success: true,
                data: items
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // ✅ Agregar producto al carrito
    addToCart: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id_usuario, id_producto, cantidad } = req.body;

            const producto = await Producto.findByPk(id_producto);
            if (!producto || producto.stock < cantidad) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock insuficiente'
                });
            }

            let carrito = await Carrito.findOne({
                where: {
                    id_usuario,
                    estado_carrito: 'Activo'
                },
                transaction: t
            });

            if (!carrito) {
                carrito = await Carrito.create({
                    id_usuario,
                    estado_carrito: 'Activo'
                }, { transaction: t });
            }

            let item = await DetalleCarrito.findOne({
                where: {
                    id_carrito: carrito.id_carrito,
                    id_producto
                },
                transaction: t
            });

            if (item) {
                const nuevaCantidad = item.cantidad + cantidad;
                if (nuevaCantidad > producto.stock) {
                    return res.status(400).json({
                        success: false,
                        message: 'Stock insuficiente'
                    });
                }
                await item.update({ cantidad: nuevaCantidad }, { transaction: t });
            } else {
                item = await DetalleCarrito.create({
                    id_carrito: carrito.id_carrito,
                    id_producto,
                    cantidad,
                    precio_unitario: producto.precio_unitario
                }, { transaction: t });
            }

            await t.commit();
            res.json({ success: true, data: item });
        } catch (error) {
            await t.rollback();
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // ✅ Actualizar cantidad de un item
    updateCarritoItem: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id_item } = req.params;
            const { cantidad } = req.body;

            const item = await DetalleCarrito.findOne({
                where: { id_item },
                include: [{ model: Producto, attributes: ['stock'] }],
                transaction: t
            });

            if (!item) {
                return res.status(404).json({ success: false, message: 'Item no encontrado' });
            }

            if (cantidad > item.Producto.stock) {
                return res.status(400).json({ success: false, message: 'Stock insuficiente' });
            }

            await item.update({ cantidad }, { transaction: t });
            await t.commit();
            res.json({ success: true });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ✅ Eliminar un item
    deleteCarritoItem: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id_item } = req.params;
            const deleted = await DetalleCarrito.destroy({
                where: { id_item },
                transaction: t
            });

            if (deleted === 0) {
                return res.status(404).json({ success: false, message: 'Item no encontrado' });
            }

            await t.commit();
            res.json({ success: true });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ✅ Procesar compra
    procesarCompra: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id_carrito, id_usuario } = req.body;

            const items = await DetalleCarrito.findAll({
                where: { id_carrito },
                include: [Producto],
                transaction: t
            });

            for (const item of items) {
                if (item.cantidad > item.Producto.stock) {
                    await t.rollback();
                    return res.status(400).json({
                        success: false,
                        message: `Stock insuficiente para ${item.Producto.nombre_producto}`
                    });
                }

                await item.Producto.update(
                    { stock: item.Producto.stock - item.cantidad },
                    { transaction: t }
                );
            }

            await Carrito.update(
                { estado_carrito: 'Completado', fecha_ultima_actualizacion: new Date() },
                { where: { id_carrito }, transaction: t }
            );

            await Carrito.create(
                { id_usuario, estado_carrito: 'Activo' },
                { transaction: t }
            );

            await t.commit();
            res.json({ success: true });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = carritoController;
