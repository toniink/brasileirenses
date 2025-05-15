const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');

// Rota para listar todos os usuários
router.get('/', usuariosController.getAllUsuarios);

// Rota para criar novo usuário
router.post('/', usuariosController.createUsuario);

// Rota para buscar um usuário por ID
router.get('/:id', usuariosController.getUsuarioById);

// Rota para atualizar um usuário
router.put('/:id', usuariosController.updateUsuario);

// Rota para deletar um usuário
router.delete('/:id', usuariosController.deleteUsuario);

router.post('/login', usuariosController.loginUsuario);

module.exports = router;
