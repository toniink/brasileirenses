const express = require('express');
const router = express.Router();
const softwaresController = require('../controllers/softwaresController');

// Rota para listar todos os softwares com a categoria associada
router.get('/', softwaresController.buscarTodosSoftwares);

// Rota para criar novo software
router.post('/', softwaresController.criarSoftware);

// Rota para buscar software por ID e trazer a categoria associada
router.get('/:id', softwaresController.buscarSoftwarePorId);

// Rota para atualizar software
router.put('/:id', softwaresController.atualizarSoftware);

// Rota para deletar software
router.delete('/:id', softwaresController.excluirSoftware);

module.exports = router;