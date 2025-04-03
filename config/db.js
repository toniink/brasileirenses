const mysql = require('mysql2');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configurar a conexão com o MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Testar a conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    return;
  }
  console.log('Conexão com o banco bem-sucedida!');
});

module.exports = connection;