const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');

// Rota para listar todos os cursos
router.get('/', cursosController.buscarTodosCursos);

// Rota para criar novo curso
router.post('/', cursosController.criarCurso);

// Rota para buscar curso por ID
router.get('/:id', cursosController.buscarCursoPorId);

// Rota para atualizar curso
router.put('/:id', cursosController.atualizarCurso);

// Rota para deletar curso
router.delete('/:id', cursosController.excluirCurso);

module.exports = router;
