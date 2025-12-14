import React, { useState } from 'react';
import { updateEstadoPedido } from '../services/pedidoService';

const PedidoTable = ({ pedidos, onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const handleEstadoChange = async (id_pedido, newStatus) => {
        if (!window.confirm("¿Estás seguro de cambiar el estado de este pedido?")) return;
        
        setLoading(true);
        try {
            await updateEstadoPedido(id_pedido, newStatus);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Mapeo básico de estados, esto podría venir de una API de estados también
    const estados = [
        { id: 1, nombre: 'Pendiente' },
        { id: 2, nombre: 'En Proceso' },
        { id: 3, nombre: 'Enviado' },
        { id: 4, nombre: 'Entregado' },
        { id: 5, nombre: 'Cancelado' }
    ];

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>ID Pedido</th>
                        <th>Fecha</th>
                        <th>Estado Actual</th>
                        <th>Total ($)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos && pedidos.length > 0 ? (
                        pedidos.map((pedido) => (
                            <tr key={pedido.id_pedido}>
                                <td>{pedido.id_pedido}</td>
                                <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${pedido.Estado?.nombre_estado === 'Cancelado' ? 'bg-danger' : 'bg-success'}`}>
                                        {pedido.Estado ? pedido.Estado.nombre_estado : 'Desconocido'}
                                    </span>
                                </td>
                                <td>
                                    {/* Asumiendo que hay un campo total_pedido o calculando sumando detalles si fuera necesario */}
                                    {pedido.total_pedido ? `$${parseFloat(pedido.total_pedido).toLocaleString()}` : 'N/A'}
                                </td>
                                <td>
                                    <select 
                                        className="form-select form-select-sm"
                                        style={{ width: '150px' }}
                                        value={pedido.id_estado_pedido}
                                        onChange={(e) => handleEstadoChange(pedido.id_pedido, e.target.value)}
                                        disabled={loading}
                                    >
                                        {estados.map(est => (
                                            <option key={est.id} value={est.id}>
                                                {est.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No hay pedidos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PedidoTable;
