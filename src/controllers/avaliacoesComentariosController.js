const db = require('../config/db');

// Listar todas as avaliações e comentários, trazendo nome do usuário e curso associado
exports.buscarTodasAvaliacoes = (req, res) => {
    db.all(
        `SELECT 
            avaliacoesComentarios.id_comentario,
            usuarios.nome AS nome_usuario,
            cursos.nome_curso AS nome_curso,
            avaliacoesComentarios.comentario,
            avaliacoesComentarios.nota,
            avaliacoesComentarios.data_avaliacao
        FROM avaliacoesComentarios
        LEFT JOIN usuarios ON avaliacoesComentarios.id_usuario = usuarios.idUsuarios
        LEFT JOIN cursos ON avaliacoesComentarios.id_curso = cursos.id_cursos`,
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar avaliações:', err);
                res.status(500).send('Erro interno no servidor');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Criar nova avaliação/comentário
exports.criarAvaliacao = (req, res) => {
    const { id_usuario, id_curso, comentario, nota } = req.body;

    db.run(
        'INSERT INTO avaliacoesComentarios (id_usuario, id_curso, comentario, nota) VALUES (?, ?, ?, ?)',
        [id_usuario, id_curso, comentario, nota],
        function (err) {
            if (err) {
                console.error('Erro ao criar avaliação:', err);
                res.status(500).send('Erro ao criar avaliação');
            } else {
                res.status(201).json({ id_comentario: this.lastID });
            }
        }
    );
};

// Buscar avaliação por ID trazendo nome do usuário e curso associado
exports.buscarAvaliacaoPorId = (req, res) => {
    const comentarioID = req.params.id;

    db.get(
        `SELECT 
            avaliacoesComentarios.id_comentario,
            usuarios.nome AS nome_usuario,
            cursos.nome_curso AS nome_curso,
            avaliacoesComentarios.comentario,
            avaliacoesComentarios.nota,
            avaliacoesComentarios.data_avaliacao
        FROM avaliacoesComentarios
        LEFT JOIN usuarios ON avaliacoesComentarios.id_usuario = usuarios.idUsuarios
        LEFT JOIN cursos ON avaliacoesComentarios.id_curso = cursos.id_cursos
        WHERE avaliacoesComentarios.id_comentario = ?`,
        [comentarioID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar avaliação:', err);
                res.status(500).send('Erro no servidor');
            } else if (!linha) {
                res.status(404).send('Avaliação não encontrada');
            } else {
                res.json(linha);
            }
        }
    );
};

// Atualizar uma avaliação/comentário
exports.atualizarAvaliacao = (req, res) => {
    const comentarioID = req.params.id;
    const { comentario, nota } = req.body;

    db.run(
        'UPDATE avaliacoesComentarios SET comentario = ?, nota = ? WHERE id_comentario = ?',
        [comentario, nota, comentarioID],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar avaliação:', err);
                res.status(500).send('Erro interno no servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Avaliação não encontrada');
            } else {
                res.send('Avaliação atualizada com sucesso!');
            }
        }
    );
};

// Deletar avaliação/comentário
exports.excluirAvaliacao = (req, res) => {
    const comentarioID = req.params.id;

    db.run('DELETE FROM avaliacoesComentarios WHERE id_comentario = ?', [comentarioID], function (err) {
        if (err) {
            console.error('Erro ao deletar avaliação:', err);
            res.status(500).send('Erro interno no servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Avaliação não encontrada');
        } else {
            res.send('Avaliação deletada com sucesso!');
        }
    });
};