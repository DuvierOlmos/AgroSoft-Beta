import axios from "axios";

// Ajusta la URL base según corresponda.
const API_URL = "http://localhost:4000/api/finanzas";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const buildUrlWithUserId = (endpoint, id_usuario) => {
  let url = `${API_URL}${endpoint}`;
  if (id_usuario) url += `?id_usuario=${id_usuario}`;
  return url;
};

// =======================================================
// 👤 FUNCIONES PRODUCTOR (Filtrado por usuario)
// =======================================================

export const getReport = async (type, format) => {
  try {
    const response = await axios.get(`${API_URL}/reportes/${type}`, {
      ...authHeaders(),
      params: { format },
      responseType: format === 'html' ? 'text' : (format === 'pdf' || format === 'excel' ? 'blob' : 'json'), 
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el reporte ${type}:`, error);
    throw error;
  }
};

export const getFinanzasData = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error finanaza data:", error);
    throw error;
  }
};

export const getVentasPorMes = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("/ventas-por-mes", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error ventas mes:", error);
    throw error;
  }
};

export const getProductosMasVendidos = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("/productos-mas-vendidos", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error productos top:", error);
    throw error;
  }
};

export const getOrdenesEstado = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("/ordenes-estado", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error ordenes estado:", error);
    throw error;
  }
};

// =======================================================
// 🛡️ FUNCIONES ADMIN (Globales)
// =======================================================

export const getFinanzasDataAdmin = async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, authHeaders());
    return response.data;
};

export const getVentasPorMesAdmin = async () => {
    const response = await axios.get(`${API_URL}/admin/ventas-por-mes`, authHeaders());
    return response.data;
};

export const getProductosMasVendidosAdmin = async () => {
    const response = await axios.get(`${API_URL}/admin/productos-mas-vendidos`, authHeaders());
    return response.data;
};

export const getOrdenesEstadoAdmin = async () => {
    const response = await axios.get(`${API_URL}/admin/ordenes-estado`, authHeaders());
    return response.data;
};

export const getReportAdmin = async (type, format) => {
    try {
        const response = await axios.get(`${API_URL}/admin/reportes/${type}`, {
            ...authHeaders(),
            params: { format },
            // Si el formato es html, esperamos texto. Si es pdf/excel, blob. Si es json (o null), json default.
            responseType: format === 'html' ? 'text' : (format === 'pdf' || format === 'excel' ? 'blob' : 'json'), 
        });
        return response.data;
    } catch (error) {
        console.error(`Error report admin ${type}:`, error);
        throw error;
    }
};
