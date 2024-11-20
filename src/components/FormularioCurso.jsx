import { useState } from "react";
import "../css/FormularioCurso.css"; // Importamos el archivo de estilos
import { db } from "../firebase"; // Importamos Firebase
import { collection, addDoc } from "firebase/firestore";

const FormularioCurso = () => {
  const [curso, setCurso] = useState({
    nombre: "",
    categoria: "",
    duracion: "",
    autor: "",
    fechaCreacion: "",
    programas: "",
    presentacionLarga: "",
    presentacionCorta: "",
    resultados: ["", "", ""],
    storytelling: {
      problema: "",
      solucion: "",
      finalFeliz: "",
    },
  });

  const [unidades, setUnidades] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurso({ ...curso, [name]: value });
  };

  const handleStorytellingChange = (e) => {
    const { name, value } = e.target;
    setCurso({
      ...curso,
      storytelling: { ...curso.storytelling, [name]: value },
    });
  };

  const addUnidad = () => {
    setUnidades([
      ...unidades,
      {
        nombre: "",
        tematicas: "",
        resultados: "",
      },
    ]);
  };

  const handleUnidadChange = (index, e) => {
    const { name, value } = e.target;
    const nuevasUnidades = [...unidades];
    nuevasUnidades[index][name] = value;
    setUnidades(nuevasUnidades);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Guardar datos del curso
      const cursoRef = await addDoc(collection(db, "cursos"), curso);

      // Guardar unidades asociadas al curso
      for (const unidad of unidades) {
        await addDoc(collection(db, `cursos/${cursoRef.id}/unidades`), unidad);
      }

      alert("Datos guardados correctamente en Firebase");
      // Reiniciar formulario
      setCurso({
        nombre: "",
        categoria: "",
        duracion: "",
        autor: "",
        fechaCreacion: "",
        programas: "",
        presentacionLarga: "",
        presentacionCorta: "",
        resultados: ["", "", ""],
        storytelling: {
          problema: "",
          solucion: "",
          finalFeliz: "",
        },
      });
      setUnidades([]);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form className="formulario-curso" onSubmit={handleSubmit}>
      <h1 className="titulo">Plan de Curso</h1>

      <section className="seccion">
        <label>Nombre del Curso:</label>
        <input
          type="text"
          name="nombre"
          value={curso.nombre}
          onChange={handleInputChange}
        />

        <label>Categoría:</label>
        <input
          type="text"
          name="categoria"
          value={curso.categoria}
          onChange={handleInputChange}
        />

        <label>Duración:</label>
        <input
          type="text"
          name="duracion"
          value={curso.duracion}
          onChange={handleInputChange}
        />

        <label>Autor:</label>
        <input
          type="text"
          name="autor"
          value={curso.autor}
          onChange={handleInputChange}
        />

        <label>Fecha de Creación:</label>
        <input
          type="date"
          name="fechaCreacion"
          value={curso.fechaCreacion}
          onChange={handleInputChange}
        />

        <label>Programas:</label>
        <input
          type="text"
          name="programas"
          value={curso.programas}
          onChange={handleInputChange}
        />
      </section>

      <section className="seccion">
        <h2>Descripción</h2>
        <label>Presentación Larga:</label>
        <textarea
          name="presentacionLarga"
          value={curso.presentacionLarga}
          onChange={handleInputChange}
        />

        <label>Presentación Corta:</label>
        <textarea
          name="presentacionCorta"
          value={curso.presentacionCorta}
          onChange={handleInputChange}
        />

        <h3>Resultados de Aprendizaje</h3>
        {curso.resultados.map((resultado, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Resultado ${index + 1}`}
            value={resultado}
            onChange={(e) => {
              const nuevosResultados = [...curso.resultados];
              nuevosResultados[index] = e.target.value;
              setCurso({ ...curso, resultados: nuevosResultados });
            }}
          />
        ))}
      </section>

      <section className="seccion">
        <h2>Storytelling</h2>
        <label>Problema General:</label>
        <textarea
          name="problema"
          value={curso.storytelling.problema}
          onChange={handleStorytellingChange}
        />

        <label>Solución General:</label>
        <textarea
          name="solucion"
          value={curso.storytelling.solucion}
          onChange={handleStorytellingChange}
        />

        <label>Final Feliz:</label>
        <textarea
          name="finalFeliz"
          value={curso.storytelling.finalFeliz}
          onChange={handleStorytellingChange}
        />
      </section>

      <section className="seccion">
        <h2>Estructura del Curso</h2>
        <button type="button" onClick={addUnidad} className="btn">
          Añadir Unidad
        </button>

        {unidades.map((unidad, index) => (
          <div className="unidad" key={index}>
            <h3>Unidad {index + 1}</h3>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={unidad.nombre}
              onChange={(e) => handleUnidadChange(index, e)}
            />

            <label>Temáticas:</label>
            <textarea
              name="tematicas"
              value={unidad.tematicas}
              onChange={(e) => handleUnidadChange(index, e)}
            />

            <label>Resultados:</label>
            <textarea
              name="resultados"
              value={unidad.resultados}
              onChange={(e) => handleUnidadChange(index, e)}
            />
          </div>
        ))}
      </section>

      <button type="submit" className="btn enviar">
        Guardar
      </button>
    </form>
  );
};

export default FormularioCurso;