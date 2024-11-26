import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Importa tu configuración de Firebase desde este archivo
import "../css/AgregarUnidades.css";

const AgregarUnidades = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [formulario, setFormulario] = useState({
    numeroUnidad: '',
    nombreLeccion: '',
    tematicas: '',
    resultadosAprendizaje: '',
    tipoLeccion: '',
    caracteristicasLeccion: '',
    propositoStorytelling: '',
    duracion: '',
    semanaSugerida: '',
  });

  // Cargar cursos desde Firebase
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cursos'));
        const cursosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCursos(cursosData);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };
    cargarCursos();
  }, []);

  // Manejar cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!cursoSeleccionado || Object.values(formulario).some((campo) => campo === '')) {
      alert('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    try {
      await addDoc(collection(db, 'unidades'), {
        ...formulario,
        cursoId: cursoSeleccionado,
      });
      alert('Unidad agregada correctamente.');
      // Limpiar formulario
      setFormulario({
        numeroUnidad: '',
        nombreLeccion: '',
        tematicas: '',
        resultadosAprendizaje: '',
        tipoLeccion: '',
        caracteristicasLeccion: '',
        propositoStorytelling: '',
        duracion: '',
        semanaSugerida: '',
      });
      setCursoSeleccionado('');
    } catch (error) {
      console.error('Error al agregar unidad:', error);
      alert('Ocurrió un error al agregar la unidad.');
    }
  };

  return (
    <div>
      <h1>Agregar Unidad</h1>
      <form onSubmit={manejarEnvio}>
        {/* Selección de curso */}
        <div>
          <label htmlFor="curso">Seleccionar Curso:</label>
          <select
            id="curso"
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(e.target.value)}
            required
          >
            <option value="">-- Selecciona un curso --</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campos del formulario */}
        <div>
          <label htmlFor="numeroUnidad">Número de Unidad:</label>
          <input
            type="number"
            id="numeroUnidad"
            name="numeroUnidad"
            value={formulario.numeroUnidad}
            onChange={manejarCambio}
            min="1"
            max="3"
            required
          />
        </div>
        <div>
          <label htmlFor="nombreLeccion">Nombre de la Lección:</label>
          <input
            type="text"
            id="nombreLeccion"
            name="nombreLeccion"
            value={formulario.nombreLeccion}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="tematicas">Temáticas:</label>
          <textarea
            id="tematicas"
            name="tematicas"
            value={formulario.tematicas}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="resultadosAprendizaje">Resultados de Aprendizaje:</label>
          <textarea
            id="resultadosAprendizaje"
            name="resultadosAprendizaje"
            value={formulario.resultadosAprendizaje}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="tipoLeccion">Tipo de Lección:</label>
          <input
            type="text"
            id="tipoLeccion"
            name="tipoLeccion"
            value={formulario.tipoLeccion}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="caracteristicasLeccion">Características de la Lección:</label>
          <textarea
            id="caracteristicasLeccion"
            name="caracteristicasLeccion"
            value={formulario.caracteristicasLeccion}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="propositoStorytelling">Propósito y/o Storytelling:</label>
          <textarea
            id="propositoStorytelling"
            name="propositoStorytelling"
            value={formulario.propositoStorytelling}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="duracion">Duración (minutos):</label>
          <input
            type="number"
            id="duracion"
            name="duracion"
            value={formulario.duracion}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="semanaSugerida">Semana Sugerida:</label>
          <input
            type="text"
            id="semanaSugerida"
            name="semanaSugerida"
            value={formulario.semanaSugerida}
            onChange={manejarCambio}
            required
          />
        </div>
        <button type="submit">Agregar Unidad</button>
      </form>
    </div>
  );
};

export default AgregarUnidades;
