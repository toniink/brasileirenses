const db = require('../config/db'); // Conexão com o banco de dados

// 1. Listar todos os sites
exports.buscarTodos = (req, res) => {
    const query = `
        SELECT sites.id_site, sites.nome, sites.descricao, sites.url, categorias.nome AS categoria
        FROM sites
        LEFT JOIN categorias ON sites.id_categoria = categorias.id_categorias
    `;

    db.all(query, [], (err, itens) => {
        if (err) {
            console.error('Erro ao buscar sites:', err);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.json(itens);
        }
    });
};

// 2. Buscar um site por ID
exports.buscarPorId = (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT sites.id_site, sites.nome, sites.descricao, sites.url, categorias.nome AS categoria
        FROM sites
        LEFT JOIN categorias ON sites.id_categoria = categorias.id_categorias
        WHERE sites.id_site = ?
    `;

    db.get(query, [id], (err, site) => {
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

// 3. Criar um novo site
exports.criarSite = (req, res) => {
    const { id_categoria, nome, url, descricao } = req.body;

    // Validação básica
    if (!id_categoria || !nome || !url || !descricao) {
        return res.status(400).send('Todos os campos (id_categoria, nome, url, descricao) são obrigatórios.');
    }

    const query = `
        INSERT INTO sites (id_categoria, nome, url, descricao)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [id_categoria, nome, url, descricao], function (err) {
        if (err) {
            console.error('Erro ao criar site:', err);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.status(201).json({ id: this.lastID, id_categoria, nome, url, descricao });
        }
    });
};

// 4. Atualizar um site existente
exports.atualizarSite = (req, res) => {
    const id = req.params.id;
    const { id_categoria, nome, url, descricao } = req.body;

    // Validação básica
    if (!id_categoria || !nome || !url || !descricao) {
        return res.status(400).send('Todos os campos (id_categoria, nome, url, descricao) são obrigatórios.');
    }

    const query = `
        UPDATE sites
        SET id_categoria = ?, nome = ?, url = ?, descricao = ?
        WHERE id_site = ?
    `;

    db.run(query, [id_categoria, nome, url, descricao, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar site:', err);
            res.status(500).send('Erro interno do servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Site não encontrado');
        } else {
            res.send('Site atualizado com sucesso!');
        }
    });
};

// 5. Excluir um site
exports.excluirSite = (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM sites WHERE id_site = ?';

    db.run(query, [id], function (err) {
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
