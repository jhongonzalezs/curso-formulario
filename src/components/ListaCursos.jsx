import  { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "../css/ListarCursos.css"; // Archivo CSS actualizado

const ListaCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [cursoEditable, setCursoEditable] = useState(null);

  // Función para obtener los cursos desde Firebase
  const fetchCursos = async () => {
    const cursosCollection = collection(db, "cursos");
    const cursosSnapshot = await getDocs(cursosCollection);
    const cursosList = cursosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCursos(cursosList);
  };

  // Función para eliminar un curso
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este curso?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "cursos", id));
      alert("Curso eliminado correctamente.");
      fetchCursos();
    }
  };

  // Función para abrir el formulario de edición
  const handleEdit = (curso) => {
    setCursoEditable(curso);
    setIsEditing(true);
  };

  // Función para manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCursoEditable({ ...cursoEditable, [name]: value });
  };

  // Función para guardar los cambios en Firebase
  const handleSave = async () => {
    const cursoDoc = doc(db, "cursos", cursoEditable.id);
    await updateDoc(cursoDoc, { ...cursoEditable });
    alert("Curso actualizado correctamente.");
    setIsEditing(false);
    fetchCursos();
  };

  useEffect(() => {
    fetchCursos();
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
