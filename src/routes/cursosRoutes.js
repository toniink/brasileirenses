const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursosController');

// 🚀 Rotas CRUD básicas
router.get('/', cursoController.buscarTodosCursos);
router.post('/', cursoController.criarCurso);
router.get('/:id', cursoController.buscarCursoPorId);
router.put('/:id', cursoController.atualizarCurso);
router.delete('/:id', cursoController.excluirCurso);

// Rotas para categorias secundárias
router.post('/:id/categorias', cursoController.adicionarCategoriasSecundarias);

// 🎨 Rotas para o CMS
router.get('/:id/content', cursoController.getContentByCurso);
router.post('/:id/sections', cursoController.createSection);
router.post('/conteudo/:tipo', cursoController.addContent);
router.get('/:id/sections', cursoController.getSections);
router.delete('/content/:tipo/:id', cursoController.deleteContent);

module.exports = router;