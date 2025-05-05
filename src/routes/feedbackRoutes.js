const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Rota para buscar todos os feedbacks
router.get('/', feedbackController.buscarTodosFeedbacks);

// Rota para criar um novo feedback
router.post('/', feedbackController.criarFeedback);

module.exports = router;
