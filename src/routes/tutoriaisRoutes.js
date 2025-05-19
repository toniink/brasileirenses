const express = require('express');
const router = express.Router();
const tutoriaisController = require('../controllers/tutoriaisController');
const tutorialContentController = require('../controllers/tutorialContentController');

// Adicionar nova rota para tutoriais com conteúdo
// Adicionar estas novas rotas no arquivo de routes
router.delete('/safe/:id', tutoriaisController.deleteTutorialSafe);
router.get('/com-conteudo', tutoriaisController.listTutoriaisComConteudo);
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

router.get('/com-conteudo', tutorialContentController.listTutoriaisComConteudo);
router.delete('/:id/conteudo', tutorialContentController.deleteOnlyContent);
router.get('/:id/tem-conteudo', tutorialContentController.verificarConteudo);

// Rotas específicas de conteúdo
router.get('/:id/secoes/:id_secao/conteudo', tutoriaisController.getSectionContent);
router.post('/:id/secoes/:id_secao/conteudo', tutoriaisController.addContent);
router.delete('/:id/conteudo/:tipo/:id', tutoriaisController.deleteContent);
// Adicione esta linha junto com as outras rotas de conteúdo
router.put('/:id/secoes/:id_secao/conteudo/:tipo/:id_conteudo', tutoriaisController.updateContent);
// No seu arquivo de rotas (tutoriaisRoutes.js)

router.get('/software/:id', tutoriaisController.buscarTutorialPorSoftware);

router.post('/:id/secoes/:id_secao/lista', tutoriaisController.adicionarLista);

module.exports = router;