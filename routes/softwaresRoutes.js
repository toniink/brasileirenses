const express = require('express');
const router = express.Router();
const softwaresController = require('../controllers/softwaresController');

// Rota para listar todos os softwares
router.get('/', softwaresController.buscarTodosSoftwares);

// Rota para criar novo software
router.post('/', softwaresController.criarSoftware);

// Rota para buscar software por ID
router.get('/:id', softwaresController.buscarSoftwarePorId);

// Rota para atualizar software
router.put('/:id', softwaresController.atualizarSoftware);

// Rota para deletar software
router.delete('/:id', softwaresController.excluirSoftware);

module.exports = router;
