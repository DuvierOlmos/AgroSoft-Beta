const API_URL = 'http://localhost:4000/api/descuentos-alt';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Sesión expirada o permisos insuficientes. Por favor inicia sesión nuevamente.');
    }

    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(`Error de conexión con el servidor (Status: ${response.status})`);
    }

    const message = errorData.message || errorData.error || 'Ocurrió un error inesperado al procesar la solicitud.';
    const details = errorData.details
      ? ` (${Array.isArray(errorData.details) ? errorData.details.join(', ') : errorData.details})`
      : '';

    throw new Error(`${message}${details}`);
  }

  if (response.status === 204) {
    return { success: true };
  }

  return await response.json();
}

export const getDescuentos = async (search = '') => {
  let url = `${API_URL}/admin`;
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  const response = await fetch(url, { headers: authHeaders() });
  return await handleResponse(response);
};

export const createDescuento = async (descuentoData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(descuentoData),
  });
  return await handleResponse(response);
};

export const updateDescuento = async (id, descuentoData) => {
  const response = await fetch(`${API_URL}/update/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(descuentoData),
  });
  return await handleResponse(response);
};

export const deleteDescuento = async (id) => {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return await handleResponse(response);
};

const descuentoService = {
  getDescuentos,
  createDescuento,
  updateDescuento,
  deleteDescuento,
};

export default descuentoService;
