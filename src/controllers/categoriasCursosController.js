const db = require('../config/db');

// 1. Buscar Categorias Associadas a um Curso
exports.buscarCategoriasAssociadas = (req, res) => {
    const id_curso = req.params.id;

    db.all(
        `SELECT categorias.id_categorias AS id_categoria, categorias.nome
         FROM categoriasCursos
         INNER JOIN categorias ON categoriasCursos.id_categoria = categorias.id_categorias
         WHERE categoriasCursos.id_curso = ?`,
        [id_curso],
        (err, rows) => {
            if (err) {
                console.error('Erro ao buscar categorias associadas:', err);
                res.status(500).send('Erro ao buscar categorias associadas.');
            } else {
                res.json(rows); // Retorna as categorias associadas como JSON
            }
        }
    );
};


// 2. Adicionar Categoria a um Curso
exports.adicionarCategoriaSecundaria = (req, res) => {
    const { id_curso, id_categoria } = req.body;

    if (!id_curso || !id_categoria) {
        res.status(400).send('Curso ou categoria inválidos.');
        return;
    }

    db.run(
        'INSERT INTO categoriasCursos (id_curso, id_categoria) VALUES (?, ?)',
        [id_curso, id_categoria],
        function (err) {
            if (err) {
                console.error('Erro ao adicionar categoria secundária:', err);
                res.status(500).send('Erro ao adicionar categoria secundária.');
            } else {
                res.send('Categoria secundária adicionada com sucesso!');
            }
        }
    );
};

// 3. Remover Categoria de um Curso
exports.removerCategoriaSecundaria = (req, res) => {
    const { id_curso, id_categoria } = req.params;

    if (!id_curso || !id_categoria) {
        res.status(400).send('Curso ou categoria inválidos.');
        return;
    }

    db.run(
        'DELETE FROM categoriasCursos WHERE id_curso = ? AND id_categoria = ?',
        [id_curso, id_categoria],
        function (err) {
            if (err) {
                console.error('Erro ao remover categoria secundária:', err);
                res.status(500).send('Erro ao remover categoria secundária.');
            } else {
                res.send('Categoria secundária removida com sucesso!');
            }
        }
    );
};
