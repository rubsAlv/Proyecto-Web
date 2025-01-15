CREATE TABLE alumnos (
    idAlumno INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    carrera TEXT NOT NULL,
    semestre INTEGER NOT NULL CHECK (semestre > 0),
    boleta TEXT NOT NULL UNIQUE
);

INSERT INTO alumnos (nombre, carrera, semestre, boleta)
VALUES 
('Fernanda Rodríguez', 'Ingeniería en Inteligencia Artificial', 4, '2023630700'),
('Nayeli Alvarez', 'Ingeniería en Inteligencia Artificial', 5, '2023630813'),
('Camila Cabello', 'Licenciatura en Ciencias de Datos', 1, '2024670811'),
('Lauren Jauregui', 'Licenciatura en Ciencias de Datos', 2, '2024000815'),
('Alison Dilaurentis', 'Ingeniería en Inteligencia Artificial', 5, '2020000710'),
('Spencer Hastings', 'Ingeniería Biomédica', 3, '2021006811');
