const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'seuSegredoSuperSecreto';
const JWT_EXPIRES_IN = '1d';

// Listar todos os usuários
exports.getAllUsuarios = (req, res) => {
  db.all('SELECT id, nome, email FROM usuarios', [], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).send('Erro interno');
    } else {
      res.json(results);
    }
  });
};

// Criar novo usuário (sem bcrypt)
exports.createUsuario = (req, res) => {
  const { nome, email, senha } = req.body;

  db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', 
    [nome, email, senha], 
    function(err) {
      if (err) {
        console.error('Erro ao inserir usuário:', err);
        res.status(500).send('Erro interno');
      } else {
        res.status(201).json({ id: this.lastID, nome, email });
      }
    }
  );
};

// Buscar um usuário por ID
exports.getUsuarioById = (req, res) => {
  const usuarioID = req.params.id;

  db.get('SELECT id, nome, email FROM usuarios WHERE id = ?', [usuarioID], (err, row) => {
    if (err) {
      res.status(500).send('Erro no servidor');
    } else if (!row) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.json(row);
    }
  });
};

// Atualizar um usuário (sem bcrypt)
exports.updateUsuario = (req, res) => {
  const usuarioID = req.params.id;
  const { nome, email, senha } = req.body;

  let query, params;
  
  if (senha) {
    query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';
    params = [nome, email, senha, usuarioID];
  } else {
    query = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
    params = [nome, email, usuarioID];
  }

  db.run(query, params, function(err) {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).send('Erro interno');
    } else if (this.changes === 0) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.send('Usuário atualizado com sucesso!');
    }
  });
};

// Deletar um usuário
exports.deleteUsuario = (req, res) => {
  const usuarioID = req.params.id;

  db.run('DELETE FROM usuarios WHERE id = ?', [usuarioID], function(err) {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      res.status(500).send('Erro interno no servidor');
    } else if (this.changes === 0) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.send('Usuário deletado com sucesso');
    }
  });
};

// Login simplificado (sem bcrypt)
exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ 
      success: false, 
      message: "E-mail e senha são obrigatórios" 
    });
  }

  // Busca o usuário no banco
  db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', 
    [email, senha], 
    (err, usuario) => {
      if (err) {
        console.error('Erro no banco de dados:', err);
        return res.status(500).json({ 
          success: false, 
          message: "Erro interno no servidor" 
        });
      }

      if (!usuario) {
        return res.status(401).json({ 
          success: false, 
          message: "E-mail ou senha incorretos" 
        });
      }

      // Cria token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Remove a senha do objeto de retorno
      const { senha: _, ...usuarioSemSenha } = usuario;
      
      res.status(200).json({ 
        success: true, 
        usuario: usuarioSemSenha,
        token
      });
    }
  );
};

// Middleware de verificação de token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Token não fornecido" 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false, 
        message: "Token inválido ou expirado" 
      });
    }
    
    req.userId = decoded.id;
    next();
  });
};

// Obter usuário atual
exports.getCurrentUser = (req, res) => {
  const userId = req.userId;
  
  db.get('SELECT id, nome, email FROM usuarios WHERE id = ?', 
    [userId], 
    (err, usuario) => {
      if (err || !usuario) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuário não encontrado" 
        });
      }
      res.json({ success: true, usuario });
    }
  );
};

// Adicione a função logout que estava faltando
exports.logout = (req, res) => {
  // Esta é uma implementação básica - o logout real é feito no cliente removendo o token
  res.json({ 
    success: true, 
    message: "Logout realizado com sucesso (client-side)" 
  });
};