import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "../style/Carrito.css";
import { useCarrito } from '../context/CarritoContext';

const Carrito = () => {
  const { numeroItems, actualizarCarrito } = useCarrito();
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("user"));
  const API_URL = "http://localhost:4000/api/carrito";

  useEffect(() => {
    if (usuario) cargarCarrito();
    else setLoading(false);
  }, [usuario]);

  const cargarCarrito = async () => {
    try {
      const carritoRes = await axios.get(`${API_URL}/${usuario.id_usuario}`);
      const carritoId = carritoRes.data.data.id_carrito;
      const itemsRes = await axios.get(`${API_URL}/items/${carritoId}`);
      setItemsCarrito(itemsRes.data.data);
      setError(null);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setError("Error al cargar el carrito. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (idItem, cantidad, stockDisponible) => {
    if (cantidad < 1) return;
    if (cantidad > stockDisponible) {
      alert(`Solo hay ${stockDisponible} unidades disponibles`);
      return;
    }

    setProcessingAction(true);
    try {
      await axios.put(`${API_URL}/item/${idItem}`, { cantidad });
      setItemsCarrito(prev =>
        prev.map(item =>
          item.id_item === idItem ? { ...item, cantidad } : item
        )
      );
    } catch (err) {
      alert("Error al actualizar la cantidad. Por favor, intenta de nuevo.");
      console.error("Error actualizando cantidad:", err);
    } finally {
      setProcessingAction(false);
    }
  };

  const eliminarItem = async (idItem) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto del carrito?")) return;

    setProcessingAction(true);
    try {
      await axios.delete(`${API_URL}/item/${idItem}`);
      setItemsCarrito(prev => prev.filter(item => item.id_item !== idItem));
    } catch (err) {
      alert("Error al eliminar el producto. Por favor, intenta de nuevo.");
      console.error("Error eliminando item:", err);
    } finally {
      setProcessingAction(false);
    }
  };

  const procesarCompra = async () => {
    if (!window.confirm("¿Deseas proceder con la compra?")) return;

    setProcessingAction(true);
    try {
      const carritoId = itemsCarrito[0]?.id_carrito;
      await axios.post(`${API_URL}/compras`, {
        id_carrito: carritoId,
        id_usuario: usuario.id_usuario,
        items: itemsCarrito
      });
      setItemsCarrito([]);
      navigate("/compra-exitosa");
    } catch (err) {
      alert("Error al procesar la compra. Por favor, intenta de nuevo.");
      console.error("Error procesando compra:", err);
    } finally {
      setProcessingAction(false);
    }
  };

  // --- Renderizado ---

  if (loading) {
    return (
      <div className="carrito-container">
        <div className="carrito-loading">Cargando carrito...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carrito-container">
        <div className="carrito-error">
          <p>{error}</p>
          <button className="carrito-btn-primary" onClick={cargarCarrito}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <div className="carrito-section-title">
        <h2 className="carrito-title-animated">Mi Carrito de Compras</h2>
      </div>

      {!usuario ? (
        <div className="carrito-mensaje">
          <p>Por favor inicia sesión para ver tu carrito</p>
          <button className="carrito-btn-primary" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </button>
        </div>
      ) : itemsCarrito.length === 0 ? (
        <div className="carrito-mensaje">
          <p>Tu carrito está vacío</p>
          <button className="carrito-btn-primary" onClick={() => navigate("/catalogo")}>
            Ver Productos
          </button>
        </div>
      ) : (
        <>
          <div className="carrito-items-grid">
            {itemsCarrito.map(item => (
              <div key={item.id_item} className="carrito-item-card">
                <img
                  src={item.Producto?.url_imagen}
                  alt={item.Producto?.nombre_producto}
                  className="carrito-item-imagen"
                />
                <div className="carrito-item-detalles">
                  <h3>{item.Producto?.nombre_producto}</h3>
                  <p className="carrito-item-precio">
                    ${item.Producto?.precio_unitario} / {item.Producto?.unidad_medida}
                  </p>
                  <div className="carrito-item-controles">
                    <button
                      onClick={() =>
                        actualizarCantidad(item.id_item, item.cantidad - 1, item.Producto?.stock)
                      }
                    >
                      <FaMinus />
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() =>
                        actualizarCantidad(item.id_item, item.cantidad + 1, item.Producto?.stock)
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="carrito-btn-eliminar"
                    onClick={() => eliminarItem(item.id_item)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <h3>
              Total: $
              {itemsCarrito
                .reduce((sum, item) => sum + item.Producto.precio_unitario * item.cantidad, 0)
                .toFixed(2)}{" "}
              COP
            </h3>
            <button className="carrito-btn-comprar" onClick={procesarCompra}>
              Finalizar Compra
            </button>
          </div>

          <section className="carrito-volver-container">
            <button className="carrito-volver-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Volver
            </button>
          </section>
        </>
      )}
    </div>
  );
};

export default Carrito;
