import axios from "axios";

// Ajusta la URL base según corresponda. 
// Si antes era .../api/ordenes, ahora usaremos rutas específicas.
const API_URL = "http://localhost:4000/api/ordenes";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const obtenerOrdenes = async (filtros = {}) => {
  try {
    let url = `${API_URL}/admin/todas`;
    
    // Si se pasa un string (comportamiento anterior), lo convertimos a objeto
    const params = typeof filtros === 'string' ? { search: filtros } : { ...filtros };
    
    // Construir query params
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    });

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // CAMBIO IMPORTANTE: Usamos la ruta de admin para traer TODAS las órdenes
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error(" Error al obtener las órdenes:", error);
    if (error.response?.status === 401) {
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    }
    return [];
  }
};

export const actualizarEstadoOrden = async (id, estado) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/estado`, 
      { estado },
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(" Error al actualizar estado de la orden:", error);
    if (error.response?.status === 401) {
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    }
    throw error;
  }
};

export const obtenerComprobante = async (id_pedido) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id_pedido}/comprobante`,
      {
        ...authHeaders(),
        responseType: 'blob', 
      }
    );
    return response.data; 
  } catch (error) {
    console.error(" Error al obtener el comprobante:", error);
    throw error;
  }
};
