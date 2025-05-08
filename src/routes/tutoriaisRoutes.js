const express = require('express');
const router = express.Router();
const tutoriaisController = require('../controllers/tutoriaisController');

// Rota para listar todos os tutoriais
router.get('/', tutoriaisController.buscarTodosTutoriais);

// Rota para criar novo tutorial
router.post('/', tutoriaisController.criarTutorial);

// Rota para buscar tutorial por ID
router.get('/:id', tutoriaisController.buscarTutorialPorId);

// Rota para atualizar tutorial
router.put('/:id', tutoriaisController.atualizarTutorial);

// Rota para deletar tutorial
router.delete('/:id', tutoriaisController.excluirTutorial);

//associar tutorial a software
router.post('/associar', tutoriaisController.associarTutorialSoftware);

router.get('/software/:id', tutoriaisController.buscarTutorialPorSoftware);

module.exports = router;
