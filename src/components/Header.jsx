import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  return (
    <header className="navbar">
      <div className="navbar-logo">Mi Portal Educativo</div>
      <nav>
        <ul className="navbar-menu">
          <li>
            <Link to="/">Formulario de Curso</Link>
          </li>
          <li>
            <Link to="/unidades">Agregar Unidades</Link>
          </li>
          <li>
            <Link to="/listar">Listar Cursos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
