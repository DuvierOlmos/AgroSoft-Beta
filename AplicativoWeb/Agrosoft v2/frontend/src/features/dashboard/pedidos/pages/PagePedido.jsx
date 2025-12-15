import React, { useEffect, useState } from 'react';
import { getPedidos } from '../services/pedidoService';
import PedidoTable from '../components/PedidoTable';

const PagePedido = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const data = await getPedidos();
            setPedidos(data);
            setError(null);
        } catch (err) {
            setError("Error al cargar los pedidos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Pedidos</h2>
                <button className="btn btn-primary" onClick={fetchPedidos}>
                    <i className="bi bi-arrow-clockwise"></i> Refrescar
                </button>
            </div>

            {loading ? (
                <div className="text-center">Cargando pedidos...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <PedidoTable pedidos={pedidos} onUpdate={fetchPedidos} />
            )}
        </div>
    );
};

export default PagePedido;
