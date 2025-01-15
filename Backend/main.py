from flask import Flask, request, jsonify
import json
import sqlite3
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

def db_connection():
    conn = None
    try:

        conn = sqlite3.connect(os.getenv("DB_NAME"))
        conn.row_factory = sqlite3.Row  
    except sqlite3.Error as e:
        print(f"Error de conexión con la BD: {e}")
    return conn

@app.route('/')
def index():
    return jsonify({"message": "Todo bien API inciada:)"}), 200


@app.route('/carreras', methods=['GET', 'POST'])
def all_carreras():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM carreras")
            all_carreras = [
                dict(
                    idCarrera=row["idCarrera"],
                    carrera=row["carrera"],
                    descripcionCarrera=row["descripcionCarrera"],
                    semestres=row["semestres"],
                    plan=row["plan"]
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_carreras), 200
        except Exception as e:
            print(f"Error fetching carreras: {e}")
            return jsonify({"error": "Error al obtener carreras"}), 500

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['carrera', 'descripcionCarrera', 'semestres', 'plan']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO carreras (carrera, descripcionCarrera, semestres, plan)
                     VALUES (?, ?, ?, ?)"""
            cursor.execute(sql, (
                data["carrera"],
                data["descripcionCarrera"],
                int(data["semestres"]),
                int(data["plan"])
            ))
            conn.commit()
            return jsonify({"message": "Carrera creada exitosamente"}), 201
        except Exception as e:
            print(f"Error creating carrera: {e}")
            return jsonify({"error": "Error al crear carrera"}), 500

@app.route('/carreras/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_carrera(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM carreras WHERE idCarrera = ?", (id,))
            row = cursor.fetchone()
            if row:
                carrera = dict(
                    idCarrera=row["idCarrera"],
                    carrera=row["carrera"],
                    descripcionCarrera=row["descripcionCarrera"],
                    semestres=row["semestres"],
                    plan=row["plan"]
                )
                return jsonify(carrera), 200
            return jsonify({"error": "Carrera no encontrada"}), 404
        except Exception as e:
            print(f"Error fetching carrera: {e}")
            return jsonify({"error": "Error al obtener carrera"}), 500

    if request.method == "PUT":
        try:
            data = request.get_json()
            if not all(key in data for key in ['carrera', 'descripcionCarrera', 'semestres', 'plan']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE carreras 
                     SET carrera = ?, descripcionCarrera = ?, semestres = ?, plan = ?
                     WHERE idCarrera = ?"""
            cursor.execute(sql, (
                data["carrera"],
                data["descripcionCarrera"],
                int(data["semestres"]),
                int(data["plan"]),
                id
            ))
            conn.commit()
            return jsonify({"message": "Carrera actualizada exitosamente"}), 200
        except Exception as e:
            print(f"Error updating carrera: {e}")
            return jsonify({"error": "Error al actualizar carrera"}), 500

    if request.method == "DELETE":
        try:
            cursor.execute("DELETE FROM carreras WHERE idCarrera = ?", (id,))
            conn.commit()
            return jsonify({"message": "Carrera eliminada exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting carrera: {e}")
            return jsonify({"error": "Error al eliminar carrera"}), 500

# Rutas para 'alumnos' (similar a carreras)
@app.route('/alumnos', methods=['GET', 'POST'])
def all_alumnos():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM alumnos")
            all_alumnos = [
                dict(
                    idAlumno=row["idAlumno"],
                    nombre=row["nombre"],
                    carrera=row["carrera"],
                    semestre=row["semestre"],
                    boleta=row["boleta"]
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_alumnos), 200
        except Exception as e:
            print(f"Error fetching alumnos: {e}")
            return jsonify({"error": "Error al obtener alumnos"}), 500

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'carrera', 'semestre', 'boleta']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO alumnos (nombre, carrera, semestre, boleta)
                     VALUES (?, ?, ?, ?)"""
            cursor.execute(sql, (
                data["nombre"],
                data["carrera"],
                int(data["semestre"]),
                data["boleta"]
            ))
            conn.commit()
            return jsonify({"message": "Alumno creado exitosamente"}), 201
        except Exception as e:
            print(f"Error creating alumno: {e}")
            return jsonify({"error": "Error al crear alumno"}), 500

@app.route('/alumnos/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_alumno(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM alumnos WHERE idAlumno = ?", (id,))
            row = cursor.fetchone()
            if row:
                alumno = dict(
                    idAlumno=row["idAlumno"],
                    nombre=row["nombre"],
                    carrera=row["carrera"],
                    semestre=row["semestre"],
                    boleta=row["boleta"]
                )
                return jsonify(alumno), 200
            return jsonify({"error": "Alumno no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching alumno: {e}")
            return jsonify({"error": "Error al obtener alumno"}), 500

    if request.method == "PUT":
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'carrera', 'semestre', 'boleta']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE alumnos
                     SET nombre = ?, carrera = ?, semestre = ?, boleta = ?
                     WHERE idAlumno = ?"""
            cursor.execute(sql, (
                data["nombre"],
                data["carrera"],
                int(data["semestre"]),
                data["boleta"],
                id
            ))
            conn.commit()
            return jsonify({"message": "Alumno actualizado exitosamente"}), 200
        except Exception as e:
            print(f"Error updating alumno: {e}")
            return jsonify({"error": "Error al actualizar alumno"}), 500

    if request.method == "DELETE":
        try:
            cursor.execute("DELETE FROM alumnos WHERE idAlumno = ?", (id,))
            conn.commit()
            return jsonify({"message": "Alumno eliminado exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting alumno: {e}")
            return jsonify({"error": "Error al eliminar alumno"}), 500

@app.route('/materias', methods=['GET', 'POST'])
def all_materias():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM materias")
            all_materias = [
                dict(
                    idMateria=row["idMateria"],
                    nombre=row["nombre"],
                    clave=row["clave"],
                    semestre=row["semestre"],
                    idCarrera=row["idCarrera"]
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_materias), 200
        except Exception as e:
            print(f"Error fetching materias: {e}")
            return jsonify({"error": "Error al obtener materias"}), 500

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'clave', 'semestre', 'idCarrera']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO materias (nombre, clave, semestre, idCarrera)
                     VALUES (?, ?, ?, ?)"""
            cursor.execute(sql, (
                data["nombre"],
                data["clave"],
                int(data["semestre"]),
                int(data["idCarrera"])
            ))
            conn.commit()
            return jsonify({"message": "Materia creada exitosamente"}), 201
        except Exception as e:
            print(f"Error creating materia: {e}")
            return jsonify({"error": "Error al crear materia"}), 500

@app.route('/materias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_materia(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM materias WHERE idMateria = ?", (id,))
            row = cursor.fetchone()
            if row:
                materia = dict(
                    idMateria=row["idMateria"],
                    nombre=row["nombre"],
                    clave=row["clave"],
                    semestre=row["semestre"],
                    idCarrera=row["idCarrera"]
                )
                return jsonify(materia), 200
            return jsonify({"error": "Materia no encontrada"}), 404
        except Exception as e:
            print(f"Error fetching materia: {e}")
            return jsonify({"error": "Error al obtener materia"}), 500

    if request.method == "PUT":
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'clave', 'semestre', 'idCarrera']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE materias
                     SET nombre = ?, clave = ?, semestre = ?, idCarrera = ?
                     WHERE idMateria = ?"""
            cursor.execute(sql, (
                data["nombre"],
                data["clave"],
                int(data["semestre"]),
                int(data["idCarrera"]),
                id
            ))
            conn.commit()
            return jsonify({"message": "Materia actualizada exitosamente"}), 200
        except Exception as e:
            print(f"Error updating materia: {e}")
            return jsonify({"error": "Error al actualizar materia"}), 500

    if request.method == "DELETE":
        try:
            cursor.execute("DELETE FROM materias WHERE idMateria = ?", (id,))
            conn.commit()
            return jsonify({"message": "Materia eliminada exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting materia: {e}")
            return jsonify({"error": "Error al eliminar materia"}), 500

@app.route('/profesores', methods=['GET', 'POST'])
def all_profesores():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM profesores")
            all_profesores = [
                dict(
                    idProfesor=row["idProfesor"],
                    nombre=row["nombre"],
                    correo=row["correo"],
                    telefono=row["telefono"],
                    idCarrera=row["idCarrera"]
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_profesores), 200
        except Exception as e:
            print(f"Error fetching profesores: {e}")
            return jsonify({"error": "Error al obtener profesores"}), 500

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'correo', 'idCarrera']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO profesores (nombre, correo, telefono, idCarrera)
                     VALUES (?, ?, ?, ?)"""
            cursor.execute(sql, (
                data["nombre"],
                data["correo"],
                data.get("telefono", None),
                data["idCarrera"]
            ))
            conn.commit()
            return jsonify({"message": "Profesor creado exitosamente"}), 201
        except Exception as e:
            print(f"Error creating profesor: {e}")
            return jsonify({"error": "Error al crear profesor"}), 500

@app.route('/profesores/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_profesor(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM profesores WHERE idProfesor = ?", (id,))
            row = cursor.fetchone()
            if row:
                profesor = dict(
                    idProfesor=row["idProfesor"],
                    nombre=row["nombre"],
                    correo=row["correo"],
                    telefono=row["telefono"],
                    idCarrera=row["idCarrera"]
                )
                return jsonify(profesor), 200
            return jsonify({"error": "Profesor no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching profesor: {e}")
            return jsonify({"error": "Error al obtener profesor"}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'correo', 'idCarrera']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE profesores 
                     SET nombre = ?, correo = ?, telefono = ?, idCarrera = ?
                     WHERE idProfesor = ?"""
            cursor.execute(sql, (
                data["nombre"],
                data["correo"],
                data.get("telefono", None),
                data["idCarrera"],
                id
            ))
            conn.commit()
            return jsonify({"message": "Profesor actualizado exitosamente"}), 200
        except Exception as e:
            print(f"Error updating profesor: {e}")
            return jsonify({"error": "Error al actualizar profesor"}), 500

    if request.method == 'DELETE':
        try:
            cursor.execute("DELETE FROM profesores WHERE idProfesor = ?", (id,))
            conn.commit()
            return jsonify({"message": "Profesor eliminado exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting profesor: {e}")
            return jsonify({"error": "Error al eliminar profesor"}), 500


@app.route('/salones', methods=['GET', 'POST'])
def all_salones():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM salones")
            all_salones = [
                dict(
                    idSalon=row["idSalon"],
                    nombre=row["nombre"],
                    capacidad=row["capacidad"],
                    ubicacion=row["ubicacion"]
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_salones), 200
        except Exception as e:
            print(f"Error fetching salones: {e}")
            return jsonify({"error": "Error al obtener salones"}), 500

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'capacidad', 'ubicacion']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """INSERT INTO salones (nombre, capacidad, ubicacion)
                     VALUES (?, ?, ?)"""
            cursor.execute(sql, (
                data["nombre"],
                int(data["capacidad"]),
                data["ubicacion"]
            ))
            conn.commit()
            return jsonify({"message": "Salón creado exitosamente"}), 201
        except Exception as e:
            print(f"Error creating salon: {e}")
            return jsonify({"error": "Error al crear salón"}), 500

@app.route('/salones/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_salon(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM salones WHERE idSalon = ?", (id,))
            row = cursor.fetchone()
            if row:
                salon = dict(
                    idSalon=row["idSalon"],
                    nombre=row["nombre"],
                    capacidad=row["capacidad"],
                    ubicacion=row["ubicacion"]
                )
                return jsonify(salon), 200
            return jsonify({"error": "Salón no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching salon: {e}")
            return jsonify({"error": "Error al obtener salón"}), 500

    if request.method == "PUT":
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'capacidad', 'ubicacion']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE salones
                     SET nombre = ?, capacidad = ?, ubicacion = ?
                     WHERE idSalon = ?"""
            cursor.execute(sql, (
                data["nombre"],
                int(data["capacidad"]),
                data["ubicacion"],
                id
            ))
            conn.commit()
            return jsonify({"message": "Salón actualizado exitosamente"}), 200
        except Exception as e:
            print(f"Error updating salon: {e}")
            return jsonify({"error": "Error al actualizar salón"}), 500

    if request.method == "DELETE":
        try:
            cursor.execute("DELETE FROM salones WHERE idSalon = ?", (id,))
            conn.commit()
            return jsonify({"message": "Salón eliminado exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting salon: {e}")
            return jsonify({"error": "Error al eliminar salón"}), 500


if __name__ == '__main__':
    app.run(debug=True)
