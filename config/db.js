const sqlite3 = require('sqlite3').verbose();

// Conectar ou criar o banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao SQLite com sucesso!');
  }
});

// Criar a tabela de usuários (caso ainda não exista)
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha TEXT NOT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
)`);

module.exports = db;
