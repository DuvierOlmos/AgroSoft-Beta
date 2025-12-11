import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { CarritoProvider } from './context/CarritoContext';

// Componentes globales (cliente)
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";

// Páginas del cliente
import Catalogo from "./pages/Catalogo.js";
import Home from "./pages/Home.js";
import Blog from "./pages/Blog.js";
import ProductPage from "./pages/ProductPage.js";
import Ofertas from "./pages/Ofertas.js";
import Carrito from "./pages/Carrito.js";

// Aplicación del productor
import ProductorApp from "./productorApp.jsx"; 

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        const roleMap = { 1: "cliente", 2: "administrador", 3: "productor" };
        const finalUserData = { ...userData, role: roleMap[userData.id_rol] || "cliente" };
        
        setUser(finalUserData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error al analizar los datos del usuario:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    const roleMap = { 1: "cliente", 2: "administrador", 3: "productor" };
    const finalUserData = { ...userData, role: roleMap[userData.id_rol] || "cliente" };

    localStorage.setItem("user", JSON.stringify(finalUserData));
    setUser(finalUserData);
    setIsAuthenticated(true);
    
    if (finalUserData.role === "productor") {
      window.location.href = "/AdminView";
    } else {
      window.location.href = "/";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login"; 
  };

  const Layout = ({ children }) => (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <div className="page-content">{children}</div>
      <Footer />
    </>
  );
  
  const ProtectedRoute = ({ element }) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;

  const ProducerGuard = ({ element }) => {
    if (isAuthenticated && user?.role === "productor") {
      return <Navigate to="/AdminView" replace />;
    }
    return element;
  };

  return (
    <CarritoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} /> 
          
          <Route path="/catalogo" element={
            <ProducerGuard element={<Layout><Catalogo /></Layout>} />
          } />
          
          <Route path="/producto/:id" element={
            <ProducerGuard element={<Layout><ProductPage /></Layout>} />
          } />
          
          <Route path="/blog" element={
            <ProducerGuard element={<Layout><Blog /></Layout>} />
          } />
          
          <Route path="/ofertas" element={
            <ProducerGuard element={<Layout><Ofertas /></Layout>} />
          } />

          <Route path="/carrito" element={
            <ProducerGuard element={
              <ProtectedRoute element={
                <Layout><Carrito /></Layout>
              } />
            } />
          } />
          
          <Route path="/login" element={
            isAuthenticated && user?.role === "productor" 
              ? <Navigate to="/AdminView" replace />
              : (isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />)
          } />
          
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
          } />

          <Route path="/AdminView/*" element={
            isAuthenticated && user?.role === "productor" ? (
              <ProductorApp user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CarritoProvider>
  );
}

export default App;