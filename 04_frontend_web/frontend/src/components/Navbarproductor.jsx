import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductorNavbar = ({ onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand text-success fw-bold" to="/AdminView">
            Agrosoft
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <Link className="nav-link" to="/AdminView">Productos</Link> 
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/AdminView/finanza">Finanza</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/AdminView/ordenes">Órdenes</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/AdminView/resenas">Reseñas</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/AdminView/ofertas">Ofertas y Descuentos</Link>
            </li>
          </ul>
          
          <form className="d-flex me-3" role="search">
            <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>

          <button 
            className="btn btn-danger" 
            onClick={onLogout} 
            type="button"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default ProductorNavbar;
