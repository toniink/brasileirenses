const express = require('express');
const router = express.Router();
const tutoriaisController = require('../controllers/tutoriaisController');

// Todas essas rotas são prefixadas com /tutoriais/:id/secoes/
router.get('/', tutoriaisController.getSections);
router.post('/', tutoriaisController.createSection);
router.delete('/:id_secao', tutoriaisController.deleteSection);

// Rotas de conteúdo dentro das seções
router.get('/:id_secao/conteudo', (req, res) => {
  // Implementação para pegar conteúdo específico
});
router.post('/:id_secao/conteudo', tutoriaisController.addContent);
router.delete('/conteudo/:tipo/:id', tutoriaisController.deleteContent);

module.exports = router;