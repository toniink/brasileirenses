const express = require('express');
const router = express.Router();
const playlistCursosController = require('../controllers/playlistCursosController');

// Rota para listar todos os cursos dentro das playlists
router.get('/', playlistCursosController.buscarTodosCursosNaPlaylist);

// Rota para adicionar curso à playlist
router.post('/', playlistCursosController.adicionarCursoNaPlaylist);

// Rota para buscar cursos de uma playlist específica
router.get('/:id', playlistCursosController.buscarCursosPorPlaylist);

// Rota para remover curso da playlist
router.delete('/', playlistCursosController.removerCursoDaPlaylist);

module.exports = router;