const API_BASE_URL = "http://localhost:4000/api/ofertas";
const PRODUCT_API_URL = "http://localhost:4000/api/productor";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getProducerProductsApi = async (idProductor) => {
  const res = await fetch(`${PRODUCT_API_URL}/usuario/${idProductor}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener productos del productor");
  return await res.json();
};

export const getDeals = async (idProductor) => {
  const res = await fetch(`${API_BASE_URL}/productor/${idProductor}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener promociones");
  return await res.json();
};

export const createNewOferta = async (data) => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear promoción");
  return await res.json();
};

export const updatePromocion = async (data) => {
  const res = await fetch(`${API_BASE_URL}/${data.idPromocion}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar promoción");
  return await res.json();
};

export const deletePromocion = async (idPromocion) => {
  const res = await fetch(`${API_BASE_URL}/${idPromocion}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar promoción");
  return await res.json();
};
