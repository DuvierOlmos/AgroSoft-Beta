import { Routes, Route } from "react-router-dom"; // Eliminamos el import de Router
import ProductorNavbar from "./components/Navbarproductor.jsx";
import AdminView from "./pages/AdminView.jsx";
import Finanza from "./pages/Finanza.jsx";
import OfertasPage from "./pages/DealsView.jsx";
import OrdenesPage from "./pages/OrdenesPage.jsx";
import ReseñasView from "./pages/ReseñasView.jsx";

function ProductorApp({ isAuthenticated, user, onLogout }) { // Se añaden user y onLogout si son necesarias para Navbar
  return (
    <> {/* Reemplazamos <Router> por un Fragment */}
      <ProductorNavbar isAuthenticated={isAuthenticated} onLogout={onLogout} user={user} /> 
      <main className="flex-1 p-4">
        <Routes>
          <Route index element={<AdminView />} /> 
          <Route path="finanza" element={<Finanza />} />
          <Route path="ofertas" element={<OfertasPage />} />
          <Route path="ordenes" element={<OrdenesPage />} />
          <Route path="resenas" element={<ReseñasView />} />

          <Route path="*" element={<AdminView />} /> 
        </Routes>
      </main>
    </>
  );
}

export default ProductorApp;
