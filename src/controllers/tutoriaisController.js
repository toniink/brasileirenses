const db = require('../config/db');

// Listar todos os tutoriais e trazer o nome do software associado
exports.buscarTodosTutoriais = (req, res) => {
    db.all(
        `SELECT 
            tutoriais.id_tutorial,
            tutoriais.titulo,
            tutoriais.descricao,
            tutoriais.imagem_url,
            softwares.nome AS nome_software
        FROM tutoriais
        LEFT JOIN softwares ON tutoriais.id_software = softwares.id_softwares`,
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar tutoriais:', err);
                res.status(500).send('Erro interno no servidor');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Criar novo tutorial
exports.criarTutorial = (req, res) => {
    const { id_software, titulo, descricao, imagem_url } = req.body;

    db.run(
        'INSERT INTO tutoriais (id_software, titulo, descricao, imagem_url) VALUES (?, ?, ?, ?)',
        [id_software, titulo, descricao, imagem_url],
        function (err) {
            if (err) {
                console.error('Erro ao criar tutorial:', err);
                res.status(500).send('Erro ao criar tutorial');
            } else {
                res.status(201).json({ id_tutorial: this.lastID });
            }
        }
    );
};

// Buscar tutorial por ID e trazer o nome do software associado
exports.buscarTutorialPorId = (req, res) => {
    const tutorialID = req.params.id;

    db.get(
        `SELECT 
            tutoriais.id_tutorial,
            tutoriais.titulo,
            tutoriais.descricao,
            tutoriais.imagem_url,
            softwares.nome AS nome_software
        FROM tutoriais
        LEFT JOIN softwares ON tutoriais.id_software = softwares.id_softwares
        WHERE tutoriais.id_tutorial = ?`,
        [tutorialID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar tutorial:', err);
                res.status(500).send('Erro no servidor');
            } else if (!linha) {
                res.status(404).send('Tutorial não encontrado');
            } else {
                res.json(linha);
            }
        }
    );
};

// Atualizar tutorial
exports.atualizarTutorial = (req, res) => {
    const tutorialID = req.params.id;
    const { id_software, titulo, descricao, imagem_url } = req.body;

    db.run(
        'UPDATE tutoriais SET id_software = ?, titulo = ?, descricao = ?, imagem_url = ? WHERE id_tutorial = ?',
        [id_software, titulo, descricao, imagem_url, tutorialID],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar tutorial:', err);
                res.status(500).send('Erro interno no servidor');
            } else if (this.changes === 0) {
                res.status(404).send('Tutorial não encontrado');
            } else {
                res.send('Tutorial atualizado com sucesso!');
            }
        }
    );
};

// Deletar tutorial
exports.excluirTutorial = (req, res) => {
    const tutorialID = req.params.id;

    db.run('DELETE FROM tutoriais WHERE id_tutorial = ?', [tutorialID], function (err) {
        if (err) {
            console.error('Erro ao deletar tutorial:', err);
            res.status(500).send('Erro interno no servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Tutorial não encontrado');
        } else {
            res.send('Tutorial deletado com sucesso!');
        }
    });
};