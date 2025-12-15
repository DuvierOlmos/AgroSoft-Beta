import React, { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/productService";
import Form from "./Form";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/ProductTable.css";

export default function Table() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async (term = "") => {
    try {
      setLoading(true);
      const data = await getProducts(term);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const handleSave = () => {
    fetchProducts();
    setEditProduct(null);
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <div className="search-container" style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button className="btn-success" onClick={() => fetchProducts(searchTerm)}>
          Buscar
        </button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Subcategoría</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre_producto}</td>
              <td>{p.SubCategory ? p.SubCategory.nombre : (p.SubCategorium ? p.SubCategorium.nombre : p.id_SubCategoria)}</td>
              <td>{p.cantidad}</td>
              <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.precio_unitario)}</td>
              <td>
                <button className="btn-success" onClick={() => handleEdit(p)}>
                  Editar
                </button>
                <button className="btn-danger" onClick={() => handleDelete(p.id_producto)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="7">No hay productos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editProduct && (
        <Form
          show={!!editProduct}
          onClose={() => setEditProduct(null)}
          product={editProduct}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          onClose={() => setDeleteId(null)}
          productId={deleteId}
          onSave={fetchProducts}
        />
      )}
    </div>
  );
}
