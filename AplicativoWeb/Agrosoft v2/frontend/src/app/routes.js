import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageUser from "../features/dashboard/user/pages/PageUser";
import PageCategoria from "../features/dashboard/categorias/pages/PageCategoria";
import PageProductos from "../features/dashboard/productos/pages/PageProductos";
import PagePqrs from "../features/dashboard/pqrs/pages/pagePqrs";
import PageTipoPqrs from "../features/dashboard/tipoPqrs/pages/pageTipoPqrs";
import PageRoles from "../features/dashboard/roles/pages/PageRoles";
import PageInventarios from "../features/dashboard/inventarios/pages/PageInventarios";
import PagePedido from "../features/dashboard/pedidos/pages/PagePedido";
import PageReportes from "../features/dashboard/reportes/pages/PageReportes";
import PageDescuentos from "../features/dashboard/descuentos/pages/PageDescuentos";

export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onToggle={setSidebarOpen} />

      {/* Ajusta el margen dinámicamente */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Routes>
          {/* Rutas relativas; el contenedor decide el prefijo (p.ej., /admin/*) */}
          <Route index element={<Navigate to="user" replace />} />
          <Route path="user" element={<PageUser />} />
          <Route path="categorias" element={<PageCategoria />} />
          <Route path="productos" element={<PageProductos />} />
          <Route path="pqrs" element={<PagePqrs />} />
          <Route path="tipoPqrs" element={<PageTipoPqrs />} />
          <Route path="inventarios" element={<PageInventarios />} />
          <Route path="pedidos" element={<PagePedido />} />
          <Route path="reportes" element={<PageReportes />} />
          <Route path="roles" element={<PageRoles />} />
          <Route path="descuentos" element={<PageDescuentos />} />

          {/* Catch-all dentro del dashboard admin */}
          <Route path="*" element={<Navigate to="user" replace />} />
        </Routes>
      </main>
    </div>
  );
}
