const db = require('../config/db');

// Listar todas as categorias
exports.buscarTodos = (req, res) => {
    db.all('SELECT * FROM categorias', [], (err, categorias) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.json(categorias);
        }
    });
};


// Buscar uma categoria por ID
exports.buscarPorId = (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM categorias WHERE id_categorias = ?', [id], (err, categoria) => {
        if (err) {
            console.error('Erro ao buscar categoria por ID:', err);
            res.status(500).send('Erro interno do servidor');
        } else if (!categoria) {
            res.status(404).send('Categoria não encontrada');
        } else {
            res.json(categoria);
        }
    });
};

// Criar nova categoria
exports.criarCategoria = (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome) {
        res.status(400).send('O campo "nome" é obrigatório');
        return;
    }

    db.run(
        'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
        [nome, descricao],
        function (err) {
            if (err) {
                console.error('Erro ao criar categoria:', err);
                res.status(500).send('Erro interno do servidor');
            } else {
                res.status(201).json({ id: this.lastID, nome, descricao });
            }
        }
    );
};

// Atualizar uma categoria existente
exports.atualizarCategoria = (req, res) => {
    const id = req.params.id;
    const { nome, descricao } = req.body;

    if (!nome) {
        res.status(400).send('O campo "nome" é obrigatório');
        return;
    }

    db.run(
        'UPDATE categorias SET nome = ?, descricao = ? WHERE id_categorias = ?',
        [nome, descricao, id],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar categoria:', err);
                res.status(500).send('Erro interno do servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Categoria não encontrada');
            } else {
                res.send('Categoria atualizada com sucesso!');
            }
        }
    );
};

// Excluir uma categoria
exports.excluirCategoria = (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM categorias WHERE id_categorias = ?', [id], function (err) {
        if (err) {
            console.error('Erro ao excluir categoria:', err);
            res.status(500).send('Erro interno do servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Categoria não encontrada');
        } else {
            res.send('Categoria excluída com sucesso!');
        }
    });
};
