import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PenTool} from "lucide-react";


const API_URL = "http://127.0.0.1:5000/carreras";

const AppCarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [error, setError] = useState(null);
  const [showCarreraForm, setShowCarreraForm] = useState(false); 
  const [selectedCarrera, setSelectedCarrera] = useState(null); 

  const [newCarrera, setNewCarrera] = useState({
    carrera: "",
    descripcionCarrera: "",
    semestres: "",
    plan: "",
  });

  
  const fetchCarreras = async () => {
    try {
      const response = await axios.get(API_URL);
      setCarreras(response.data); 
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  /
  const handleSaveCarrera = async () => {
    try {
      if (selectedCarrera) {
       
        await axios.put(`${API_URL}/${selectedCarrera.idCarrera}`, newCarrera);
      } else {
       
        await axios.post(API_URL, newCarrera);
      }
      fetchCarreras(); 
      setShowCarreraForm(false); 
      setSelectedCarrera(null); 
      setNewCarrera({ carrera: "", descripcionCarrera: "", semestres: "", plan: "" }); 
      setError("error al guardar la carreraa");
    }
  };

  
  const handleDeleteCarrera = async (idCarrera) => {
    try {
      await axios.delete(`${API_URL}/${idCarrera}`);
      fetchCarreras(); 
    } catch (err) {
      setError("erro al eliminar la carrera");
    }
  };

  
  const handleEditCarrera = (carrera) => {
    setSelectedCarrera(carrera);
    setNewCarrera({
      carrera: carrera.carrera,
      descripcionCarrera: carrera.descripcionCarrera,
      semestres: carrera.semestres,
      plan: carrera.plan,
    });
    setShowCarreraForm(true);
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
          Carreras
        </span>
        </h1>
      </h1>
        <p className="text-sm text-gray-600 mt-2">Modifica carreras disponibles</p>
      </header>


      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded shadow mb-4">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Carreras</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-pink-200 text-gray-800">
            <tr>
              <th className="p-4 text-left">Carrera</th>
              <th className="p-4 text-left">Descripción</th>
              <th className="p-4 text-left">Semestres</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carreras.map((carrera) => (
              <tr key={carrera.idCarrera} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{carrera.carrera}</td>
                <td className="p-4">{carrera.descripcionCarrera}</td>
                <td className="p-4">{carrera.semestres}</td>
                <td className="p-4">{carrera.plan}</td>
                <td className="p-4 flex gap-4">
                  <button onClick={() => handleEditCarrera(carrera)} className="text-pink-600 hover:underline">
                    <PenTool /><p>Editar</p>
                  </button>
                  <button
                    onClick={() => handleDeleteCarrera(carrera.idCarrera)}
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
          onClick={() => setShowCarreraForm(true)}
          className="bg-pink-400 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition"
        >
          Nueva Carrera
        </button>
      </div>

      {showCarreraForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">{selectedCarrera ? "Editar Carrera" : "Nueva Carrera"}</h3>
            <input
              type="text"
              placeholder="Nombre de la carrera"
              value={newCarrera.carrera}
              onChange={(e) => setNewCarrera({ ...newCarrera, carrera: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Descripción"
              value={newCarrera.descripcionCarrera}
              onChange={(e) => setNewCarrera({ ...newCarrera, descripcionCarrera: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="number"
              placeholder="Semestres"
              value={newCarrera.semestres}
              onChange={(e) => setNewCarrera({ ...newCarrera, semestres: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Plan"
              value={newCarrera.plan}
              onChange={(e) => setNewCarrera({ ...newCarrera, plan: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveCarrera} className="bg-pink-400 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-pink-400 transition">
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowCarreraForm(false);
                  setSelectedCarrera(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <footer className="text-center mt-8">
              <Link to="/" className="text-pink-900 hover:underline text-lg">
                <ArrowLeft className="inline-block mr-2" /> Volver a alumnos
              </Link>
            </footer>
    </div>
  );
};

export default AppCarreras;
