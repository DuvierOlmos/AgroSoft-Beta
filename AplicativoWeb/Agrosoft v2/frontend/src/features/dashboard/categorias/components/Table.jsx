import React, { useState, useEffect, useCallback } from "react";
//  IMPORTAR LA FUNCIÓN DEL SERVICIO
import { getCategories } from "../services/categoryService"; 
import {deleteCategory} from "../services/categoryService"; 

import CategoryEditForm from "./CategoryEditForm";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/UserTable.css";

export default function CategoryTable( {onSave}) {
    //  Inicializar categorías como un array vacío
    const [categories, setCategories] = useState([]);    
    //  NUEVOS ESTADOS para la carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [editCategory, setEditCategory] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    //  FUNCIÓN DE CARGA DE DATOS
    const loadCategories = useCallback(async (term = "") => {
        // setLoading(true); // Opcional: comentar si queremos refresco silencioso
        setError(null);
        try {
            const data = await getCategories(term);
            setCategories(data);
            
        } catch (err) {
            console.error("Fallo en la carga de categorías:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    
    useEffect(() => {
        loadCategories();
    }, [loadCategories]); 


    const handleDeleteConfirm = async (id_categoria) => {
    try {
      await deleteCategory(id_categoria);
      
      setDeleteId(null);
      alert('categoria eliminada con éxito!');
      await loadCategories();
      
    } catch (err) {
      alert(`Error al eliminar: ${err}`);
    }
  };
    // --- LÓGICA DE RENDERIZADO ---    
    if (loading) {
        return <div className="table-container">Cargando categorías...</div>;
    }
    if (error) {
        return <div className="table-container error-message">Error: {error}</div>;
    }

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
        <button className="btn-success" onClick={() => loadCategories(searchTerm)}>
          Buscar
        </button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((c) => (
              <tr key={c.id_categoria}>
                <td>{c.id_categoria}</td>
                <td>{c.nombre_categoria}</td>                
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditCategory(c)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => setDeleteId(c.id_categoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay categorías registradas</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      {editCategory && (
        <CategoryEditForm
          show={!!editCategory}
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSave={loadCategories}
        />
      )}
      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          categoryId={deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          onSave={loadCategories}
        />
      )}
    </div>
  );
}


