const express = require('express');
const router = express.Router();
const playlistUsuariosController = require('../controllers/playlistUsuariosController');

// Rota para listar todas as playlists do usuário
router.get('/', playlistUsuariosController.buscarTodasPlaylists);

// Rota para criar nova playlist
router.post('/', playlistUsuariosController.criarPlaylist);

// Rota para buscar playlist por ID
router.get('/:id', playlistUsuariosController.buscarPlaylistPorId);

// Rota para atualizar nome da playlist
router.put('/:id', playlistUsuariosController.atualizarPlaylist);

// Rota para deletar playlist
router.delete('/:id', playlistUsuariosController.excluirPlaylist);

module.exports = router;