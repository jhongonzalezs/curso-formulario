import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormularioCurso from "./components/FormularioCurso";
import ListarCursos from "./components/ListaCursos";
import AgregarUnidades from "./components/AgregarUnidades";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: "100px" }}>
        {/* Asegúrate de que el contenido no quede oculto detrás del Header */}
        <Routes>
          <Route path="/" element={<FormularioCurso />} />
          <Route path="/unidades" element={<AgregarUnidades />} />
          <Route path="/listar" element={<ListarCursos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
