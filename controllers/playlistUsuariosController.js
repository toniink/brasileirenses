const db = require('../config/db');

// Listar todas as playlists do usuário
exports.buscarTodasPlaylists = (req, res) => {
    db.all(
        `SELECT 
            playlistUsuarios.id_playlist,
            playlistUsuarios.nome_playlist,
            usuarios.nome AS nome_usuario,
            playlistUsuarios.data_criacao
        FROM playlistUsuarios
        LEFT JOIN usuarios ON playlistUsuarios.id_usuario = usuarios.idUsuarios`, // Correção aplicada
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar playlists:', err);
                res.status(500).send('Erro interno no servidor');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Criar uma nova playlist
exports.criarPlaylist = (req, res) => {
    const { id_usuario, nome_playlist } = req.body;

    db.run(
        'INSERT INTO playlistUsuarios (id_usuario, nome_playlist) VALUES (?, ?)',
        [id_usuario, nome_playlist],
        function (err) {
            if (err) {
                console.error('Erro ao criar playlist:', err);
                res.status(500).send('Erro ao criar playlist');
            } else {
                res.status(201).json({ id_playlist: this.lastID });
            }
        }
    );
};

// Buscar playlist por ID
exports.buscarPlaylistPorId = (req, res) => {
    const playlistID = req.params.id;

    db.get(
        `SELECT 
            playlistUsuarios.id_playlist,
            playlistUsuarios.nome_playlist,
            usuarios.nome AS nome_usuario,
            playlistUsuarios.data_criacao
        FROM playlistUsuarios
        LEFT JOIN usuarios ON playlistUsuarios.id_usuario = usuarios.idUsuarios
        WHERE playlistUsuarios.id_playlist = ?`, // Correção aplicada
        [playlistID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar playlist:', err);
                res.status(500).send('Erro no servidor');
            } else if (!linha) {
                res.status(404).send('Playlist não encontrada');
            } else {
                res.json(linha);
            }
        }
    );
};

// Atualizar nome da playlist
exports.atualizarPlaylist = (req, res) => {
    const playlistID = req.params.id;
    const { nome_playlist } = req.body;

    db.run(
        'UPDATE playlistUsuarios SET nome_playlist = ? WHERE id_playlist = ?',
        [nome_playlist, playlistID],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar playlist:', err);
                res.status(500).send('Erro interno no servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Playlist não encontrada');
            } else {
                res.send('Playlist atualizada com sucesso!');
            }
        }
    );
};

// Deletar playlist
exports.excluirPlaylist = (req, res) => {
    const playlistID = req.params.id;

    db.run('DELETE FROM playlistUsuarios WHERE id_playlist = ?', [playlistID], function (err) {
        if (err) {
            console.error('Erro ao deletar playlist:', err);
            res.status(500).send('Erro interno no servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Playlist não encontrada');
        } else {
            res.send('Playlist deletada com sucesso!');
        }
    });
};