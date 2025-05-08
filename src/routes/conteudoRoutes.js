const express = require('express');
const router = express.Router();
const conteudoController = require('../controllers/conteudoController');

// 🔹 Buscar conteúdo de uma seção
router.get('/:id', conteudoController.buscarConteudoPorSecao);

// 🔹 Criar um novo conteúdo
router.post('/', conteudoController.criarConteudo);

// 🔹 Excluir um conteúdo específico
router.delete('/:tipo/:id', conteudoController.excluirConteudo);

module.exports = router;
