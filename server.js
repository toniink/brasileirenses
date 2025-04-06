const express = require('express');
const app = express();
const db = require('./config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10; //Define a força do hash
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
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
      // Gerar hash da senha antes de salvar no banco
      const hashSenha = await bcrypt.hash(senha, saltRounds);

      db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashSenha], function (err) {
          if (err) {
              console.error('Erro ao inserir usuário:', err);
              res.status(500).send('Erro interno');
          } else {
              res.status(201).json({ id: this.lastID, nome, email });
          }
      });

  } catch (error) {
      console.error('Erro ao criar hash da senha:', error);
      res.status(500).send('Erro ao processar senha');
  }
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
app.put('/usuarios/:id', async (req, res) => {
  const usuarioID = req.params.id;
  const { nome, email, senha } = req.body;

  try {
      let senhaFinal = senha;
      if (senha) {
          senhaFinal = await bcrypt.hash(senha, saltRounds); // Hashear a nova senha
      }

      db.run('UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?', [nome, email, senhaFinal, usuarioID], function (err) {
          if (err) {
              console.error('Erro ao atualizar usuário:', err);
              res.status(500).send('Erro interno');
          } else if (this.changes === 0) {
              res.status(404).send('Usuário não encontrado');
          } else {
              res.send('Usuário atualizado com sucesso!');
          }
      });

  } catch (error) {
      console.error('Erro ao criar hash da senha:', error);
      res.status(500).send('Erro ao processar senha');
  }
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
