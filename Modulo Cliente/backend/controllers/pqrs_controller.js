const Pqrs = require("../models/pqrs_model");

exports.createPqrs = async (req, res) => {
  try {
    const { id_tipo_pqrs, asunto, descripcion } = req.body;
    
    // Validaciones
    if (!id_tipo_pqrs || !asunto || !descripcion) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son requeridos: id_tipo_pqrs, asunto, descripcion"
      });
    }

    const pqrs = await Pqrs.create({
      id_usuario: req.user.id_usuario,
      id_tipo_pqrs,
      asunto,
      descripcion,
      id_estado_pqrs: 1 // 1 = Pendiente (según tu base de datos)
    });

    res.status(201).json({
      success: true,
      message: "PQRS creado exitosamente",
      data: {
        id_pqrs: pqrs.id_pqrs,
        asunto: pqrs.asunto,
        estado: "Pendiente",
        fecha_creacion: pqrs.fecha_creacion
      }
    });
  } catch (err) {
    console.error("Error creando PQRS:", err);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor al crear el PQRS" 
    });
  }
};

exports.getMyPqrs = async (req, res) => {
  try {
    const pqrs = await Pqrs.findAll({
      where: { id_usuario: req.user.id_usuario },
      order: [['fecha_creacion', 'DESC']]
    });

    res.json({
      success: true,
      data: pqrs.map(item => ({
        id_pqrs: item.id_pqrs,
        asunto: item.asunto,
        descripcion: item.descripcion,
        id_tipo_pqrs: item.id_tipo_pqrs,
        id_estado_pqrs: item.id_estado_pqrs,
        fecha_creacion: item.fecha_creacion,
        fecha_ultima_actualizacion: item.fecha_ultima_actualizacion
      }))
    });
  } catch (err) {
    console.error("Error obteniendo PQRS del usuario:", err);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor al obtener los PQRS" 
    });
  }
};

exports.getAllPqrs = async (req, res) => {
  try {
    const pqrs = await Pqrs.findAll({
      order: [['fecha_creacion', 'DESC']]
    });

    res.json({
      success: true,
      data: pqrs,
      total: pqrs.length
    });
  } catch (err) {
    console.error("Error obteniendo todos los PQRS:", err);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor al obtener los PQRS" 
    });
  }
};

exports.updatePqrsStatus = async (req, res) => {
  try {
    const { id_pqrs } = req.params;
    const { id_estado_pqrs, respuesta_administrador, id_administrador_respuesta } = req.body;

    // Validaciones
    if (!id_estado_pqrs) {
      return res.status(400).json({
        success: false,
        error: "El campo id_estado_pqrs es requerido"
      });
    }

    const pqrs = await Pqrs.findByPk(id_pqrs);
    if (!pqrs) {
      return res.status(404).json({
        success: false,
        error: "PQRS no encontrado"
      });
    }

    // Actualizar PQRS
    await pqrs.update({
      id_estado_pqrs,
      respuesta_administrador: respuesta_administrador || pqrs.respuesta_administrador,
      id_administrador_respuesta: id_administrador_respuesta || req.user.id_usuario,
      fecha_ultima_actualizacion: new Date()
    });

    res.json({
      success: true,
      message: "Estado de PQRS actualizado exitosamente",
      data: {
        id_pqrs: pqrs.id_pqrs,
        id_estado_pqrs: pqrs.id_estado_pqrs,
        estado_anterior: pqrs.previous('id_estado_pqrs')
      }
    });
  } catch (err) {
    console.error("Error actualizando PQRS:", err);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor al actualizar el PQRS" 
    });
  }
};

// 🔍 Obtener un PQRS específico por ID
exports.getPqrsById = async (req, res) => {
  try {
    const { id_pqrs } = req.params;
    const userId = req.user.id_usuario;
    const userRole = req.user.id_rol;

    const pqrs = await Pqrs.findByPk(id_pqrs);
    
    if (!pqrs) {
      return res.status(404).json({
        success: false,
        error: "PQRS no encontrado"
      });
    }

    // Verificar permisos: solo el dueño o un admin puede verlo
    if (pqrs.id_usuario !== userId && userRole !== 2) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para ver este PQRS"
      });
    }

    res.json({
      success: true,
      data: pqrs
    });
  } catch (err) {
    console.error("Error obteniendo PQRS por ID:", err);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor" 
    });
  }
};