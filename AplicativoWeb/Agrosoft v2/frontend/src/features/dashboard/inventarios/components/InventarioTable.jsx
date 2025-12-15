import React, { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:4000/api/inventarios";

export default function InventarioTable() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInventarios = useCallback(async (term = "") => {
      setLoading(true);
      setError(null);
      try {
      let url = API_URL;
      if (term) {
        url += `?search=${encodeURIComponent(term)}`;
      }
      const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener inventario");
        const data = await response.json();
        setInventarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchInventarios();
  }, [fetchInventarios]);

  return (
    <div className="table-container">
      <h2>Inventario</h2>
      <div className="search-container" style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Buscar por nombre de producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button className="btn-success" onClick={() => fetchInventarios(searchTerm)}>
          Buscar
        </button>
      </div>
      {loading && <p>Cargando inventario...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID Inventario</th>
            <th>ID Producto</th>
            <th>Cantidad Disponible</th>
            <th>Agricultor</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.length > 0 ? (
            inventarios.map((inv) => (
              <tr key={inv.id_inventario}>
                <td>{inv.id_inventario}</td>
                <td>{inv.id_producto}</td>
                <td>{inv.cantidad_disponible}</td>
                <td>{inv.producto?.agricultor?.nombre_usuario || 'Sin agricultor'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay inventario registrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
