import React, { useState, useEffect, useCallback } from "react";
import descuentoService from "../services/descuentoService";
import DescuentoEditForm from "./DescuentoEditForm";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/DescuentoTable.css";

export default function DescuentoTable({ refreshTrigger }) {
  const [descuentos, setDescuentos] = useState([]);
  const [allDescuentos, setAllDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterActive, setFilterActive] = useState(""); // ""=Todos, "true"=Activos, "false"=Inactivos

  const [editDescuento, setEditDescuento] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDescuentos = useCallback(async () => {
    try {
      setError(null);
      // setLoading(true); // Opcional si quieres loading cada vez
      const data = await descuentoService.getDescuentos("");
      
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data.data && Array.isArray(data.data)) {
        results = data.data;
      }
      
      setAllDescuentos(results);
    } catch (err) {
      console.error("Error al cargar descuentos:", err);
      setError(err.message || "Fallo la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    let filtered = allDescuentos;

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      const term = searchTerm.trim();

      // Verificar si hay coincidencia EXACTA de ID
      const exactIdMatch = allDescuentos.find(d => 
        d.id_descuento !== null && 
        d.id_descuento !== undefined && 
        d.id_descuento.toString() === term
      );

      if (exactIdMatch) {
        filtered = [exactIdMatch];
      } else {
        filtered = filtered.filter((d) => {
          const nombreMatch = d.nombre_descuento && d.nombre_descuento.toLowerCase().includes(lowerTerm);
          const codigoMatch = d.codigo_descuento && d.codigo_descuento.toLowerCase().includes(lowerTerm);
          // Mantenemos búsqueda parcial de ID por si no hay match exacto
          const idMatch = d.id_descuento !== null && d.id_descuento !== undefined && d.id_descuento.toString().includes(lowerTerm);
          
          return nombreMatch || codigoMatch || idMatch;
        });
      }
    }

    // Filtro por estado
    if (filterStatus) {
      filtered = filtered.filter((d) => 
        d.estado && d.estado.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filtro por activo/inactivo
    if (filterActive !== "") {
      const wantActive = filterActive === "true"; // true si selecciona "Activos", false si "Inactivos"
      filtered = filtered.filter((d) => {
        // Normalizar el valor de 'activo' a booleano
        // Soporta: 1, 0, true, false, "1", "0"
        const isItemActive = d.activo === 1 || d.activo === true || d.activo === "1";
        return isItemActive === wantActive;
      });
    }

    setDescuentos(filtered);
  }, [allDescuentos, searchTerm, filterStatus, filterActive]);

  // Filtrado en tiempo real y reaplicación al actualizar datos
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    fetchDescuentos();
  }, [refreshTrigger, fetchDescuentos]);

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
      <div className="search-container" style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Buscar por ID, nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "0.5rem", width: "150px" }}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>

        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          style={{ padding: "0.5rem", width: "150px" }}
        >
          <option value="">Todos (Act/Inac)</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        <button className="btn-success" onClick={handleSearch}>
          Buscar
        </button>
      </div>
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
