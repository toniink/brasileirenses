const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriasController');

// Rota para listar todas as categorias
router.get('/', controller.buscarTodos);

// Rota para buscar uma categoria pelo ID
router.get('/:id', controller.buscarPorId);

// Rota para criar uma nova categoria
router.post('/', controller.criarCategoria);

// Rota para atualizar uma categoria pelo ID
router.put('/:id', controller.atualizarCategoria);

// Rota para excluir uma categoria pelo ID
router.delete('/:id', controller.excluirCategoria);

module.exports = router;
