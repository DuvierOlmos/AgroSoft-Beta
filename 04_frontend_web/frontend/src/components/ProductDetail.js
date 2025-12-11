import React, { useState } from "react";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaLeaf, 
  FaShippingFast, 
  FaAward 
} from "react-icons/fa";
import "./ProductDetail.css";

const ProductDetail = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) return <p>No hay datos del producto.</p>;

  const images =
    product.imagenes && product.imagenes.length > 0
      ? product.imagenes
      : [product.url_imagen];

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-details">
      
      <div className="product-details-left">
        
        <div className="carousel-wrapper">
          {images.length > 1 && (
            <button className="carousel-btn" onClick={handlePrev}>
              <FaChevronLeft />
            </button>
          )}

          <div className="product-carousel">
            <img
              src={images[currentImage]}
              alt={`${product.nombre_producto} ${currentImage + 1}`}
              className="product-detail-image"
            />
          </div>

          {images.length > 1 && (
            <button className="carousel-btn" onClick={handleNext}>
              <FaChevronRight />
            </button>
          )}
        </div>

        
        {images.length > 1 && (
          <div className="product-thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Miniatura ${index + 1}`}
                className={`thumbnail ${currentImage === index ? "active" : ""}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        )}

       
        <div className="product-additional-info">
          <div className="quality-features">
            <div className="feature-card">
              <FaLeaf className="feature-icon organic" />
              <h4>Orgánico Certificado</h4>
              <p>100% natural sin químicos</p>
            </div>
            <div className="feature-card">
              <FaShippingFast className="feature-icon shipping" />
              <h4>Envío Rápido</h4>
              <p>Entrega en 24-48h</p>
            </div>
            <div className="feature-card">
              <FaAward className="feature-icon premium" />
              <h4>Calidad Premium</h4>
              <p>Selección especial</p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="product-details-right">
        <h1>{product.nombre_producto}</h1>
        <p className="product-details-price">
          {product.precio_unitario} COP / {product.unidad_medida}
        </p>
        <p className="product-details-description">
          {product.descripcion_producto}
        </p>

        <div className="product-meta">
          <p>
            <strong>Estado:</strong>{" "}
            {product.estado_producto === "Activo" ? "Disponible" : "Agotado"}
          </p>
          <p>
            <strong>Cantidad disponible:</strong> {product.cantidad ?? 0}
          </p>
        </div>

       
        {product.agricultor && (
          <div className="producer-info">
            <h2>Información del productor</h2>
            <p><strong>Nombre:</strong> {product.agricultor}</p>
           
            {product.ubicacion_almacenamiento && (
              <p><strong>Ubicación:</strong> {product.ubicacion_almacenamiento}</p>
            )}
            {product.contacto && (
              <p><strong>Contacto:</strong> {product.contacto}</p>
            )}
          </div>
        )}

        <button className="product-btn-cart">Comprar</button>
      </div>
    </div>
  );
};

export default ProductDetail;
