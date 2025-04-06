const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');

// Habilita CORS para todas as requisições
app.use(cors());

// Configurar o middleware para ler JSON
app.use(express.json());

// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('API do Portal de Recursos está funcionando!');
});

// Rota para listar todos os usuários
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).send('Erro interno');
    } else {
      res.json(results);
    }
  });
});

// Criar novo usuário
app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;
  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';

  db.run(query, [nome, email, senha], function (err) {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      res.status(500).send('Erro interno no servidor');
    } else {
      res.status(201).json({ id: this.lastID, nome, email }); // Retorna o ID gerado
    }
  });
});

// Buscar um usuário por ID
app.get('/usuarios/:id', (req, res) => {
  const usuarioID = req.params.id;

  db.get('SELECT * FROM usuarios WHERE id = ?', [usuarioID], (err, row) => {
    if (err) {
      res.status(500).send('Erro no servidor');
    } else if (!row) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.json(row);
    }
  });
});

// Atualizar um usuário
app.put('/usuarios/:id', (req, res) => {
  const usuarioID = req.params.id;
  const { nome, email, senha } = req.body;
  const query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';

  db.run(query, [nome, email, senha, usuarioID], function (err) {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).send('Erro interno no servidor');
    } else if (this.changes === 0) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.send('Usuário atualizado com sucesso');
    }
  });
});

// Excluir um usuário
app.delete('/usuarios/:id', (req, res) => {
  const usuarioID = req.params.id;
  const query = 'DELETE FROM usuarios WHERE id = ?';

  db.run(query, [usuarioID], function (err) {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      res.status(500).send('Erro interno no servidor');
    } else if (this.changes === 0) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.send('Usuário deletado com sucesso');
    }
  });
});

// Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');
});
