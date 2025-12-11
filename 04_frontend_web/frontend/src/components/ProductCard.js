import React from "react";
import { FaShoppingCart, FaStar, FaLock } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({
  id,
  image,
  title,
  description,
  producer,
  price,
  stock,
  available,
  isAuthenticated,
  onAddToCart,
  onWriteReview
}) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-card-image" />

      <div className="product-card-info">
        <h3 className="product-card-title">{title}</h3>
        <p className="product-card-description">{description}</p>
        <p className="product-card-producer">Productor: {producer}</p>
        <p className="product-card-price">{price}</p>
        <p className={`product-card-stock ${stock === "Disponible" ? "in-stock" : "out-of-stock"}`}>
          {stock}
        </p>
        <p className="product-card-available">Disponibles: {available}</p>

        <div className="product-card-actions">
          {isAuthenticated ? (
            <button
              className="btn-add-to-cart"
              onClick={onAddToCart}
              disabled={stock !== "Disponible"}
            >
              <FaShoppingCart className="me-2" />
              Agregar al Carrito
            </button>
          ) : (
            <button
              className="btn-add-to-cart-disabled"
              disabled
              title="Inicia sesión para comprar"
            >
              <FaLock className="me-2" />
              Inicia sesión para comprar
            </button>
          )}

          <button
            className={`btn-review ${isAuthenticated ? '' : 'disabled'}`}
            onClick={onWriteReview}
            disabled={!isAuthenticated}
          >
            <FaStar className="me-2" />
            {isAuthenticated ? 'Escribir Reseña' : 'Inicia sesión para reseñar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
