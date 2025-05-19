const sqlite3 = require('sqlite3').verbose();

// Conectar ou criar o banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao SQLite com sucesso!');
    // Ativar suporte a chaves estrangeiras
    db.run("PRAGMA foreign_keys = ON");
  }
});

// Criar as tabelas com ON DELETE CASCADE
db.serialize(() => {
  // Tabelas básicas
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    idUsuarios INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    data_cadastro DATE DEFAULT CURRENT_DATE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS admin (
    id_admin INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    data_criacao DATE DEFAULT CURRENT_DATE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id_categorias INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id_site INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER,
    nome TEXT NOT NULL,
    url TEXT,
    descricao TEXT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categorias) ON DELETE SET NULL
  );`);

  // Tabelas de feedback e playlists
  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id_feedback INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_feedback TEXT NOT NULL,
    mensagem TEXT,
    email TEXT,
    data_feedback DATE DEFAULT CURRENT_DATE
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS playlistUsuarios (
    id_playlist INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    nome_playlist TEXT NOT NULL,
    data_criacao DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(idUsuarios) ON DELETE CASCADE
  );`);

  // Tabelas de cursos e conteúdo
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
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categorias) ON DELETE SET NULL,
    FOREIGN KEY (id_site) REFERENCES Sites(id_site) ON DELETE SET NULL
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS curso_secoes (
    id_secao_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_curso INTEGER NOT NULL,
    tipo TEXT CHECK(tipo IN ('titulo', 'area_atuacao', 'paragrafo', 'lista', 'passo_a_passo')),
    ordem INTEGER NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_cursos) ON DELETE CASCADE
  );`);

  // Tabelas de conteúdo de cursos
  db.run(`CREATE TABLE IF NOT EXISTS curso_conteudo_titulo (
    id_titulo_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao_curso INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_secao_curso) REFERENCES curso_secoes(id_secao_curso) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS curso_conteudo_area_atuacao (
    id_area_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao_curso INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    FOREIGN KEY (id_secao_curso) REFERENCES curso_secoes(id_secao_curso) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS curso_conteudo_paragrafo (
    id_paragrafo_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao_curso INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_secao_curso) REFERENCES curso_secoes(id_secao_curso) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS curso_conteudo_lista (
    id_item_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao_curso INTEGER NOT NULL,
    item TEXT NOT NULL,
    FOREIGN KEY (id_secao_curso) REFERENCES curso_secoes(id_secao_curso) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS curso_conteudo_passo (
    id_passo_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao_curso INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    instrucao TEXT NOT NULL,
    imagem TEXT,
    FOREIGN KEY (id_secao_curso) REFERENCES curso_secoes(id_secao_curso) ON DELETE CASCADE
  );`);

  // Tabela de associação muitos-para-muitos entre cursos e softwares
  db.run(`CREATE TABLE IF NOT EXISTS cursos_softwares (
      id_curso INTEGER NOT NULL,
      id_software INTEGER NOT NULL,
      PRIMARY KEY (id_curso, id_software),
      FOREIGN KEY (id_curso) REFERENCES cursos(id_cursos) ON DELETE CASCADE,
      FOREIGN KEY (id_software) REFERENCES softwares(id_softwares) ON DELETE CASCADE
  );`);


  // Tabelas de relacionamento
  db.run(`CREATE TABLE IF NOT EXISTS categoriasCursos (
    id_curso INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_curso, id_categoria),
    FOREIGN KEY (id_curso) REFERENCES Cursos(id_cursos) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categorias) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS playlistCursos (
    id_playlist INTEGER NOT NULL,
    id_curso INTEGER NOT NULL,
    data_adicao DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_playlist, id_curso),
    FOREIGN KEY (id_playlist) REFERENCES PlaylistUsuarios(id_playlist) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES Cursos(id_cursos) ON DELETE CASCADE
  );`);

  // Tabelas de softwares e conteúdo
  db.run(`CREATE TABLE IF NOT EXISTS softwares (
    id_softwares INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER,
    id_site INTEGER,
    nome TEXT NOT NULL,
    url TEXT,
    desenvolvedor TEXT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categorias) ON DELETE SET NULL,
    FOREIGN KEY (id_site) REFERENCES Sites(id_site) ON DELETE SET NULL
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS software_secoes (
    id_secao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_software INTEGER NOT NULL,
    tipo TEXT CHECK(tipo IN ('titulo', 'area_atuacao', 'paragrafo', 'lista')),
    ordem INTEGER NOT NULL,
    FOREIGN KEY (id_software) REFERENCES softwares(id_softwares) ON DELETE CASCADE
  );`);

  // Tabelas de conteúdo de softwares
  db.run(`CREATE TABLE IF NOT EXISTS software_conteudo_titulo (
    id_titulo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES software_secoes(id_secao) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS software_conteudo_area_atuacao (
    id_area INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES software_secoes(id_secao) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS software_conteudo_paragrafo (
    id_paragrafo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES software_secoes(id_secao) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS software_conteudo_lista (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    item TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES software_secoes(id_secao) ON DELETE CASCADE
  );`);




  // Tabelas de tutoriais e conteúdo
  db.run(`CREATE TABLE IF NOT EXISTS tutoriais (
    id_tutorial INTEGER PRIMARY KEY AUTOINCREMENT,
    id_software INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    FOREIGN KEY (id_software) REFERENCES softwares(id_softwares) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS secoes_tutorial (
    id_secao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tutorial INTEGER NOT NULL,
    tipo TEXT CHECK(tipo IN ('paragrafo', 'titulo', 'lista', 'imagem')),
    ordem INTEGER NOT NULL,
    FOREIGN KEY (id_tutorial) REFERENCES tutoriais(id_tutorial) ON DELETE CASCADE
  );`);

  // Tabelas de conteúdo de tutoriais
  db.run(`CREATE TABLE IF NOT EXISTS conteudo_paragrafo (
    id_paragrafo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES secoes_tutorial(id_secao) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS conteudo_titulo (
    id_titulo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES secoes_tutorial(id_secao) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS conteudo_lista (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    item TEXT NOT NULL,
    FOREIGN KEY (id_secao) REFERENCES secoes_tutorial(id_secao) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS conteudo_imagem (
    id_imagem INTEGER PRIMARY KEY AUTOINCREMENT,
    id_secao INTEGER NOT NULL,
    url TEXT NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_secao) REFERENCES secoes_tutorial(id_secao) ON DELETE CASCADE
  );`);

  // Tabelas de relacionamento
  db.run(`CREATE TABLE IF NOT EXISTS tutorial_software (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_software INTEGER NOT NULL,
    id_tutorial INTEGER NOT NULL,
    FOREIGN KEY (id_software) REFERENCES softwares(id_softwares) ON DELETE CASCADE,
    FOREIGN KEY (id_tutorial) REFERENCES tutoriais(id_tutorial) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS categoriasSites (
    id_categorias INTEGER NOT NULL,
    id_sites INTEGER NOT NULL,
    PRIMARY KEY (id_categorias, id_sites),
    FOREIGN KEY (id_categorias) REFERENCES Categorias(id_categorias) ON DELETE CASCADE,
    FOREIGN KEY (id_sites) REFERENCES Sites(id_site) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS avaliacoesComentarios (
    id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_curso INTEGER NOT NULL,
    comentario TEXT,
    nota INTEGER CHECK (nota BETWEEN 1 AND 5),
    data_avaliacao DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(idUsuarios) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES Cursos(id_cursos) ON DELETE CASCADE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS denuncias (
    id_denuncia INTEGER PRIMARY KEY AUTOINCREMENT,
    id_comentario INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    data_denuncia DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_comentario) REFERENCES AvaliacoesComentarios(id_comentario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(idUsuarios) ON DELETE CASCADE
  );`);
});

module.exports = db;