const express = require('express');
const router = express.Router();
const categoriasCursosController = require('../controllers/categoriasCursosController');

// Rota para buscar categorias associadas a um curso
router.get('/:id', categoriasCursosController.buscarCategoriasAssociadas);

// Rota para adicionar categoria secundária
router.post('/', categoriasCursosController.adicionarCategoriaSecundaria);

// Rota para remover uma categoria específica de um curso
router.delete('/:id_curso/:id_categoria', categoriasCursosController.removerCategoriaSecundaria);

module.exports = router;
