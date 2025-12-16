const API_URL = 'http://localhost:4000/api/inventarios';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getInventarios = async (searchTerm = '') => {
  let url = API_URL;
  if (searchTerm) {
    url += `?search=${encodeURIComponent(searchTerm)}`;
  }

  const response = await fetch(url, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Error al obtener inventario');
  }
  return await response.json();
};

export const createInventario = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear inventario');
  return await response.json();
};

export const updateInventario = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar inventario');
  return await response.json();
};

export const deleteInventario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Error al eliminar inventario');
  return await response.json();
};
