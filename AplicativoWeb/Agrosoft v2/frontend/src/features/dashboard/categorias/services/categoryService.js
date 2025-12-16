const API_URL = 'http://localhost:4000/api/categories/admin';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getCategories = async (search = '') => {
  let url = API_URL;
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener categorías');
  }
  return await response.json();
};

export const createCategory = async (categoria) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear la categoría');
  }
  return await response.json();
};

export const updateCategory = async (id, categoria) => {
  const response = await fetch(`${API_URL}/update/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar la categoría');
  }
  return await response.json();
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar la categoría');
  }
  return await response.json();
};
