const express = require('express');
const router = express.Router();
const controller = require('../controllers/sitesController');

router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criarSite);
router.put('/:id', controller.atualizarSite);
router.delete('/:id', controller.excluirSite);

module.exports = router;
