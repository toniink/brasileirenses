const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rota para login de admin
router.post('/login', adminController.loginAdmin);

module.exports = router;
