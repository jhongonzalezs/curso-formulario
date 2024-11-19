import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormularioCurso from "./components/FormularioCurso";
import ListarCursos from "./components/ListaCursos";

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Formulario de Curso</Link>
            </li>
            <li>
              <Link to="/listar">Listar Cursos</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<FormularioCurso />} />
          <Route path="/listar" element={<ListarCursos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
