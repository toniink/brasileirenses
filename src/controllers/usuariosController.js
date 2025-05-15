const db = require('../config/db'); // Importa o banco
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Listar todos os usuários
exports.getAllUsuarios = (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).send('Erro interno');
    } else {
      res.json(results);
    }
  });
};

// Criar novo usuário
exports.createUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
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
};

// Buscar um usuário por ID
exports.getUsuarioById = (req, res) => {
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
};

// Atualizar um usuário
exports.updateUsuario = async (req, res) => {
  const usuarioID = req.params.id;
  const { nome, email, senha } = req.body;

  try {
    let senhaFinal = senha;
    if (senha) {
      senhaFinal = await bcrypt.hash(senha, saltRounds);
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
};

// Deletar um usuário
exports.deleteUsuario = (req, res) => {
  const usuarioID = req.params.id;

  db.run('DELETE FROM usuarios WHERE id = ?', [usuarioID], function (err) {
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


// Exemplo para o método de login
exports.loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  // Validação básica dos campos
  if (!email || !senha) {
    return res.status(400).json({ 
      success: false, 
      message: "E-mail e senha são obrigatórios" 
    });
  }

  try {
    // 1. Busca o usuário no banco
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
      if (err) {
        console.error('Erro no banco de dados:', err);
        return res.status(500).json({ 
          success: false, 
          message: "Erro interno no servidor" 
        });
      }

      // 2. Verifica se o usuário existe
      if (!usuario) {
        return res.status(401).json({ 
          success: false, 
          message: "E-mail ou senha incorretos" 
        });
      }

      // 3. Compara a senha com bcrypt
      try {
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
          return res.status(401).json({ 
            success: false, 
            message: "E-mail ou senha incorretos" 
          });
        }

        // 4. Retorna os dados do usuário (sem a senha)
        const { senha: _, ...usuarioSemSenha } = usuario;
        res.status(200).json({ 
          success: true, 
          usuario: usuarioSemSenha 
        });

      } catch (bcryptError) {
        console.error('Erro ao comparar senhas:', bcryptError);
        res.status(500).json({ 
          success: false, 
          message: "Erro durante a autenticação" 
        });
      }
    });

  } catch (error) {
    console.error('Erro geral no login:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erro interno no servidor" 
    });
  }
};