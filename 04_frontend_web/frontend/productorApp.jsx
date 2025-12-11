// src/ProductorApp.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductorNavbar from "./components/ProductorNavbar.jsx";
import AdminView from "./paginas/AdminView.jsx";
import Finanza from "./paginas/Finanza.jsx";
import OfertasPage from "./paginas/DealsView.jsx";
import Carousel from "./components/Carousel.jsx";
import OrdenesPage from "./paginas/OrdenesPage.jsx";

function ProductorApp() {
  return (
    <Router>
      <ProductorNavbar />
      <main>
        <Carousel />
        <Routes>
          <Route path="/" element={<AdminView />} />
          <Route path="/finanza" element={<Finanza />} />
          <Route path="/ofertas" element={<OfertasPage />} />
          <Route path="/ordenes" element={<OrdenesPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default ProductorApp;
