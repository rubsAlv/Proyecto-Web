{/* Código completo */}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { PenTool} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/materias";

const AppMaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [showMateriaForm, setShowMateriaForm] = useState(false);
  const [newMateria, setNewMateria] = useState({
    idMateria: null,
    nombre: "",
    clave: "",
    semestre: "",
    idCarrera: "",
  });

  const fetchMaterias = async () => {
    try {
      const response = await axios.get(API_URL);
      setMaterias(response.data);
    } catch (error) {
      console.error("Error al cargar las materias:", error);
    }
  };

  const handleSaveMateria = async () => {
    try {
      if (newMateria.idMateria) {
        await axios.put(`${API_URL}/${newMateria.idMateria}`, newMateria, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post(API_URL, newMateria, {
          headers: { "Content-Type": "application/json" },
        });
      }
      fetchMaterias();
      setShowMateriaForm(false);
      setNewMateria({ idMateria: null, nombre: "", clave: "", semestre: "", idCarrera: "" });
    } catch (error) {
      console.error("Error al guardar la materia:", error);
    }
  };

  const handleDeleteMateria = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMaterias();
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
    }
  };

  const handleEditMateria = (id) => {
    const materia = materias.find((item) => item.idMateria === id);
    setNewMateria(materia);
    setShowMateriaForm(true);
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 min-h-screen p-8">
      {/* Título principal */}
      <header className="text-center mb-8">
      <h1
        className="text-4xl font-extrabold text-black-600 drop-shadow-lg"
        style={{ fontFamily: "'Amatic SC', cursive" }}
      >
        <h1 className="text-[60px] font-extrabold drop-shadow-lg">
        <span className="text-black">
          Materias
        </span>
        </h1>
      </h1>
        <p className="text-sm text-gray-600 mt-2">Modificar materias disponibles</p>
      </header>

      {/* Tabla de materias */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Materias</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-pink-300 text-gray-800">
            <tr>
              <th className="p-4 text-left">Materia</th>
              <th className="p-4 text-left">Clave</th>
              <th className="p-4 text-left">Semestre</th>
              <th className="p-4 text-left">Carrera</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((materia) => (
              <tr key={materia.idMateria} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{materia.nombre}</td>
                <td className="p-4">{materia.clave}</td>
                <td className="p-4">{materia.semestre}</td>
                <td className="p-4">{materia.idCarrera}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditMateria(materia.idMateria)}
                    className="text-pink-600 hover:underline"
                  >
                    <PenTool /><p>Editar</p>
                  </button>
                  <button
                    onClick={() => handleDeleteMateria(materia.idMateria)}
                    className="text-black-900 hover:underline"
                  >
                    <Trash2 /><p>Eliminar</p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario de materia */}
      {showMateriaForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nueva Materia</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveMateria();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newMateria.nombre}
                  onChange={(e) => setNewMateria({ ...newMateria, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Clave</label>
                <input
                  type="text"
                  value={newMateria.clave}
                  onChange={(e) => setNewMateria({ ...newMateria, clave: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Semestre</label>
                <input
                  type="number"
                  value={newMateria.semestre}
                  onChange={(e) => setNewMateria({ ...newMateria, semestre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">ID Carrera</label>
                <input
                  type="number"
                  value={newMateria.idCarrera}
                  onChange={(e) => setNewMateria({ ...newMateria, idCarrera: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => setShowMateriaForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-pink-400 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón para agregar materia */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowMateriaForm(true)}
          className="bg-pink-400 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition"
        >
          <Plus className="inline-block mr-2" /> Nueva Materia
        </button>
      </div>

      {/* Volver a alumnos */}
      <footer className="text-center mt-8">
        <Link to="/" className="text-pink-900 hover:underline text-lg">
          <ArrowLeft className="inline-block mr-2" /> Volver a alumnos
        </Link>
      </footer>
    </div>
  );
};

export default AppMaterias;
