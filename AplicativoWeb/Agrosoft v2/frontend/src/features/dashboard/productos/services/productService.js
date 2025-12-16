const API_URL = 'http://localhost:4000/api/products';
const SUBCATEGORIES_URL = 'http://localhost:4000/api/subcategorias';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export async function getProducts(search = '') {
  let url = `${API_URL}/admin`;
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  return await response.json();
}

export async function getSubcategories() {
  const response = await fetch(SUBCATEGORIES_URL, { headers: authHeaders() });
  if (!response.ok) throw new Error('Error al obtener subcategorías');
  return await response.json();
}

export async function createProduct(data) {
  const response = await fetch(`${API_URL}/admin/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || errorData.details || 'Error al crear producto';
    throw new Error(errorMessage);
  }
  return await response.json();
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/admin/update/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar producto');
  }
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/admin/delete/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar producto');
  }
  if (response.status === 204) return { success: true };
  return await response.json();
}

export async function deleteProductPermanent(id) {
  const response = await fetch(`${API_URL}/admin/delete-permanent/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || 'Error al eliminar producto permanentemente';
    throw new Error(errorMessage);
  }
  return await response.json();
}

const productService = {
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  deleteProductPermanent,
  getSubcategories,
};

export default productService;
