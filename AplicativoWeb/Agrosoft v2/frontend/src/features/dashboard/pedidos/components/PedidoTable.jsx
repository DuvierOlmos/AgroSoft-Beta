import React, { useState } from 'react';
import { updateEstadoPedido } from '../services/pedidoService';
import "../../../../style/ordenes.css"; 

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

    const getStatusClass = (s) => {
        if (!s) return "status-Pendiente";
        return `status-${String(s).replace(/\s+/g, "")}`;
    };

    const estados = [
        { id: 1, nombre: 'Pendiente' },
        { id: 2, nombre: 'En Proceso' },
        { id: 3, nombre: 'Enviado' },
        { id: 4, nombre: 'Entregado' },
        { id: 5, nombre: 'Cancelado' }
    ];

    return (
        <div className="orders-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Seguimiento</th>
                <th>Acciones</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {pedidos && pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>{pedido.id_pedido}</td> 
                    <td>{pedido.Cliente ? pedido.Cliente.nombre_usuario : 'N/A'}</td>
                    <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(pedido.Estado?.nombre_estado)}`}>
                        {pedido.Estado ? pedido.Estado.nombre_estado : 'Desconocido'}
                      </span>
                    </td>
                    <td>{pedido.total_pedido ? `$${parseFloat(pedido.total_pedido).toLocaleString()}` : 'N/A'}</td>
               
                    <td>{pedido.direccion_envio || "N/A"}</td>
                    <td>{pedido.ciudad_envio || "N/A"}</td>
                    <td>{pedido.numero_seguimiento || "—"}</td>
                    <td>
                      <select
                        className="form-select"
                        aria-label={`Cambiar estado orden ${pedido.id_pedido}`}
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
                    <td className="comprobante-buttons">
                      <button
                        className="btn-preview"
                        onClick={() => alert("Función no disponible para administrador")}
                        title="Previsualizar comprobante"
                      >
                          Ver
                      </button>
                      <button
                        className="btn-download"
                        onClick={() => alert("Función no disponible para administrador")}
                        title="Descargar comprobante"
                      >
                        ⬇️ Descargar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No hay órdenes para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    );
};

export default PedidoTable;
