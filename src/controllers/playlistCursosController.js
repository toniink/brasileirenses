const db = require('../config/db');

// Listar todos os cursos dentro das playlists
exports.buscarTodosCursosNaPlaylist = (req, res) => {
    db.all(
        `SELECT 
            playlistCursos.id_playlist,
            playlistUsuarios.nome_playlist,
            cursos.nome_curso,
            playlistCursos.data_adicao
        FROM playlistCursos
        LEFT JOIN playlistUsuarios ON playlistCursos.id_playlist = playlistUsuarios.id_playlist
        LEFT JOIN cursos ON playlistCursos.id_curso = cursos.id_cursos`,
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar cursos na playlist:', err);
                res.status(500).send('Erro interno no servidor');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Adicionar curso à playlist
exports.adicionarCursoNaPlaylist = (req, res) => {
    const { id_playlist, id_curso } = req.body;

    db.run(
        'INSERT INTO playlistCursos (id_playlist, id_curso) VALUES (?, ?)',
        [id_playlist, id_curso],
        function (err) {
            if (err) {
                console.error('Erro ao adicionar curso na playlist:', err);
                res.status(500).send('Erro ao adicionar curso');
            } else {
                res.status(201).json({ mensagem: 'Curso adicionado à playlist com sucesso!' });
            }
        }
    );
};

// Buscar cursos de uma playlist específica por ID da playlist
exports.buscarCursosPorPlaylist = (req, res) => {
    const playlistID = req.params.id;

    db.all(
        `SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            playlistCursos.data_adicao
        FROM playlistCursos
        LEFT JOIN cursos ON playlistCursos.id_curso = cursos.id_cursos
        WHERE playlistCursos.id_playlist = ?`,
        [playlistID],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar cursos da playlist:', err);
                res.status(500).send('Erro interno no servidor');
            } else if (resultados.length === 0) {
                res.status(404).send('Nenhum curso encontrado para essa playlist');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Remover curso da playlist
exports.removerCursoDaPlaylist = (req, res) => {
    const { id_playlist, id_curso } = req.body;

    db.run(
        'DELETE FROM playlistCursos WHERE id_playlist = ? AND id_curso = ?',
        [id_playlist, id_curso],
        function (err) {
            if (err) {
                console.error('Erro ao remover curso da playlist:', err);
                res.status(500).send('Erro interno no servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Curso não encontrado na playlist');
            } else {
                res.send('Curso removido da playlist com sucesso!');
            }
        }
    );
};