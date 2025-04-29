const express = require('express');
const router = express.Router();
const denunciasController = require('../controllers/denunciasController');

// Rota para listar todas as denúncias
router.get('/', denunciasController.buscarTodasDenuncias);

// Rota para criar nova denúncia
router.post('/', denunciasController.criarDenuncia);

// Rota para buscar denúncia por ID
router.get('/:id', denunciasController.buscarDenunciaPorId);

// Rota para deletar denúncia
router.delete('/:id', denunciasController.excluirDenuncia);

module.exports = router;