const express = require('express');
const router = express.Router();
const tutoriaisController = require('../controllers/tutoriaisController');

// Rota para listar todos os tutoriais com o software associado
router.get('/', tutoriaisController.buscarTodosTutoriais);

// Rota para criar novo tutorial
router.post('/', tutoriaisController.criarTutorial);

// Rota para buscar tutorial por ID e trazer o software associado
router.get('/:id', tutoriaisController.buscarTutorialPorId);

// Rota para atualizar tutorial
router.put('/:id', tutoriaisController.atualizarTutorial);

// Rota para deletar tutorial
router.delete('/:id', tutoriaisController.excluirTutorial);

module.exports = router;