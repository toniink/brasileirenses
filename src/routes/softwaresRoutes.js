// src/routes/softwaresRoutes.js
const express = require('express');
const router = express.Router(); // ✅ Use express.Router() em vez de require('router')
const softwaresController = require('../controllers/softwaresController');

// Rotas CRUD básicas
router.get('/', softwaresController.buscarTodosSoftwares);
router.post('/', softwaresController.criarSoftware);
router.get('/:id', softwaresController.buscarSoftwarePorId);
router.put('/:id', softwaresController.atualizarSoftware);
router.delete('/:id', softwaresController.excluirSoftware);

// Rotas para o CMS
router.get('/:id/conteudoCompleto', softwaresController.buscarConteudoPorSoftware);
router.post('/secoes', softwaresController.criarSecaoSoftware);
router.post('/conteudo', softwaresController.adicionarConteudo);

module.exports = router;