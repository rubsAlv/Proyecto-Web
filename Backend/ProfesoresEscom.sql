CREATE TABLE profesores (
    idProfesor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    telefono TEXT,
    idCarrera INTEGER NOT NULL,
    FOREIGN KEY (idCarrera) REFERENCES carreras (idCarrera)
);