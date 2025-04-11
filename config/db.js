const sqlite3 = require('sqlite3').verbose();

// Conectar ou criar o banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao SQLite com sucesso!');
  }
});

// Criar as tabelas
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    idUsuarios INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    data_cadastro DATE DEFAULT CURRENT_DATE
);`);

db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id_feedback INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    tipo_feedback TEXT NOT NULL,
    mensagem TEXT,
    data_feedback DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (idUsuarios)
);`);

db.run(`CREATE TABLE IF NOT EXISTS playlistUsuarios (
    id_playlist INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    nome_playlist TEXT NOT NULL,
    data_criacao DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (idUsuarios)
);`);

db.run(`CREATE TABLE IF NOT EXISTS playlistCursos (
    id_playlist INTEGER NOT NULL,
    id_curso INTEGER NOT NULL,
    data_adicao DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_playlist, id_curso),
    FOREIGN KEY (id_playlist) REFERENCES PlaylistUsuarios (id_playlist),
    FOREIGN KEY (id_curso) REFERENCES Cursos (id_cursos)
);`);

db.run(`CREATE TABLE IF NOT EXISTS avaliacoesComentarios (
    id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_curso INTEGER NOT NULL,
    comentario TEXT,
    nota INTEGER CHECK (nota BETWEEN 1 AND 5),
    data_avaliacao DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (idUsuarios),
    FOREIGN KEY (id_curso) REFERENCES Cursos (id_cursos)
);`);

db.run(`CREATE TABLE IF NOT EXISTS cursos (
    id_cursos INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER,
    id_site INTEGER,
    nome_curso TEXT NOT NULL,
    descricao TEXT,
    duracao TEXT,
    url TEXT,
    formato TEXT CHECK (formato IN ('texto', 'video', 'interativo')),
    nivel_dificuldade TEXT CHECK (nivel_dificuldade IN ('iniciante', 'intermediario', 'avancado')),
    FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categorias),
    FOREIGN KEY (id_site) REFERENCES Sites (id_site)
);`);

db.run(`CREATE TABLE IF NOT EXISTS categoriasCursos (
    id_curso INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_curso, id_categoria),
    FOREIGN KEY (id_curso) REFERENCES Cursos (id_cursos),
    FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categorias)
);`);

db.run(`CREATE TABLE IF NOT EXISTS softwares (
    id_softwares INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER,
    id_site INTEGER,
    nome TEXT NOT NULL,
    url TEXT,
    desenvolvedor TEXT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categorias),
    FOREIGN KEY (id_site) REFERENCES Sites (id_site)
);`);

db.run(`CREATE TABLE IF NOT EXISTS sites (
    id_site INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER,
    nome TEXT NOT NULL,
    url TEXT,
    descricao TEXT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categorias)
);`);

db.run(`CREATE TABLE IF NOT EXISTS categoriasSites (
    id_categorias INTEGER NOT NULL,
    id_sites INTEGER NOT NULL,
    PRIMARY KEY (id_categorias, id_sites),
    FOREIGN KEY (id_categorias) REFERENCES Categorias (id_categorias),
    FOREIGN KEY (id_sites) REFERENCES Sites (id_site)
);`);

db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id_categorias INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT
);`);

db.run(`CREATE TABLE IF NOT EXISTS tutoriais (
    id_tutorial INTEGER PRIMARY KEY AUTOINCREMENT,
    id_software INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    FOREIGN KEY (id_software) REFERENCES Softwares (id_softwares)
);`);

db.run(`CREATE TABLE IF NOT EXISTS denuncias (
    id_denuncia INTEGER PRIMARY KEY AUTOINCREMENT,
    id_comentario INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    data_denuncia DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_comentario) REFERENCES AvaliacoesComentarios (id_comentario),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (idUsuarios)
);`);

module.exports = db;
