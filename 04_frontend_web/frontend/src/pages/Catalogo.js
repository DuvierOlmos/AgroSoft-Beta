import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Slideshow2 from "../components/Slideshow2";
import ProductCard from "../components/ProductCard";
import CatalogNav from "../components/CatalogNav";
import SearchBar from "../components/SearchBar";
import "../style/Catalogo.css";

const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("user");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => {
        console.log("Respuesta completa:", res);
        console.log("res.data:", res.data);

        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (res.data && Array.isArray(res.data.result)) {
          setProducts(res.data.result);
        } else {
          console.warn("Estructura de datos inesperada:", res.data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setLoading(false);
        setProducts([]);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Slideshow2 />
        <div className="catalogo-section-title">
          <h2 className="catalogo-title-animated">Catálogo de productos</h2>
        </div>
        <CatalogNav />
        <SearchBar onSearch={setSearch} />
        <main className="catalogo-container">
          <div className="catalogo-loading">Cargando productos...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Slideshow2 />

      <div className="catalogo-section-title">
        <h2 className="catalogo-title-animated">Catálogo de productos</h2>
      </div>

      <CatalogNav />
      <SearchBar onSearch={setSearch} />

      <main className="catalogo-container">
        <div className="catalogo-products-grid">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard
                key={p.id_producto}
                id={p.id_producto}
                image={p.url_imagen}
                title={p.nombre_producto}
                description={p.descripcion_producto || "Sin descripción"}
                producer={p.productor || "Agrosoft"}
                price={`${p.precio_unitario} COP / ${p.unidad_medida}`}
                stock={p.estado_producto === "Activo" ? "Disponible" : "Agotado"}
                available={p.cantidad}
                isAuthenticated={isAuthenticated}
                onAddToCart={() => console.log("🛒 Agregar al carrito:", p.id_producto)}
                onWriteReview={() => navigate(`/producto/${p.id_producto}`)}
              />

            ))
          ) : (
            <div className="catalogo-no-products">
              No se encontraron productos
            </div>
          )}
        </div>

        {/* 🔙 Botón volver */}
        <section className="catalogo-volver-container">
          <button className="catalogo-volver-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Volver
          </button>
        </section>
      </main>
    </>
  );
};

export default Catalogo;
