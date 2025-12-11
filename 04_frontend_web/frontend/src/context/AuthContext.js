import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const DEBUG_MODE = true;

  useEffect(() => {
    if (DEBUG_MODE) {
      const fakeUser = {
        id_usuario: 99,
        id_rol: 1, 
        nombre: "Usuario Demo",
        email: "demo@demo.com",
      };
      setUser(fakeUser);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch (error) {
          console.error("Token inválido:", error);
          setUser(null);
        }
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isCliente = () => user?.id_rol === 1;
  const isAdmin = () => user?.id_rol === 2;
  const isAgricultor = () => user?.id_rol === 3;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isCliente,
        isAdmin,
        isAgricultor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
