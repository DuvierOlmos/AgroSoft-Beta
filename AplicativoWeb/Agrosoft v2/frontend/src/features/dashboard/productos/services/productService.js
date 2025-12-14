const API_URL = "http://localhost:4000/api/products";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => {
  const token = getToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const productService = {
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct
};

export async function getProducts() {
  const response = await fetch(`${API_URL}/admin`, { headers: authHeaders() });
  if (!response.ok) {
     throw new Error("Error al obtener productos");
  }
  return await response.json();
}

export async function getSubcategories() {
  const response = await fetch("http://localhost:4000/api/subcategorias", { headers: authHeaders() });
  if (!response.ok) throw new Error("Error al obtener subcategorías");
  return await response.json();
}

export async function createProduct(data) {
  const response = await fetch(`${API_URL}/admin/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear producto");
  }
  return await response.json();
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/admin/update/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar producto");
  }
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/admin/delete/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar producto");
  }
  if (response.status === 204) return { success: true };
  return await response.json();
}

export default productService;
