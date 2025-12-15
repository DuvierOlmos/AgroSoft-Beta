import { useState, useEffect } from "react";
import { obtenerOrdenes, actualizarEstadoOrden, obtenerComprobante } from "../services/pedidoService";
import PedidoTable from "../components/PedidoTable";
import "../styles/PagePedido.css";

const getLoggedUserId = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.id_usuario || userData?.idUsuario || null;
  } catch {
    return null;
  }
};

export default function PagePedido() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ID_USUARIO_ACTUAL = getLoggedUserId();

  useEffect(() => {
    if (ID_USUARIO_ACTUAL) fetchOrdenes();
    else {
      setError("No se encontró el usuario logueado. Inicia sesión nuevamente.");
      setLoading(false);
    }
  }, [ID_USUARIO_ACTUAL]);

  const fetchOrdenes = async () => {
    try {
      const data = await obtenerOrdenes();
      setOrdenes(data);
    } catch (error) {
      console.error(" No se pudieron obtener las órdenes.", error);
      setError("Error al cargar las órdenes. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarComprobante = async (id_pedido) => {
    try {
      const pdfBlob = await obtenerComprobante(id_pedido);
      
      const url = window.URL.createObjectURL(pdfBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_orden_${id_pedido}.pdf`; 
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      alert("Error al descargar el comprobante.");
    }
  };

  const handlePrevisualizarComprobante = async (id_pedido) => {
    try {
      const pdfBlob = await obtenerComprobante(id_pedido);
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, '_blank'); 
    } catch (error) {
      alert("Error al previsualizar el comprobante.");
    }
  };

  const handleEstadoChange = async (id_pedido, estado) => { 
    try {
      await actualizarEstadoOrden(id_pedido, estado);
      setOrdenes(prevOrdenes => 
        prevOrdenes.map(orden => 
          orden.id_pedido === id_pedido ? { ...orden, estado: estado } : orden
        )
      );
    } catch (error) {
      console.error(" Error al actualizar estado", error);
    }
  };

  if (loading) return <div>Cargando órdenes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Gestión de Órdenes</h2>
      <PedidoTable 
        ordenes={ordenes}
        onEstadoChange={handleEstadoChange}
        onPreviewComprobante={handlePrevisualizarComprobante}
        onDownloadComprobante={handleDescargarComprobante}
      />
    </div>
  );
}
