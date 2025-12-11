import { Routes, Route } from "react-router-dom"; // Eliminamos el import de Router
import ProductorNavbar from "./components/Navbarproductor.jsx";
import AdminView from "./pages/AdminView.jsx";
import Finanza from "./pages/Finanza.jsx";
import OfertasPage from "./pages/DealsView.jsx";
import OrdenesPage from "./pages/OrdenesPage.jsx";
import ReseñasView from "./pages/ReseñasView.jsx";

// Este componente NO debe usar <Router> ya que se renderiza dentro de otro Router en App.js
function ProductorApp({ user, onLogout }) { // Se añaden user y onLogout si son necesarias para Navbar
  return (
    <> {/* Reemplazamos <Router> por un Fragment */}
      {/* El ProductorNavbar debe tener enlaces relativos */}
      <ProductorNavbar onLogout={onLogout} user={user} /> 
      <main className="flex-1 p-4">
        {/* El Carousel se muestra en todas las páginas del productor */}
        <Routes>
          {/* La ruta base /AdminView es mapeada a la ruta index */}
          <Route index element={<AdminView />} /> 
          {/* Rutas relativas a /AdminView/ (ej: /AdminView/finanza) */}
          <Route path="finanza" element={<Finanza />} />
          <Route path="ofertas" element={<OfertasPage />} />
          <Route path="ordenes" element={<OrdenesPage />} />
          <Route path="resenas" element={<ReseñasView />} />

          {/* Ruta de fallback */}
          <Route path="*" element={<AdminView />} /> 
        </Routes>
      </main>
    </>
  );
}

export default ProductorApp;
