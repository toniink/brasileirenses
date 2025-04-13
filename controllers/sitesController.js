const db = require('../config/db'); // Conexão com o banco de dados

// Listar todos os sites
exports.buscarTodos = (req, res) => {
    db.all('SELECT * FROM sites', [], (err, itens) => {
        if (err) {
            console.error('Erro ao buscar sites:', err);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.json(itens);
        }
    });
};

// Buscar um site por ID
exports.buscarPorId = (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM sites WHERE id_site = ?', [id], (err, site) => {
        if (err) {
            console.error('Erro ao buscar site por ID:', err);
            res.status(500).send('Erro interno do servidor');
        } else if (!site) {
            res.status(404).send('Site não encontrado');
        } else {
            res.json(site);
        }
    });
};

// Criar um novo site
exports.criarSite = (req, res) => {
    const { id_categoria, nome, url, descricao } = req.body;

    if (!nome) {
        res.status(400).send('O campo "nome" é obrigatório');
        return;
    }

    db.run(
        'INSERT INTO sites (id_categoria, nome, url, descricao) VALUES (?, ?, ?, ?)',
        [id_categoria, nome, url, descricao],
        function (err) {
            if (err) {
                console.error('Erro ao criar site:', err);
                res.status(500).send('Erro interno do servidor');
            } else {
                res.status(201).json({ id: this.lastID, id_categoria, nome, url, descricao });
            }
        }
    );
};

// Atualizar um site existente
exports.atualizarSite = (req, res) => {
    const id = req.params.id;
    const { id_categoria, nome, url, descricao } = req.body;

    if (!nome) {
        res.status(400).send('O campo "nome" é obrigatório');
        return;
    }

    db.run(
        'UPDATE sites SET id_categoria = ?, nome = ?, url = ?, descricao = ? WHERE id_site = ?',
        [id_categoria, nome, url, descricao, id],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar site:', err);
                res.status(500).send('Erro interno do servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Site não encontrado');
            } else {
                res.send('Site atualizado com sucesso!');
            }
        }
    );
};

// Excluir um site
exports.excluirSite = (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM sites WHERE id_site = ?', [id], function (err) {
        if (err) {
            console.error('Erro ao excluir site:', err);
            res.status(500).send('Erro interno do servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Site não encontrado');
        } else {
            res.send('Site excluído com sucesso!');
        }
    });
};
