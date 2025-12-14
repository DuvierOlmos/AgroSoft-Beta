import React, { useState } from "react";
import Table from "../components/Table";
import UserForm from "../components/Form";
import "../../../../style/PageUser.css";
//import "../styles/PageCategoria.css";

export default function PageCategoria() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCategoryCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1); // Force table refresh
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestión de Categorías</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nueva Categoría
        </button>
      </header>
      <Table key={refreshKey} />
      {/* modal_user siempre montado, pero visible según showForm */}
      <UserForm show={showForm} onClose={() => setShowForm(false)} onSave={handleCategoryCreated} />
    </div>
  );
}
