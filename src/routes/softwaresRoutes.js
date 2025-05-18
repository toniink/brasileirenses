// src/api/routes/softwaresRoutes.js
const express = require('express');
const router = express.Router();
const SoftwareController = require('../controllers/softwareController');
const softwareContentController = require('../controllers/softwareContentController');

// Rotas para conteúdo (colocar antes das rotas com :id)
router.get('/com-conteudo', softwareContentController.listSoftwaresComConteudo);

// 🚀 Rotas CRUD básicas
router.get('/', SoftwareController.listAll);
router.post('/', SoftwareController.create);
router.get('/:id', SoftwareController.getById);
router.put('/:id', SoftwareController.update);
router.delete('/:id', SoftwareController.delete);

// 🎨 Rotas para o CMS
router.get('/:id/content', SoftwareController.getContentBySoftware);
router.post('/:id/sections', SoftwareController.createSection);
router.post('/conteudo', SoftwareController.addContent);
router.get('/:id/sections', SoftwareController.getSections);
router.delete('/content/:type/:id', SoftwareController.deleteContent);
router.delete('/:id/conteudo', softwareContentController.deleteOnlyContent);
router.get('/:id/tem-conteudo', softwareContentController.verificarConteudo);

module.exports = router;