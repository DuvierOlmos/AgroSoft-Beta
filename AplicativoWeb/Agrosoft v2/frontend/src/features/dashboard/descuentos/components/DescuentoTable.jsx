import React, { useState, useEffect } from "react";
import descuentoService from "../services/descuentoService";
import DescuentoEditForm from "./DescuentoEditForm";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/DescuentoTable.css";

export default function DescuentoTable({ refreshTrigger }) {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editDescuento, setEditDescuento] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDescuentos = async () => {
    try {
      setError(null);
      // setLoading(true); // Opcional si quieres loading cada vez
      const data = await descuentoService.getDescuentos();
      // data podría ser { success: true, count: N, data: [] } o directamente []
      // El controlador admin retorna: res.json(descuentos); (array directo)
      // Pero el controlador descuentos_routes retorna { success: true, data: [] }
      // Según descuentoRoutes.js -> descuentoController.js -> getAllDescuentos
      // Vamos a asumir array directo o chequear formato.
      if (Array.isArray(data)) {
        setDescuentos(data);
      } else if (data.data && Array.isArray(data.data)) {
        setDescuentos(data.data);
      } else {
        setDescuentos([]);
      }
    } catch (err) {
      console.error("Error al cargar descuentos:", err);
      setError(err.message || "Fallo la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, [refreshTrigger]);

  const handleUpdate = async () => {
    await fetchDescuentos();
    setEditDescuento(null);
  };

  const handleDeleteConfirm = async () => {
    await fetchDescuentos();
    setDeleteId(null);
  };

  if (loading) {
    return <div className="loading-message">Cargando descuentos...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="table-container">
      <table className="descuento-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {descuentos.length > 0 ? (
            descuentos.map((d) => (
              <tr key={d.id_descuento}>
                <td>{d.id_descuento}</td>
                <td>{d.nombre_descuento}</td>
                <td>{d.codigo_descuento}</td>
                <td>{d.valor_descuento}</td>
                <td>{d.tipo_descuento}</td>
                <td>{d.fecha_inicio ? new Date(d.fecha_inicio).toLocaleDateString() : "-"}</td>
                <td>{d.fecha_fin ? new Date(d.fecha_fin).toLocaleDateString() : "-"}</td>
                <td>{d.estado}</td>
                <td>{d.activo ? "Sí" : "No"}</td>
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditDescuento(d)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => setDeleteId(d.id_descuento)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay descuentos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editDescuento && (
        <DescuentoEditForm
          show={!!editDescuento}
          descuento={editDescuento}
          onClose={() => setEditDescuento(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          id={deleteId}
          onClose={() => setDeleteId(null)}
          onSave={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
