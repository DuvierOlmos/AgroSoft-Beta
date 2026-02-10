import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import '../style/Oferta.css';

export default function MisPqrs() {
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipoPqrs, setTipoPqrs] = useState([]);
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ id_tipo_pqrs: '', asunto: '', descripcion: '' });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchTipos();
    fetchEstados();
    fetchMyPqrs();
  }, []);

  const fetchTipos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/tipoPqrs/admin');
      const data = await res.json();
      console.log('[MisPqrs] tipos response:', data);
      if (Array.isArray(data)) {
        setTipoPqrs(data);
      } else if (data && Array.isArray(data.data)) {
        setTipoPqrs(data.data);
      }
    } catch (err) {
      console.error('Error cargando tipos PQRS', err);
    }
  };

  const fetchEstados = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/estadoPqrs/admin');
      const data = await res.json();
      if (Array.isArray(data)) setEstados(data);
    } catch (err) {
      console.error('Error cargando estados PQRS', err);
    }
  };

  const estadoLabel = (id) => {
    const e = estados.find(s => s.id_estado_pqrs === id);
    return e ? e.nombre_estado : `#${id}`;
  };

  const tipoLabel = (id) => {
    const t = tipoPqrs.find(s => s.id_tipo_pqrs === id);
    return t ? t.nombre_tipo : `#${id}`;
  };

  const fetchMyPqrs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/pqrs/my-pqrs/${user.id_usuario}`);
      const data = await res.json();
      if (data.success) setPqrs(data.data);
      else setPqrs([]);
    } catch (err) {
      console.error('Error cargando PQRS', err);
      setPqrs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.id_tipo_pqrs || !form.asunto || !form.descripcion) {
        addNotification('Completa todos los campos', 'warning');
        return;
      }

      const body = {
        id_usuario: user.id_usuario,
        id_tipo_pqrs: form.id_tipo_pqrs,
        asunto: form.asunto,
        descripcion: form.descripcion
      };

      const res = await fetch('http://localhost:4000/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        addNotification('PQRS creada correctamente', 'success');
        setForm({ id_tipo_pqrs: '', asunto: '', descripcion: '' });
        fetchMyPqrs();
      } else {
        addNotification(data.error || 'Error creando PQRS', 'error');
      }
    } catch (err) {
      console.error(err);
      addNotification('Error creando PQRS', 'error');
    }
  };

  const startEdit = (item) => {
    if (item.id_estado_pqrs !== 1) {
      addNotification('Solo puedes editar PQRS que aún no han sido respondidas', 'warning');
      return;
    }
    setEditing({ ...item });
  };

  const cancelEdit = () => setEditing(null);

  const submitEdit = async () => {
    try {
      if (!editing.asunto || !editing.descripcion) {
        addNotification('Completa asunto y descripción', 'warning');
        return;
      }

      const body = {
        id_usuario: user.id_usuario,
        asunto: editing.asunto,
        descripcion: editing.descripcion
      };

      const res = await fetch(`http://localhost:4000/api/pqrs/${editing.id_pqrs}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        addNotification('PQRS actualizada', 'success');
        setEditing(null);
        fetchMyPqrs();
      } else {
        addNotification(data.error || 'Error actualizando', 'error');
      }
    } catch (err) {
      console.error(err);
      addNotification('Error actualizando PQRS', 'error');
    }
  };

  return (
    <div className="mis-pqrs-page container">
      <h2 className="page-title">Mis PQRS</h2>

      <div className="grid-2">
        <section className="pqrs-form-section card">
          <h3 className="card-title">Crear nueva PQRS</h3>
          <form onSubmit={handleSubmit} className="pqrs-form">
            <label>Tipo</label>
            <select name="id_tipo_pqrs" value={form.id_tipo_pqrs} onChange={handleChange}>
              <option value="">Selecciona un tipo</option>
              {tipoPqrs.map(t => (
                <option key={t.id_tipo_pqrs} value={t.id_tipo_pqrs}>{t.nombre_tipo}</option>
              ))}
            </select>

            <label>Asunto</label>
            <input name="asunto" value={form.asunto} onChange={handleChange} placeholder="Breve resumen" />

            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Describe tu petición" />

            <button type="submit" className="btn-primary">Enviar PQRS</button>
          </form>
        </section>

        <section className="pqrs-list-section">
          <h3 className="section-title">Mis solicitudes</h3>
          {loading ? <p>Cargando...</p> : (
            <div className="pqrs-list">
              {pqrs.map(item => (
                <article key={item.id_pqrs} className="pqrs-item card">
                  <div className="pqrs-item-main">
                    <div>
                      <h4 className="pqrs-asunto">{item.asunto}</h4>
                      <div className="pqrs-sub">
                        <span className="badge tipo">{tipoLabel(item.id_tipo_pqrs)}</span>
                        <span className={`badge estado ${item.id_estado_pqrs === 1 ? 'pending' : 'answered'}`}>{estadoLabel(item.id_estado_pqrs)}</span>
                        <small className="pqrs-fecha">{new Date(item.fecha_creacion).toLocaleString()}</small>
                      </div>
                      <p className="pqrs-desc">{item.descripcion}</p>
                    </div>
                  </div>
                  <div className="pqrs-actions">
                    {item.id_estado_pqrs === 1 ? (
                      <button className="btn-outline" onClick={() => startEdit(item)}>Editar</button>
                    ) : (
                      <button className="btn-disabled" title="Esta PQRS ya fue respondida" disabled>Editar</button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h4>Editar PQRS #{editing.id_pqrs}</h4>
            <label>Asunto</label>
            <input value={editing.asunto} onChange={(e) => setEditing({ ...editing, asunto: e.target.value })} />
            <label>Descripción</label>
            <textarea value={editing.descripcion} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} />
            <div className="modal-actions">
              <button className="btn-primary" onClick={submitEdit}>Guardar</button>
              <button className="btn-outline" onClick={cancelEdit}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
