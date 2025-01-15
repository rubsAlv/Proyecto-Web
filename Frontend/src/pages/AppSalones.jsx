import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { PenTool} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/salones";

const AppSalones = () => {
  const [salones, setSalones] = useState([]);
  const [showSalonForm, setShowSalonForm] = useState(false);
  const [newSalon, setNewSalon] = useState({
    idSalon: null,
    nombre: "",
    capacidad: "",
    ubicacion: "",
  });

  const fetchSalones = async () => {
    try {
      const response = await axios.get(API_URL);
      setSalones(response.data);
    } catch (error) {
      console.error("Error al cargar los salones:", error);
    }
  };

  const handleSaveSalon = async () => {
    try {
      if (newSalon.idSalon) {
        await axios.put(`${API_URL}/${newSalon.idSalon}`, newSalon, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post(API_URL, newSalon, {
          headers: { "Content-Type": "application/json" },
        });
      }
      fetchSalones();
      setShowSalonForm(false);
      setNewSalon({ idSalon: null, nombre: "", capacidad: "", ubicacion: "" });
    } catch (error) {
      console.error("Error al guardar el salón:", error);
    }
  };

  const handleDeleteSalon = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSalones();
    } catch (error) {
      console.error("Error al eliminar el salón:", error);
    }
  };

  const handleEditSalon = (id) => {
    const salon = salones.find((item) => item.idSalon === id);
    setNewSalon(salon);
    setShowSalonForm(true);
  };

  useEffect(() => {
    fetchSalones();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 min-h-screen p-8">
      {/* Título */}
      <header className="text-center mb-8">
        <h1
          className="text-4xl font-extrabold text-black-600 drop-shadow-lg"
          style={{ fontFamily: "'Amatic SC', cursive" }}
        >
          Salones
        </h1>
        <p className="text-sm text-gray-600 mt-2">Modifica la información de los salones</p>
      </header>

      {/* Tabla de Salones */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Salones</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-pink-300 text-gray-800">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Capacidad</th>
              <th className="p-4 text-left">Ubicación</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salones.map((salon) => (
              <tr key={salon.idSalon} className="border-b hover:bg-gray-100 transition">
                <td className="p-4">{salon.nombre}</td>
                <td className="p-4">{salon.capacidad}</td>
                <td className="p-4">{salon.ubicacion}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditSalon(salon.idSalon)}
                    className="text-pink-700 hover:underline"
                  >
                    <PenTool /><p>Editar</p>
                  </button>
                  <button
                    onClick={() => handleDeleteSalon(salon.idSalon)}
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

      {/* Botón para agregar nuevo salón */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowSalonForm(true)}
          className="bg-pink-400 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-pink-500 transition"
        >
          Nuevo Salón
        </button>
      </div>

      {/* Formulario de creación/edición de salón */}
      {showSalonForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {newSalon.idSalon ? "Editar Salón" : "Nuevo Salón"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevenir la recarga de la página
              handleSaveSalon();
            }}
          >
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={newSalon.nombre}
                onChange={(e) => setNewSalon({ ...newSalon, nombre: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="capacidad" className="block text-gray-700 text-sm font-bold mb-2">
                Capacidad
              </label>
              <input
                id="capacidad"
                type="number"
                value={newSalon.capacidad}
                onChange={(e) => setNewSalon({ ...newSalon, capacidad: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ubicacion" className="block text-gray-700 text-sm font-bold mb-2">
                Ubicación
              </label>
              <input
                id="ubicacion"
                type="text"
                value={newSalon.ubicacion}
                onChange={(e) => setNewSalon({ ...newSalon, ubicacion: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowSalonForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
      <footer className="text-center mt-8">
        <Link to="/" className="text-pink-800 hover:underline text-lg">
          <ArrowLeft className="inline-block mr-2" /> Volver a alumnos
        </Link>
      </footer>
    </div>
  );
};

export default AppSalones;
