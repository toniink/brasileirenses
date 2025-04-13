const db = require('../config/db');

// Listar todos os cursos
exports.buscarTodosCursos = (req, res) => {
    db.all('SELECT * FROM cursos', [], (err, resultados) => {
        if (err) {
            console.error('Erro ao buscar cursos:', err);
            res.status(500).send('Erro interno');
        } else {
            res.json(resultados);
        }
    });
};

// Criar novo curso
exports.criarCurso = (req, res) => {
    const { nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site } = req.body;

    db.run(
        'INSERT INTO cursos (nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site],
        function (err) {
            if (err) {
                console.error('Erro ao inserir curso:', err);
                res.status(500).send('Erro interno');
            } else {
                res.status(201).json({ id: this.lastID, nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site });
            }
        }
    );
};

// Buscar curso por ID
exports.buscarCursoPorId = (req, res) => {
    const cursoID = req.params.id;

    db.get('SELECT * FROM cursos WHERE id_cursos = ?', [cursoID], (err, linha) => {
        if (err) {
            res.status(500).send('Erro no servidor');
        } else if (!linha) {
            res.status(404).send('Curso não encontrado');
        } else {
            res.json(linha);
        }
    });
};

// Atualizar curso
exports.atualizarCurso = (req, res) => {
    const cursoID = req.params.id;
    const { nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site } = req.body;

    db.run(
        'UPDATE cursos SET nome_curso = ?, descricao = ?, duracao = ?, url = ?, formato = ?, nivel_dificuldade = ?, id_categoria = ?, id_site = ? WHERE id_cursos = ?',
        [nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site, cursoID],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar curso:', err);
                res.status(500).send('Erro interno');
            } else if (this.changes === 0) {
                res.status(404).send('Curso não encontrado');
            } else {
                res.send('Curso atualizado com sucesso!');
            }
        }
    );
};

// Deletar curso
exports.excluirCurso = (req, res) => {
    const cursoID = req.params.id;

    db.run('DELETE FROM cursos WHERE id_cursos = ?', [cursoID], function (err) {
        if (err) {
            console.error('Erro ao deletar curso:', err);
            res.status(500).send('Erro interno no servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Curso não encontrado');
        } else {
            res.send('Curso deletado com sucesso');
        }
    });
};
