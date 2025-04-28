const db = require('../config/db');

// Listar todos os softwares
exports.buscarTodosSoftwares = (req, res) => {
    db.all(
        `SELECT 
            softwares.id_softwares,
            softwares.nome,
            softwares.url,
            softwares.desenvolvedor,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM softwares
        LEFT JOIN categorias ON softwares.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON softwares.id_site = sites.id_site`,
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar softwares:', err);
                res.status(500).send('Erro interno no servidor');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Criar novo software
exports.criarSoftware = (req, res) => {
    const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;

    db.run(
        'INSERT INTO softwares (nome, url, desenvolvedor, id_categoria, id_site) VALUES (?, ?, ?, ?, ?)',
        [nome, url, desenvolvedor, id_categoria, id_site],
        function (err) {
            if (err) {
                console.error('Erro ao criar software:', err);
                res.status(500).send('Erro ao criar software');
            } else {
                res.status(201).json({ id_softwares: this.lastID });
            }
        }
    );
};

// Buscar software por ID
exports.buscarSoftwarePorId = (req, res) => {
    const softwareID = req.params.id;

    db.get(
        `SELECT 
            softwares.id_softwares,
            softwares.nome,
            softwares.url,
            softwares.desenvolvedor,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM softwares
        LEFT JOIN categorias ON softwares.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON softwares.id_site = sites.id_site
        WHERE softwares.id_softwares = ?`,
        [softwareID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar software:', err);
                res.status(500).send('Erro no servidor');
            } else if (!linha) {
                res.status(404).send('Software não encontrado');
            } else {
                res.json(linha);
            }
        }
    );
};

// Atualizar software
exports.atualizarSoftware = (req, res) => {
    const softwareID = req.params.id;
    const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;

    db.run(
        'UPDATE softwares SET nome = ?, url = ?, desenvolvedor = ?, id_categoria = ?, id_site = ? WHERE id_softwares = ?',
        [nome, url, desenvolvedor, id_categoria, id_site, softwareID],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar software:', err);
                res.status(500).send('Erro interno no servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Software não encontrado');
            } else {
                res.send('Software atualizado com sucesso!');
            }
        }
    );
};

// Deletar software
exports.excluirSoftware = (req, res) => {
    const softwareID = req.params.id;

    db.run('DELETE FROM softwares WHERE id_softwares = ?', [softwareID], function (err) {
        if (err) {
            console.error('Erro ao deletar software:', err);
            res.status(500).send('Erro interno no servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Software não encontrado');
        } else {
            res.send('Software deletado com sucesso!');
        }
    });
};
