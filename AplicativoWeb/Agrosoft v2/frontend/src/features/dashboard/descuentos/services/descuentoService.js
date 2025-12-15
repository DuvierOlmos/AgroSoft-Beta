// features/dashboard/descuentos/services/descuentoService.js

const API_URL = "http://localhost:4000/api/descuentos-alt";
const API_READ_URL = "http://localhost:4000/api/descuentos"; // Ruta oficial de lectura

const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Función auxiliar para manejar las respuestas de la API
 * Procesa errores 4xx/5xx y extrae mensajes detallados del backend
 */
async function handleResponse(response) {
  if (!response.ok) {
    // Manejo específico de autenticación
    if (response.status === 401 || response.status === 403) {
      throw new Error("Sesión expirada o permisos insuficientes. Por favor inicia sesión nuevamente.");
    }

    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Si la respuesta no es JSON válido (ej. error 500 de HTML o timeout)
      throw new Error(`Error de conexión con el servidor (Status: ${response.status})`);
    }

    // Prioridad: message > error > texto genérico
    // También adjuntamos detalles si existen (útil para validaciones)
    const message = errorData.message || errorData.error || "Ocurrió un error inesperado al procesar la solicitud.";
    const details = errorData.details 
      ? ` (${Array.isArray(errorData.details) ? errorData.details.join(', ') : errorData.details})`
      : '';

    throw new Error(`${message}${details}`);
  }

  // Manejo de respuestas exitosas sin contenido (ej. DELETE 204)
  if (response.status === 204) {
    return { success: true };
  }

  return await response.json();
}

const descuentoService = {
  getDescuentos,
  createDescuento,
  updateDescuento,
  deleteDescuento,
};

// === READ (Admin) ===
export async function getDescuentos() {
  try {
    const response = await fetch(API_READ_URL, { headers: authHeaders() });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error en getDescuentos:", error);
    throw error;
  }
}

// === CREATE ===
export async function createDescuento(descuentoData) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(descuentoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error en createDescuento:", error);
    throw error;
  }
}

// === UPDATE ===
export async function updateDescuento(id, descuentoData) {
  try {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(descuentoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error en updateDescuento:", error);
    throw error;
  }
}

// === DELETE ===
export async function deleteDescuento(id) {
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error en deleteDescuento:", error);
    throw error;
  }
}

export default descuentoService;
