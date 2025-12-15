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
        <div>
            <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#111827' }}>Gestión de Pedidos</h2>
                <button 
                    onClick={fetchPedidos}
                    style={{
                        padding: '8px 16px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Refrescar
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Cargando pedidos...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <PedidoTable pedidos={pedidos} onUpdate={fetchPedidos} />
            )}
        </div>
    );
};

export default PagePedido;
