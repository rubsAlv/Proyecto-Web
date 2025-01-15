import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { PenTool } from "lucide-react";

const API_URL = "http://127.0.0.1:5000/profesores";

const AppProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [showProfesorForm, setShowProfesorForm] = useState(false);
  const [newProfesor, setNewProfesor] = useState({
    idProfesor: null,
    nombre: "",
    correo: "",
    telefono: "",
    idCarrera: "",
  });

  // Fetch para obtener los profesores
  const fetchProfesores = async () => {
    try {
      const response = await axios.get(API_URL);
      setProfesores(response.data);
    } catch (error) {
      console.error("Error al cargar los profesores:", error);
    }
  };

  // Guardar o actualizar un profesor
  const handleSaveProfesor = async () => {
    try {
      if (newProfesor.idProfesor) {
        // Actualizar profesor
        await axios.put(`${API_URL}/${newProfesor.idProfesor}`, newProfesor, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Crear nuevo profesor
        await axios.post(API_URL, newProfesor, {
          headers: { "Content-Type": "application/json" },
        });
      }
      fetchProfesores(); // Refrescar la lista
      setShowProfesorForm(false);
      setNewProfesor({ idProfesor: null, nombre: "", correo: "", telefono: "", idCarrera: "" });
    } catch (error) {
      console.error("Error al guardar el profesor:", error);
    }
  };

  // Eliminar profesor
  const handleDeleteProfesor = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProfesores(); // Refrescar la lista
    } catch (error) {
      console.error("Error al eliminar el profesor:", error);
    }
  };

  // Cargar datos de un profesor en el formulario para editar
  const handleEditProfesor = (id) => {
    const profesor = profesores.find((item) => item.idProfesor === id);
    setNewProfesor(profesor);
    setShowProfesorForm(true);
  };

  // Fetch inicial al cargar la página
  useEffect(() => {
    fetchProfesores();
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
          Profesores
        </span>
        </h1>
      </h1>
        <p className="text-sm text-gray-600 mt-2">Administra a los profesores disponibles</p>
      </header>

      {/* Tabla de profesores */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Profesores</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-pink-300 text-gray-800">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Correo</th>
              <th className="p-4 text-left">Teléfono</th>
              <th className="p-4 text-left">Carrera</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((profesor) => (
              <tr key={profesor.idProfesor} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{profesor.nombre}</td>
                <td className="p-4">{profesor.correo}</td>
                <td className="p-4">{profesor.telefono}</td>
                <td className="p-4">{profesor.idCarrera}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditProfesor(profesor.idProfesor)}
                    className="text-pink-700 hover:underline"
                  >
                    <PenTool /><p>Editar</p>
                  </button>
                  <button
                    onClick={() => handleDeleteProfesor(profesor.idProfesor)}
                    className="text-black-500 hover:underline"
                  >
                    <Trash2 /><p>Eliminar</p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para agregar profesor */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowProfesorForm(true)}
          className="bg-pink-400 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition"
        >
          Nuevo Profesor
        </button>
      </div>

      {/* Formulario de Profesor */}
      {showProfesorForm && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">{newProfesor.idProfesor ? "Editar Profesor" : "Nuevo Profesor"}</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="p-2 border border-gray-300 rounded"
              value={newProfesor.nombre}
              onChange={(e) => setNewProfesor({ ...newProfesor, nombre: e.target.value })}
            />
            <input
              type="email"
              placeholder="Correo"
              className="p-2 border border-gray-300 rounded"
              value={newProfesor.correo}
              onChange={(e) => setNewProfesor({ ...newProfesor, correo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="p-2 border border-gray-300 rounded"
              value={newProfesor.telefono}
              onChange={(e) => setNewProfesor({ ...newProfesor, telefono: e.target.value })}
            />
            <input
              type="number"
              placeholder="ID de Carrera"
              className="p-2 border border-gray-300 rounded"
              value={newProfesor.idCarrera}
              onChange={(e) => setNewProfesor({ ...newProfesor, idCarrera: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => setShowProfesorForm(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveProfesor}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Volver a alumnos */}
      <footer className="text-center mt-8">
        <Link to="/" className="text-pink-800 hover:underline text-lg">
          <ArrowLeft className="inline-block mr-2" /> Volver a alumnos
        </Link>
      </footer>
    </div>
  );
};

export default AppProfesores;
