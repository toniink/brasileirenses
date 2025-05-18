const db = require('../config/db');


// Listar todas as avaliações e comentários, trazendo nome do usuário e curso associado
exports.buscarTodasAvaliacoes = (req, res) => {
    const id_curso = req.query.id_curso; // Novo parâmetro opcional
    
    let query = `
        SELECT 
            ac.*,
            u.nome AS nome_usuario,
            c.nome_curso
        FROM avaliacoesComentarios ac
        LEFT JOIN usuarios u ON ac.id_usuario = u.idUsuarios
        LEFT JOIN cursos c ON ac.id_curso = c.id_cursos
    `;
    
    const params = [];
    
    // Filtro por curso se o parâmetro foi fornecido
    if (id_curso) {
        query += ' WHERE ac.id_curso = ?';
        params.push(id_curso);
    }
    
    query += ' ORDER BY ac.data_avaliacao DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar avaliações:', err);
            return res.status(500).send('Erro no servidor');
        }
        res.json(rows || []);
    });
};

// Método alternativo específico para filtrar por curso (mantendo sua nomenclatura)
exports.buscarAvaliacoesPorCurso = (req, res) => {
    const id_curso = req.query.id_curso;
    
    if (!id_curso) {
        return res.status(400).send('ID do curso é obrigatório');
    }
    
    db.all(
        `SELECT 
            ac.*,
            u.nome AS nome_usuario
        FROM avaliacoesComentarios ac
        LEFT JOIN usuarios u ON ac.id_usuario = u.idUsuarios
        WHERE ac.id_curso = ?
        ORDER BY ac.data_avaliacao DESC`,
        [id_curso],
        (err, rows) => {
            if (err) {
                console.error('Erro ao buscar avaliações:', err);
                return res.status(500).send('Erro no servidor');
            }
            res.json(rows || []);
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


// Criar nova avaliação
exports.criarAvaliacao = (req, res) => {
    const { id_usuario, id_curso, comentario, nota } = req.body;

    db.run(
        `INSERT INTO avaliacoesComentarios 
        (id_usuario, id_curso, comentario, nota) 
        VALUES (?, ?, ?, ?)`,
        [id_usuario, id_curso, comentario, nota],
        function(err) {
            if (err) {
                console.error('Erro ao criar avaliação:', err);
                return res.status(500).send('Erro ao criar avaliação');
            }
            res.send('Avaliação criada com sucesso');
        }
    );
};