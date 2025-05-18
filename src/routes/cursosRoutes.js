const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const cursosContentController = require('../controllers/cursosContentController');

// Rotas de conteúdo (colocar primeiro)
router.get('/com-conteudo', cursosContentController.listCursosComConteudo);
router.get('/:id/tem-conteudo', cursosContentController.verificarConteudo);
router.delete('/:id/conteudo', cursosContentController.deleteOnlyContent);
router.put('/:id/content', cursosContentController.updateCourseContent);

// Rotas CRUD básicas
router.get('/', cursosController.buscarTodosCursos);
router.post('/', cursosController.criarCurso);
router.get('/:id', cursosController.buscarCursoPorId);
router.put('/:id', cursosController.atualizarCurso);
router.delete('/:id', cursosController.excluirCurso);

// Rotas para categorias secundárias
router.post('/:id/categorias', cursosController.adicionarCategoriasSecundarias);

// Rotas para o CMS
router.get('/:id/content', cursosController.getContentByCurso);
router.post('/conteudo/:tipo', cursosController.addContent);
router.post('/:id/sections', cursosController.createSection);

router.get('/:id/sections', cursosController.getSections);
router.delete('/content/:tipo/:id', cursosController.deleteContent);

module.exports = router;