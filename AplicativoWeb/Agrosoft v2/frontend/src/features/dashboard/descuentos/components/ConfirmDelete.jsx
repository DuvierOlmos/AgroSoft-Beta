import React, { useState } from "react";
import { deleteDescuento } from "../services/descuentoService";
import "../styles/ConfirmDelete.css";

export default function ConfirmDelete({ show, onClose, id, onSave }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDescuento(id);
      alert("Descuento eliminado con éxito."); // Confirmación de éxito
      if (onSave) onSave(); // Refresh list
      onClose();
    } catch (err) {
      console.error("Error al eliminar descuento:", err);
      alert("No se pudo eliminar el descuento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal_user-overlay ${show ? "show" : ""}`}>
      <div className="modal_user">
        <h2>¿Eliminar descuento?</h2>
        <p>Esta acción no se puede deshacer.</p>
        <div className="form-actions">
          <button 
            className="btn-danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
