import axios from "axios";

const API_URL = "http://localhost:4000/api/pedidos/admin";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
    const token = getToken();
    return token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };
};

export const getPedidos = async () => {
    try {
        const response = await axios.get(API_URL, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Error fetching pedidos:", error);
        throw error;
    }
};

export const getPedidoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error(`Error fetching pedido ${id}:`, error);
        throw error;
    }
};

export const updateEstadoPedido = async (id, id_estado_pedido) => {
    try {
        // La ruta en el backend es router.put('/admin/estadoPedido/:id', ...)
        const response = await axios.put(`${API_URL}/estadoPedido/${id}`, { id_estado_pedido }, { headers: authHeaders() });
        alert(`Estado del pedido actualizado con éxito.`);
        return response.data;
    } catch (error) {
        let errorMessage = "Ocurrió un error inesperado al actualizar el estado.";
        if (error.response) {
            errorMessage = error.response.data.message || `Fallo del servidor (Status: ${error.response.status}).`;
        }
        alert(`Error al actualizar: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};
