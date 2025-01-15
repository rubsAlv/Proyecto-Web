import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Plus, Edit2, Trash2, ArrowRight } from "lucide-react";
import axios from "axios";
import { PenTool} from "lucide-react";


const API_URL = "http://127.0.0.1:5000/alumnos";

const AppAlumnos = () => {
  const [carreras, setCarreras] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [showAlumnoForm, setShowAlumnoForm] = useState(false);
  const [newAlumno, setNewAlumno] = useState({
    idAlumno: null,
    nombre: "",
    carrera: "",
    semestre: "",
    boleta: "",
  });

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlumnos(response.data);
    } catch (err) {
      setError("Error al cargar los alumnos");
    }
  };

  const fetchCarreras = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/carreras");
      setCarreras(response.data);
    } catch (err) {
      setError("Error al cargar las carreras");
    }
  };

  useEffect(() => {
    fetchAlumnos();
    fetchCarreras();
  }, []);

  const handleSaveAlumno = async () => {
    try {
      let response;
      if (newAlumno.idAlumno) {
        response = await axios.put(`${API_URL}/${newAlumno.idAlumno}`, newAlumno, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(API_URL, newAlumno, {
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log("Respuesta del backend:", response.data);
      fetchAlumnos();
      setShowAlumnoForm(false);
      setNewAlumno({ idAlumno: null, nombre: "", carrera: "", semestre: "", boleta: "" });
    } catch (err) {
      console.error("Error al guardar el alumno:", err);
      setError("Error al guardar el alumno");
    }
  };
  

  const handleDeleteAlumno = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAlumnos();
    } catch (err) {
      setError("Error al eliminar el alumno");
    }
  };

  const handleEditAlumno = (id) => {
    const alumno = alumnos.find((item) => item.idAlumno === id);
    setNewAlumno(alumno);
    setShowAlumnoForm(true);
  };

  return (
    <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 min-h-screen p-8">
      <header className="text-center mb-8">
      <h1
        className="text-4xl font-extrabold text-black-600 drop-shadow-lg"
        style={{ fontFamily: "'Amatic SC', cursive" }}
      >
        <h1 className="text-[60px] font-extrabold drop-shadow-lg">
        <span className="text-black">
          Alumnos
        </span>
        </h1>
      </h1>
        <p className="text-sm text-gray-600 mt-2">Alumnos que están inscritos actualmente.</p>
      </header>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-pink-300 text-gray-800">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Carrera</th>
              <th className="p-4 text-left">Semestre</th>
              <th className="p-4 text-left">Boleta</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.idAlumno} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{alumno.nombre}</td>
                <td className="p-4">{alumno.carrera}</td>
                <td className="p-4">{alumno.semestre}</td>
                <td className="p-4">{alumno.boleta}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditAlumno(alumno.idAlumno)}
                    className="text-pink-600 hover:underline"
                  >
                    <PenTool /><p>Editar</p>
                  </button>
                  <button
                    onClick={() => handleDeleteAlumno(alumno.idAlumno)}
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

      <div className="flex justify-center">
        <button
          onClick={() => setShowAlumnoForm(true)}
          className="bg-pink-400 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition"
        >
           Nuevo Alumno
        </button>
      </div>

      {/* Formulario de nuevo alumno */}
      {showAlumnoForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {newAlumno.idAlumno ? "Editar Alumno" : "Nuevo Alumno"}
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                value={newAlumno.nombre}
                onChange={(e) => setNewAlumno({ ...newAlumno, nombre: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Carrera</label>
              <select
                value={newAlumno.carrera}
                onChange={(e) => setNewAlumno({ ...newAlumno, carrera: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Seleccionar Carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera.idCarrera} value={carrera.carrera}>
                    {carrera.carrera}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Semestre</label>
              <input
                type="number"
                value={newAlumno.semestre}
                onChange={(e) => setNewAlumno({ ...newAlumno, semestre: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Boleta</label>
              <input
                type="text"
                value={newAlumno.boleta}
                onChange={(e) => setNewAlumno({ ...newAlumno, boleta: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowAlumnoForm(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAlumno}
                className="bg-pink-400 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <footer className="text-center mt-8">
        <Link to="/carreras" className="text-pink-900 hover:underline text-lg">
          Carreras <ArrowRight />
        </Link>
        <Link to="/materias" className="text-pink-900 hover:underline text-lg mt-4">
          Materias <ArrowRight />
        </Link>
        <Link to="/Profesores" className="text-pink-900 hover:underline text-lg mt-4">
          Profesores <ArrowRight />
        </Link>
        <Link to="/Salones" className="text-pink-900 hover:underline text-lg mt-4">
          Salones <ArrowRight />
        </Link>
      </footer>

    </div>
  );
};

export default AppAlumnos;
