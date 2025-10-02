import db from '../config/db.js';

export class Productor {
  async create(producto) {
    const {
      nombre_producto,
      descripcion_producto,
      precio_unitario,
      unidad_medida,
      url_imagen,
      id_SubCategoria,
      cantidad, // Proviene del controlador como Number
      id_usuario 
    } = producto;

    try {
      // 1. Inserción en la tabla 'producto'
      const [resultProducto] = await db.query(
        'INSERT INTO producto (nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, estado_producto, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id_SubCategoria, 'Activo', id_usuario] 
      );
      const id_producto_creado = resultProducto.insertId;

      // 2. Inserción en la tabla 'inventario'
      await db.query(
        'INSERT INTO inventario (id_producto, cantidad_disponible) VALUES (?, ?)',
        [id_producto_creado, cantidad] // Usa el valor de 'cantidad'
      );
      
      return id_producto_creado;
    } catch (error) {
      console.error("Error en la función create de Productor:", error);
      throw error;
    }
  }

  async findByUserId(id_usuario) {
    try {
      // Selecciona 'cantidad_disponible' para que el frontend la use en la edición
      const [rows] = await db.query(
        'SELECT p.*, i.cantidad_disponible FROM producto p JOIN inventario i ON p.id_producto = i.id_producto WHERE p.estado_producto = "Activo" AND p.id_usuario = ?', 
        [id_usuario]
      );
      return rows;
    } catch (error) {
      console.error("Error en la función findByUserId de Productor:", error);
      throw error;
    }
  }

  async findAll() {
    try {
      // Similar a findByUserId, obtiene todos los productos activos
      const [rows] = await db.query(
        'SELECT p.*, i.cantidad_disponible FROM producto p JOIN inventario i ON p.id_producto = i.id_producto WHERE p.estado_producto = "Activo"'
      );
      return rows;
    } catch (error) {
      console.error("Error en la función findAll de Productor:", error);
      throw error;
    }
  }

  async update(id, producto) {
    const { 
        nombre_producto, 
        descripcion_producto, 
        precio_unitario, 
        unidad_medida, 
        url_imagen, 
        cantidad // Proviene del controlador como Number
    } = producto;

    try {
        // Actualización en la tabla 'producto'
        const [resultProducto] = await db.query(
          'UPDATE producto SET nombre_producto = ?, descripcion_producto = ?, precio_unitario = ?, unidad_medida = ?, url_imagen = ? WHERE id_producto = ?',
          [nombre_producto, descripcion_producto, precio_unitario, unidad_medida, url_imagen, id]
        );

        // Actualización en la tabla 'inventario'
        const [resultInventario] = await db.query(
          'UPDATE inventario SET cantidad_disponible = ? WHERE id_producto = ?',
          [cantidad, id] // Usa el valor de 'cantidad'
        );

        return resultProducto.affectedRows + resultInventario.affectedRows;
    } catch (error) {
        console.error("Error en la función update de Productor:", error);
        throw error; 
    }
  }

  async deactivate(id) {
    // Eliminación lógica: Cambia el estado a 'Inactivo'
    const [result] = await db.query('UPDATE producto SET estado_producto = "Inactivo" WHERE id_producto = ?', [id]);
    return result.affectedRows;
  }
}