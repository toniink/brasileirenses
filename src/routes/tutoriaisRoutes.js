const express = require('express');
const router = express.Router();
const tutoriaisController = require('../controllers/tutoriaisController');

// Rotas básicas
router.get('/', tutoriaisController.buscarTodosTutoriais);
router.post('/', tutoriaisController.criarTutorial);
router.get('/:id', tutoriaisController.buscarTutorialPorId);
router.put('/:id', tutoriaisController.atualizarTutorial);
router.delete('/:id', tutoriaisController.excluirTutorial);

// Rotas de conteúdo
router.get('/:id/conteudo', tutoriaisController.getContentByTutorial);
router.get('/:id/secoes', tutoriaisController.getSections);
router.post('/:id/secoes', tutoriaisController.createSection);
router.delete('/:id/secoes/:id_secao', tutoriaisController.deleteSection);

// Rotas específicas de conteúdo
router.get('/:id/secoes/:id_secao/conteudo', tutoriaisController.getSectionContent);
router.post('/:id/secoes/:id_secao/conteudo', tutoriaisController.addContent);
router.delete('/:id/conteudo/:tipo/:id', tutoriaisController.deleteContent);
// Adicione esta linha junto com as outras rotas de conteúdo
router.put('/:id/secoes/:id_secao/conteudo/:tipo/:id_conteudo', tutoriaisController.updateContent);

module.exports = router;