import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import '../style/MisResenas.css';

export default function MisResenas() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // leer usuario cuando sea necesario dentro del effect/funciones
  const API_URL = 'http://localhost:4000/api';

  const [fetched, setFetched] = React.useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        if (mounted) {
          setReviews([]);
          setLoading(false);
          setFetched(true);
        }
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/reviews/user/${storedUser.id_usuario}`);
        if (mounted) {
          if (res.data.success) {
            setReviews(res.data.reviews || []);
          } else {
            setError(res.data.message || 'Error al obtener reseñas');
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        if (mounted) setError('Error al obtener reseñas');
      } finally {
        if (mounted) {
          setLoading(false);
          setFetched(true);
        }
      }
    };

    fetchReviews();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <div className="mis-resenas-container">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft/> Volver</button>
      <h2>Mis Reseñas</h2>
      <p>Cargando reseñas...</p>
    </div>
  );

  if (error) return (
    <div className="mis-resenas-container">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft/> Volver</button>
      <h2>Mis Reseñas</h2>
      <p className="error">{error}</p>
    </div>
  );

  const startEdit = (r) => {
    setEditingId(r.id_comentario_resena);
    setEditText(r.texto_comentario || "");
    setEditRating(r.calificacion || 5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditRating(5);
  };

  const saveEdit = async (id) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('user'));
      const payload = {
        calificacion: editRating,
        texto_comentario: editText,
        id_usuario: usuario.id_usuario
      };
      const res = await axios.put(`${API_URL}/reviews/${id}`, payload);
      if (res.data.success) {
        addNotification('Reseña actualizada', 'success');
        setReviews(reviews.map(r => r.id_comentario_resena === id ? { ...r, texto_comentario: editText, calificacion: editRating } : r));
        cancelEdit();
      } else {
        addNotification(res.data.message || 'No se pudo actualizar', 'error');
      }
    } catch (err) {
      console.error('Error updating review', err);
      addNotification('Error actualizando reseña', 'error');
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('¿Eliminar reseña? Esta acción no se puede deshacer.')) return;
    try {
      const usuario = JSON.parse(localStorage.getItem('user'));
      const res = await axios.delete(`${API_URL}/reviews/${id}`, { data: { id_usuario: usuario.id_usuario } });
      if (res.data.success) {
        addNotification('Reseña eliminada', 'success');
        setReviews(reviews.filter(r => r.id_comentario_resena !== id));
      } else {
        addNotification(res.data.message || 'No se pudo eliminar', 'error');
      }
    } catch (err) {
      console.error('Error deleting review', err);
      addNotification('Error eliminando reseña', 'error');
    }
  };

  return (
    <div className="mis-resenas-container">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft/> Volver</button>
      <h2>Mis Reseñas</h2>

      {fetched && reviews.length === 0 && (
        <p>No has realizado reseñas aún.</p>
      )}

      {fetched && reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.map(r => (
            <div key={r.id_comentario_resena} className="review-card">
              <div className="review-header">
                <div className="product-name">{r.nombre_producto || 'Producto'}</div>
                <div className="rating">
                  <FaStar className="star" /> {r.calificacion}
                </div>
              </div>
              <div className="review-meta">{new Date(r.fecha_creacion).toLocaleString('es-CO')}</div>

              {editingId === r.id_comentario_resena ? (
                <div className="edit-form">
                  <label>Calificación:
                    <select value={editRating} onChange={e => setEditRating(Number(e.target.value))}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} />
                  <div className="edit-actions">
                    <button className="btn-save" onClick={() => saveEdit(r.id_comentario_resena)}>Guardar</button>
                    <button className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="review-text">{r.texto_comentario}</p>
                  <div className="review-status">Estado: {r.estado_comentario}</div>
                  <div className="review-actions">
                    <button className="btn-edit" onClick={() => startEdit(r)}>Editar</button>
                    <button className="btn-delete" onClick={() => deleteReview(r.id_comentario_resena)}>Eliminar</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
