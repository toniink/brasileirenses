const express = require('express');
const router = express.Router();
const softwaresController = require('../controllers/softwaresController');

// Rota para listar todos os softwares com a categoria associada
router.get('/', softwaresController.buscarTodosSoftwares);

// Rota para criar novo software
router.post('/', softwaresController.criarSoftware);

// Rota para buscar software por ID e trazer a categoria associada
router.get('/:id', softwaresController.buscarSoftwarePorId);

// Rota para atualizar software
router.put('/:id', softwaresController.atualizarSoftware);

// Rota para deletar software
router.delete('/:id', softwaresController.excluirSoftware);

//  Rotas para gerenciar seções de software
router.get("/softwares/:id_software/secoesSoftware", softwaresController.getSoftwareSections);
router.post("/softwares/secoesSoftware", softwaresController.createSoftwareSection);

//  Rotas para gerenciar conteúdos dentro das seções
router.get("/secoes/:id_secao/conteudo", softwaresController.getSectionContent);
router.post("/secoes/titulo", softwaresController.createTitle);
router.post("/secoes/area_atuacao", softwaresController.createAreaAtuacao);
router.post("/secoes/paragrafo", softwaresController.createParagrafo);
router.post("/secoes/lista", softwaresController.createListaItem);
router.get("/secoes/:id/conteudo", softwaresController.buscarConteudoPorSecaoSoftware);
router.post("/secoes/conteudo", softwaresController.criarConteudoSoftware);
router.delete("/secoes/conteudo/:id/:tipo", softwaresController.excluirConteudoSoftware);




module.exports = router;