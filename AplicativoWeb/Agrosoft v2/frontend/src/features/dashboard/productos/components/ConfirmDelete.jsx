import React from "react";
import { deleteProduct } from "../services/productService";
import "../styles/ConfirmDelete.css";

export default function ConfirmDelete({ show, onClose, productId, onSave }) {
  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      onSave(); // Refresh list
      onClose();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el producto");
    }
  };

  if (!show) return null;

  return (
    <div className={`modal_user-overlay ${show ? "show" : ""}`}>
      <div className="modal_user">
        <h2>¿Eliminar producto?</h2>
        <p>Esta acción no se puede deshacer.</p>
        <div className="form-actions">
          <button className="btn-danger" onClick={handleDelete}>
            Sí, eliminar
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
