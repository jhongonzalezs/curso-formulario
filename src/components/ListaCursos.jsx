import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../css/ListarCursos.css";

const ListaCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [cursoEditable, setCursoEditable] = useState(null);

  const fetchCursos = async () => {
    const cursosCollection = collection(db, "cursos");
    const cursosSnapshot = await getDocs(cursosCollection);
    const cursosList = cursosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCursos(cursosList);
  };

  const fetchUnidades = async () => {
    const unidadesCollection = collection(db, "unidades");
    const unidadesSnapshot = await getDocs(unidadesCollection);
    const unidadesList = unidadesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUnidades(unidadesList);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este curso?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "cursos", id));
      alert("Curso eliminado correctamente.");
      fetchCursos();
    }
  };

  const handleEdit = (curso) => {
    setCursoEditable(curso);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCursoEditable({ ...cursoEditable, [name]: value });
  };

  const handleSave = async () => {
    const cursoDoc = doc(db, "cursos", cursoEditable.id);
    await updateDoc(cursoDoc, { ...cursoEditable });
    alert("Curso actualizado correctamente.");
    setIsEditing(false);
    fetchCursos();
  };

  const handleExportExcel = (curso) => {
    const unidadesCurso = unidades
      .filter((unidad) => unidad.cursoId === curso.id)
      .sort((a, b) => a.numeroUnidad - b.numeroUnidad);

    const data = [
      ["Plan de Curso", curso.nombre],
      ["Categoría", curso.categoria, "", "Duración", curso.duracion],
      ["Autor", curso.autor, "", "Fecha de Creación", curso.fechaCreacion],
      ["Programas", curso.programas],
      ["Presentación Larga del curso", curso.presentacionLarga],
      ["Presentación Corta del curso", curso.presentacionCorta],
      ["Resultados de aprendizaje"],
      ...(curso.resultados || []).map((resultado) => ["", resultado]),
      ["Storytelling - Problema General", curso.storytelling?.problema || ""],
      ["Storytelling - Solución General", curso.storytelling?.solucion || ""],
      ["Storytelling - Final Feliz", curso.storytelling?.finalFeliz || ""],
      ["Palabras Clave", curso.palabrasClave || ""],
      ["Público Objetivo", curso.publicoObjetivo || ""],
      ["Unidades"],
      ...unidadesCurso.map((unidad) => [
        `Unidad ${unidad.numeroUnidad}`,
        `Nombre: ${unidad.nombreLeccion}`,
        `Duración: ${unidad.duracion}`,
        `Semana Sugerida: ${unidad.semanaSugerida}`,
        `Temáticas: ${unidad.tematicas}`,
        `Propósito: ${unidad.propositoStorytelling}`,
        `Resultados de Aprendizaje: ${unidad.resultadosAprendizaje}`,
        `Tipo: ${unidad.tipoLeccion}`,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, curso.nombre);

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 50 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
    ];

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `${curso.nombre}.xlsx`);
    alert(`Archivo Excel de ${curso.nombre} generado exitosamente.`);
  };

  useEffect(() => {
    fetchCursos();
    fetchUnidades();
  }, []);

  return (
    <div className="listar-cursos">
      <header className="header">
        <h1>Gestión de Cursos</h1>
      </header>

      <main className="contenido">
        {cursos.length === 0 ? (
          <p>No hay cursos disponibles.</p>
        ) : (
          <table className="tabla-cursos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Duración</th>
                <th>Autor</th>
                <th>Fecha de Creación</th>
                <th>Programas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.nombre}</td>
                  <td>{curso.categoria}</td>
                  <td>{curso.duracion}</td>
                  <td>{curso.autor}</td>
                  <td>{curso.fechaCreacion}</td>
                  <td>{curso.programas}</td>
                  <td>
                    <button className="btn actualizar" onClick={() => handleEdit(curso)}>
                      Editar
                    </button>
                    <button className="btn eliminar" onClick={() => handleDelete(curso.id)}>
                      Eliminar
                    </button>
                    <button className="btn excel" onClick={() => handleExportExcel(curso)}>
                      Exportar Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {isEditing && (
        <div className="modal-editar">
          <h2>Editar Curso</h2>
          <form>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={cursoEditable.nombre}
              onChange={handleInputChange}
            />
            <label>Categoría:</label>
            <input
              type="text"
              name="categoria"
              value={cursoEditable.categoria}
              onChange={handleInputChange}
            />
            <label>Duración:</label>
            <input
              type="text"
              name="duracion"
              value={cursoEditable.duracion}
              onChange={handleInputChange}
            />
            <label>Autor:</label>
            <input
              type="text"
              name="autor"
              value={cursoEditable.autor}
              onChange={handleInputChange}
            />
            <label>Fecha de Creación:</label>
            <input
              type="date"
              name="fechaCreacion"
              value={cursoEditable.fechaCreacion}
              onChange={handleInputChange}
            />
            <label>Programas:</label>
            <input
              type="text"
              name="programas"
              value={cursoEditable.programas}
              onChange={handleInputChange}
            />
            <div className="modal-actions">
              <button type="button" className="btn guardar" onClick={handleSave}>
                Guardar
              </button>
              <button type="button" className="btn cancelar" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListaCursos;
