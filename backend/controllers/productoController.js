import { Productor } from "../models/productor.js";

const productorModel = new Productor();

export const getProductos = async (req, res) => {
  try {
    const id_usuario = req.usuario ? req.usuario.id : req.query.id_usuario; 

    let productos;

    if (id_usuario) {
      productos = await productorModel.findByUserId(id_usuario);
    } else {
      productos = await productorModel.findAll();
    }
    
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos." });
  }
};

export const addProducto = async (req, res) => {
  try {
    console.log("Datos recibidos para añadir producto:", req.body);
    
    if (!req.body.id_usuario) {
      return res.status(400).json({ error: "id_usuario es requerido para añadir el producto." });
    }

    // ✅ CORRECCIÓN CLAVE: Asegurar que los datos numéricos son de tipo Number
    const productoData = {
        ...req.body,
        precio_unitario: Number(req.body.precio_unitario),
        cantidad: Number(req.body.cantidad),
        id_SubCategoria: Number(req.body.id_SubCategoria),
        id_usuario: Number(req.body.id_usuario),
    };

    const newId = await productorModel.create(productoData);
    res.status(201).json({ id: newId, message: "Producto añadido correctamente." });
  } catch (error) {
    console.error("Error al añadir el producto:", error);
    res.status(500).json({ error: "Error al añadir el producto." });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CORRECCIÓN CLAVE: Asegurar que los datos numéricos son de tipo Number
    const productoData = {
        ...req.body,
        precio_unitario: Number(req.body.precio_unitario),
        cantidad: Number(req.body.cantidad),
    };
    
    const idNum = Number(id); 
    
    const affectedRows = await productorModel.update(idNum, productoData);
    
    if (affectedRows > 0) {
      res.status(200).json({ message: "Producto actualizado correctamente." });
    } else {
      res.status(404).json({ error: "Producto no encontrado o datos idénticos, no se realizaron cambios." });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await productorModel.deactivate(Number(id)); 
    if (affectedRows > 0) {
      res.status(200).json({ message: "Producto eliminado correctamente." });
    } else {
      res.status(404).json({ error: "Producto no encontrado." });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto." });
  }
};