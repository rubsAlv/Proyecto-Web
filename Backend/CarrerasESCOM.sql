CREATE TABLE carreras (
    idCarrera INTEGER PRIMARY KEY AUTOINCREMENT,
    carrera TEXT NOT NULL,
    descripcionCarrera TEXT,
    semestres INTEGER NOT NULL,
    plan INTEGER NOT NULL
);