const express = require('express');
const router = express.Router();
const secoesController = require('../controllers/secoesController');

// 🔹 Buscar todas as seções de um tutorial
router.get('/:id', secoesController.buscarSecoesPorTutorial);

// 🔹 Criar uma nova seção
router.post('/', secoesController.criarSecao);

// 🔹 Excluir uma seção
router.delete('/:id', secoesController.excluirSecao);

module.exports = router;
