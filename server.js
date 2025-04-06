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

// Rota para listar usuários
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).send('Erro interno');
    } else {
      res.json(results);
    }
  });
});

// Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');
});


//Criar novo usuario, adiciona uma rota para inserie usuarios no banco
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err, results) => {
      if (err) {
        console.error('Erro ao inserir usuário:', err);
        res.status(500).send('Erro interno no servidor');
      } else {
        res.status(201).send('Usuário criado com sucesso!');
      }
    });
  });

//listar todos os usuarios
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro interno no servidor');
      } else {
        res.json(results);
      }
    });
  });

  //atualizar um usuario 
  app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(query, [nome, email, senha, id], (err, results) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).send('Erro interno no servidor');
      } else {
        res.send('Usuário atualizado com sucesso!');
      }
    });
  });

  app.get('/usuarios/:id', (req, res) => {
    const usuarioID = req.params.id;
  
    // Executa a consulta com db.query
    db.query('SELECT * FROM usuarios WHERE id = ?', [usuarioID], (err, results) => {
      if (err) {
        res.status(500).send('Erro no servidor');
      } else if (results.length === 0) {
        res.status(404).send('Usuário não encontrado');
      } else {
        res.json(results[0]); // Retorna o primeiro resultado (usuário) como JSON
      }
    });
  });

  //deletar um usuario
  app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erro ao deletar usuário:', err);
        res.status(500).send('Erro interno no servidor');
      } else {
        res.send('Usuário deletado com sucesso!');
      }
    });
  });