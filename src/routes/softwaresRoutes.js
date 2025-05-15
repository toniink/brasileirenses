// src/api/routes/softwaresRoutes.js
const express = require('express');
const router = express.Router();
const SoftwareController = require('../controllers/softwareController');

// 🚀 Rotas CRUD básicas
router.get('/', SoftwareController.listAll);
router.post('/', SoftwareController.create);
router.get('/:id', SoftwareController.getById);
router.put('/:id', SoftwareController.update);
router.delete('/softwares/:id', SoftwareController.delete);

// 🎨 Rotas para o CMS
router.get('/:id/content', SoftwareController.getContentBySoftware);
router.post('/:id/sections', SoftwareController.createSection);
router.post('/conteudo', SoftwareController.addContent);
router.get('/:id/sections', SoftwareController.getSections);
router.delete('/content/:type/:id', SoftwareController.deleteContent);

module.exports = router;