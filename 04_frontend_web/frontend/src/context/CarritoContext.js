import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [numeroItems, setNumeroItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('user'));

  const actualizarCarrito = async () => {
    if (usuario?.id_usuario) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/carrito/numero-items/${usuario.id_usuario}`
        );
        setNumeroItems(response.data.data);
      } catch (error) {
        console.error('Error al actualizar carrito:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    actualizarCarrito();
  }, [usuario]);

  const agregarAlCarrito = async (producto, cantidad = 1) => {
    if (!usuario) {
      alert('Por favor inicia sesión para agregar productos al carrito');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:4000/api/carrito/agregar', {
        id_usuario: usuario.id_usuario,
        id_producto: producto.id_producto,
        cantidad,
      });
      await actualizarCarrito();
      alert('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar el producto al carrito');
    } finally {
      setLoading(false);
    }
  };

  const eliminarDelCarrito = async (idItem) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/api/carrito_items/${idItem}`);
      await actualizarCarrito();
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        itemsCarrito,
        setItemsCarrito,
        numeroItems,
        actualizarCarrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        loading,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};
