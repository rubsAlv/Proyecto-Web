CREATE TABLE materias (
    idMateria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    clave TEXT NOT NULL UNIQUE,
    semestre INTEGER NOT NULL,
    idCarrera INTEGER NOT NULL,
    FOREIGN KEY (idCarrera) REFERENCES carreras (idCarrera)
);
