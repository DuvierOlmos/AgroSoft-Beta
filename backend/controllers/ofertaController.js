// backend/controllers/ofertaController.js

import { 
    getAllPromocionesByProductorId, 
    createDescuento, // Usaremos este para la creación
    updateOferta, 
    updateDescuento,
    deleteOferta,
    deleteDescuento
} from '../models/oferta.js'; 

// 1. OBTENER PROMOCIONES (Corrige el SyntaxError de exportación)
export const obtenerPromocionesProductor = async (req, res) => {
    // El ID se obtiene del parámetro de la URL: /api/ofertas/productor/:id
    const idProductor = req.params.id; 
    
    try {
        const promociones = await getAllPromocionesByProductorId(Number(idProductor));
        res.status(200).json(promociones);
    } catch (error) {
        console.error("Error al obtener promociones:", error);
        res.status(500).json({ message: "Error al cargar las promociones del productor." });
    }
};

// 2. CREAR NUEVA PROMOCIÓN (Asume creación de Descuento por el formulario)
export const crearNuevaOferta = async (req, res) => {
    try {
        // Los datos vienen del formulario de creación (porcentaje, fechas, idProducto)
        const newId = await createDescuento(req.body);

        res.status(201).json({ 
            id: newId, 
            message: "Solicitud de descuento enviada con éxito. Estado: PENDIENTE." 
        });
    } catch (error) {
        console.error("Error al crear la nueva oferta:", error);
        res.status(500).json({ error: "Error al crear la promoción." });
    }
};

// 3. ACTUALIZAR PROMOCIÓN
export const actualizarPromocion = async (req, res) => {
    const idPromocion = req.params.id;
    // El frontend pasa 'oferta' o 'descuento' en el query: ?tipo=oferta
    const tipo = req.query.tipo; 
    const data = req.body; 

    try {
        let affectedRows;
        
        if (tipo === 'Oferta' || tipo === 'oferta') {
            affectedRows = await updateOferta(Number(idPromocion), data);
        } else if (tipo === 'Descuento' || tipo === 'descuento') {
            affectedRows = await updateDescuento(Number(idPromocion), data);
        } else {
            return res.status(400).json({ message: "Tipo de promoción no válido." });
        }

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Promoción no encontrada o sin cambios." });
        }

        res.status(200).json({ message: "Promoción actualizada con éxito." });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ message: "Error interno del servidor al actualizar la promoción." });
    }
};

// 4. ELIMINAR PROMOCIÓN (Corrige el SyntaxError de exportación)
export const eliminarOferta = async (req, res) => {
    const idPromocion = req.params.id;
    // El frontend pasa 'oferta' o 'descuento' en el query: ?tipo=descuento
    const tipo = req.query.tipo; 

    try {
        let affectedRows = 0;
        
        if (tipo === 'oferta') {
            affectedRows = await deleteOferta(Number(idPromocion));
        } else if (tipo === 'descuento') {
            affectedRows = await deleteDescuento(Number(idPromocion));
        } else {
            return res.status(400).json({ message: "Tipo de promoción no válido para eliminar." });
        }

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Promoción no encontrada o ya eliminada." });
        }

        res.status(200).json({ message: "Promoción eliminada con éxito." });
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ message: "Error interno del servidor al eliminar la promoción." });
    }
};