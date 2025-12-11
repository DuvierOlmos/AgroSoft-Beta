import { useState, useEffect } from "react";
import {
  getDeals,
  createNewOferta,
  deletePromocion,
  updatePromocion,
  getProducerProductsApi,
} from "../services/dealService";
import "../style/ofertas.css";

const getTodayDate = () => new Date().toISOString().split("T")[0];
const DEFAULT_IMAGE = "https://via.placeholder.com/150/f0f0f0?text=Producto";

const getStatusStyle = (s) =>
  s === "Aprobado"
    ? "status-Aprobado"
    : s === "Pendiente"
      ? "status-Pendiente"
      : "status-Rechazado";

const getLoggedUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.id_usuario ?? u?.id ?? null;
  } catch {
    return null;
  }
};


function OfferEditModal({ deal, products, onClose, onUpdated }) {
  const isDiscount = deal.tipo_deal === "Descuento";
  const [formData, setFormData] = useState({
    idProducto: deal.id_producto || products[0]?.id_producto || "",
    nombre: deal.nombre || "",
    descripcion: deal.descripcion || "",
    porcentaje: deal.porcentaje_descuento || (isDiscount ? 10 : 0),
    fechaInicio: deal.fecha_inicio || getTodayDate(),
    fechaFin: deal.fecha_fin || getTodayDate(),
    estado: deal.estado || "Pendiente",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setFormData({
      idProducto: deal.id_producto || products[0]?.id_producto || "",
      nombre: deal.nombre || "",
      descripcion: deal.descripcion || "",
      porcentaje: deal.porcentaje_descuento || (isDiscount ? 10 : 0),
      fechaInicio: deal.fecha_inicio || getTodayDate(),
      fechaFin: deal.fecha_fin || getTodayDate(),
      estado: deal.estado || "Pendiente",
    });
  }, [deal]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);
    const payload = {
      ...formData,
      nombre: isDiscount ? `Descuento ${formData.porcentaje}%` : formData.nombre,
      porcentaje: isDiscount ? parseFloat(formData.porcentaje) : undefined,
      idPromocion: deal.id_promocion,
      tipo: deal.tipo_deal,
    };

    try {
      await updatePromocion(payload);
      setMsg(" Promoción actualizada correctamente");
      onUpdated();
      setTimeout(onClose, 1000);
    } catch (err) {
      setMsg(` ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>
          Editar {deal.tipo_deal}: {deal.producto}
        </h3>
        <form onSubmit={handleSubmit}>
          <label>Producto</label>
          <select name="idProducto" value={formData.idProducto} disabled>
            {products.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre_producto}
              </option>
            ))}
          </select>

          {isDiscount ? (
            <>
              <label>% Descuento</label>
              <input
                name="porcentaje"
                type="number"
                min="1"
                max="99"
                value={formData.porcentaje}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <label>Nombre oferta</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </>
          )}

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />

          <label>Fecha inicio</label>
          <input
            type="date"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
          />

          <label>Fecha fin</label>
          <input
            type="date"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
          />

          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>

          {msg && <p className="form-info">{msg}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function OfferCreationForm({ products, onOfferCreated }) {
  const [formData, setFormData] = useState({
    idProducto: products[0]?.id_producto || "",
    porcentaje: 10,
    fechaInicio: getTodayDate(),
    fechaFin: getTodayDate(),
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formData.idProducto && products.length > 0) {
      setFormData((prev) => ({ ...prev, idProducto: products[0].id_producto }));
    }
  }, [products, formData.idProducto]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await createNewOferta(formData);
      setMsg(" Promoción enviada correctamente (Pendiente)");
      onOfferCreated();
    } catch (err) {
      setMsg(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0)
    return <p>No tienes productos para crear promociones.</p>;

  return (
    <div className="creation-form">
      <h3>Crear Promoción</h3>
      <form onSubmit={handleSubmit}>
        <label>Producto</label>
        <select
          name="idProducto"
          value={formData.idProducto}
          onChange={handleChange}
        >
          {products.map((p) => (
            <option key={p.id_producto} value={p.id_producto}>
              {p.nombre_producto} (${p.precio_unitario})
            </option>
          ))}
        </select>

        <label>% Descuento</label>
        <input
          type="number"
          name="porcentaje"
          min="1"
          max="99"
          value={formData.porcentaje}
          onChange={handleChange}
        />

        <label>Fecha inicio</label>
        <input
          type="date"
          name="fechaInicio"
          value={formData.fechaInicio}
          onChange={handleChange}
        />
        <label>Fecha fin</label>
        <input
          type="date"
          name="fechaFin"
          min={formData.fechaInicio}
          value={formData.fechaFin}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Crear promoción"}
        </button>
        {msg && <p className="form-info">{msg}</p>}
      </form>
    </div>
  );
}


export default function DealsView() {
  const [deals, setDeals] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dealToEdit, setDealToEdit] = useState(null);

  const idProductor = getLoggedUserId();

  const cargarProductos = async () => {
    try {
      const data = await getProducerProductsApi(idProductor);
      setProductos(data);
    } catch {
      setMensaje("Error cargando productos del productor.");
    }
  };

  const cargarDeals = async () => {
    try {
      const data = await getDeals(idProductor);
      setDeals(data);
      setMensaje(data.length === 0 ? "No tienes promociones registradas." : null);
    } catch {
      setMensaje("Error cargando promociones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idProductor) {
      cargarProductos();
      cargarDeals();
    } else {
      setMensaje("Debes iniciar sesión como productor.");
      setLoading(false);
    }
  }, [idProductor]);

  const handleOfferCreation = () => cargarDeals();
  const handleEditClick = (deal) => setDealToEdit(deal);

  const handleDelete = async (idPromocion, tipo) => {
    if (!window.confirm("¿Eliminar promoción?")) return;
    try {
      await deletePromocion(idPromocion, tipo.toLowerCase());
      setMensaje("Promoción eliminada correctamente.");
      cargarDeals();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="deals-container">
      <h2>Promociones del Productor</h2>
      {mensaje && <div className="message-alert">{mensaje}</div>}

      <OfferCreationForm products={productos} onOfferCreated={handleOfferCreation} />

      <h3>Tus Promociones ({deals.length})</h3>
      {loading && <p>Cargando...</p>}

      <div className="deals-grid">
        {deals.map((deal) => {
          const descuento = deal.porcentaje_descuento
            ? deal.porcentaje_descuento / 100
            : 0;
          const precioFinal = (deal.precio_original * (1 - descuento)).toFixed(2);
          const isDiscount = deal.tipo_deal === "Descuento";
          const statusStyle = getStatusStyle(deal.estado);
          return (
            <div
              key={deal.id_promocion + deal.tipo_deal}
              className={`deal-card ${isDiscount ? "discount" : "offer"}`}
            >
              <div className="deal-image-container">
                <img
                  src={deal.url_imagen || DEFAULT_IMAGE}
                  alt={deal.producto}
                />
                <span className={`image-status-tag ${statusStyle}`}>
                  {deal.estado}
                </span>
              </div>
              <div className="deal-content">
                <div className="deal-header">
                  <span
                    className={`tag ${isDiscount ? "discount-type" : "offer-type"}`}
                  >
                    {deal.tipo_deal}
                  </span>
                  <div className="deal-percentage">
                    {deal.porcentaje_descuento
                      ? `-${deal.porcentaje_descuento}%`
                      : "¡Oferta!"}
                  </div>
                </div>
                <h3>{deal.producto}</h3>
                <p>{deal.descripcion || deal.nombre}</p>
                <div className="price-section">
                  <p
                    className={`price-base ${deal.estado === "Aprobado" && isDiscount
                        ? "line-through-price"
                        : ""
                      }`}
                  >
                    ${deal.precio_original}
                  </p>
                  {deal.estado === "Aprobado" && isDiscount && (
                    <p className="price-final">${precioFinal}</p>
                  )}
                </div>
                <div className="deal-footer">
                  <p>
                    Vigencia: {deal.fecha_inicio} → {deal.fecha_fin}
                  </p>
                  <div className="deal-actions">
                    <button onClick={() => handleEditClick(deal)}>Editar</button>
                    <button
                      onClick={() =>
                        handleDelete(deal.id_promocion, deal.tipo_deal)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dealToEdit && (
        <OfferEditModal
          deal={dealToEdit}
          products={productos}
          onClose={() => setDealToEdit(null)}
          onUpdated={cargarDeals}
        />
      )}
    </div>
  );
}
