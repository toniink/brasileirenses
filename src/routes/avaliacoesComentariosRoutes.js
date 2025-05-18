const express = require('express');
const router = express.Router();
const avaliacoesComentariosController = require('../controllers/avaliacoesComentariosController');

// Rota para listar todas as avaliações com usuário e curso associados
router.get('/', avaliacoesComentariosController.buscarTodasAvaliacoes);

// Rota para criar nova avaliação/comentário
router.post('/', avaliacoesComentariosController.criarAvaliacao);
// No routes (avaliacoesComentariosRoutes.js)
router.get('/', avaliacoesComentariosController.buscarAvaliacoesPorCurso);
// Rota para buscar avaliação por ID e trazer usuário e curso associados
router.get('/:id', avaliacoesComentariosController.buscarAvaliacaoPorId);

// Rota para atualizar uma avaliação/comentário
router.put('/:id', avaliacoesComentariosController.atualizarAvaliacao);

// Rota para deletar avaliação/comentário
router.delete('/:id', avaliacoesComentariosController.excluirAvaliacao);

module.exports = router;