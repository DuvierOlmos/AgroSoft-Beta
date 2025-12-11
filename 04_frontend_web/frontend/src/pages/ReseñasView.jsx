import { useEffect, useState } from "react";
import { getComentariosYResenas } from "../services/reseñaService";
import "../style/style.css"; 

const CATEGORIES = [
  { id: null, name: "Todas las Categorías" }, 
  { id: 1, name: "Carnes" },
  { id: 2, name: "Frutas" },
  { id: 5, name: "Lácteos" },
  { id: 7, name: "Verduras" },
];

export default function ReseñasView() {
  const [reseñas, setReseñas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReseñas = async () => {
      setLoading(true);
      try {
        const data = await getComentariosYResenas(selectedCategory);
        setReseñas(data);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      } finally {
        setLoading(false);
      }
    };
    cargarReseñas();
  }, [selectedCategory]); 
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <main>
      <h2>Comentarios y Reseñas de tus Productos</h2>
      
      <div className="category-filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id || 'all'} 
            onClick={() => handleCategoryChange(cat.id)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: cat.id === selectedCategory ? '#4CAF50' : 'white', 
              color: cat.id === selectedCategory ? 'white' : '#4CAF50',
              fontWeight: cat.id === selectedCategory ? 'bold' : 'normal',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando reseñas...</p>
      ) : (
        <div className="mostrarProductos">
          {reseñas.length > 0 ? (
            reseñas.map((r) => (
              <div key={r.id_comentario} className="contenedorProducto"> 
                <img src={r.url_imagen} alt={r.nombre_producto} />
                <div className="informacion">
                  <p className="nombre">{r.nombre_producto}</p>
                  <p className="descripcion">
                    <strong>Cliente:</strong> {r.nombre_cliente}
                  </p>
                  <p className="precio">⭐ {r.calificacion} / 5</p>
                  <p className="descripcion">"{r.comentario}"</p>
                  <p className="existencia">
                    {new Date(r.fecha_comentario).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes reseñas aún para la categoría seleccionada.</p>
          )}
        </div>
      )}
    </main>
  );
}