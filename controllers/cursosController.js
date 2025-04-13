const db = require('../config/db');

// Listar todos os cursos
exports.buscarTodosCursos = (req, res) => {
    db.all(
        `SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            cursos.descricao,
            cursos.duracao,
            cursos.url,
            cursos.formato,
            cursos.nivel_dificuldade,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM cursos
        LEFT JOIN categorias ON cursos.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON cursos.id_site = sites.id_site`,
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar cursos:', err);
                res.status(500).send('Erro interno');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Criar novo curso
exports.criarCurso = (req, res) => {
    const { nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site } = req.body;

    console.log('Dados recebidos para inserção:', req.body);

    db.run(
        'INSERT INTO cursos (nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site],
        function (err) {
            if (err) {
                console.error('Erro ao criar curso:', err);
                res.status(500).send('Erro ao criar curso');
            } else {
                res.status(201).json({ id_cursos: this.lastID });
            }
        }
    );
};

// Buscar curso por ID
exports.buscarCursoPorId = (req, res) => {
    const cursoID = req.params.id;

    db.get(
        `SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            cursos.descricao,
            cursos.duracao,
            cursos.url,
            cursos.formato,
            cursos.nivel_dificuldade,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM cursos
        LEFT JOIN categorias ON cursos.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON cursos.id_site = sites.id_site
        WHERE cursos.id_cursos = ?`,
        [cursoID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar curso:', err);
                res.status(500).send('Erro no servidor');
            } else if (!linha) {
                res.status(404).send('Curso não encontrado');
            } else {
                res.json(linha);
            }
        }
    );
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
            res.send('Curso deletado com sucesso!');
        }
    });
};

//adicionar categorias secundarias aos cursos
exports.adicionarCategoriasSecundarias = (req, res) => {
    const { id_curso, categorias } = req.body;

    if (!id_curso || !categorias || categorias.length === 0) {
        res.status(400).send('Curso ou categorias inválidos.');
        return;
    }

    try {
        // Remover categorias secundárias existentes para evitar duplicação
        db.run('DELETE FROM categoriasCursos WHERE id_curso = ?', [id_curso], (err) => {
            if (err) {
                console.error('Erro ao remover categorias antigas:', err);
                res.status(500).send('Erro interno.');
                return;
            }

            // Inserir categorias secundárias novas
            const stmt = db.prepare('INSERT INTO categoriasCursos (id_curso, id_categoria) VALUES (?, ?)');

            categorias.forEach((id_categoria) => {
                stmt.run(id_curso, id_categoria, (err) => {
                    if (err) console.error('Erro ao inserir categoria secundária:', err);
                });
            });

            stmt.finalize(() => {
                res.send('Categorias secundárias adicionadas com sucesso!');
            });
        });
    } catch (error) {
        console.error('Erro ao adicionar categorias secundárias:', error);
        res.status(500).send('Erro interno.');
    }
};
