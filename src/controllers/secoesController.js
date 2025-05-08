const db = require('../config/db');

// 🔹 Buscar seções de um tutorial específico
exports.buscarSecoesPorTutorial = (req, res) => {
    const tutorialID = req.params.id;

    db.all(
        `SELECT * FROM secoes_tutorial WHERE id_tutorial = ? ORDER BY ordem ASC`,
        [tutorialID],
        (err, linhas) => {
            if (err) {
                console.error('Erro ao buscar seções:', err);
                res.status(500).json({ erro: "Erro interno no servidor" });
            } else if (!linhas.length) {
                res.status(404).json({ erro: "Nenhuma seção encontrada para este tutorial." });
            } else {
                res.json(linhas);
            }
        }
    );
};

// 🔹 Criar uma nova seção
exports.criarSecao = (req, res) => {
    const { id_tutorial, tipo, ordem } = req.body;

    db.run(
        `INSERT INTO secoes_tutorial (id_tutorial, tipo, ordem) VALUES (?, ?, ?)`,
        [id_tutorial, tipo, ordem],
        function (err) {
            if (err) {
                console.error('Erro ao criar seção:', err);
                res.status(500).json({ erro: "Erro interno ao criar seção." });
            } else {
                res.status(201).json({ id_secao: this.lastID });
            }
        }
    );
};

// 🔹 Excluir uma seção
exports.excluirSecao = (req, res) => {
    const secaoID = req.params.id;

    db.run(`DELETE FROM secoes_tutorial WHERE id_secao = ?`, [secaoID], function (err) {
        if (err) {
            console.error('Erro ao deletar seção:', err);
            res.status(500).json({ erro: "Erro interno ao excluir seção." });
        } else if (this.changes === 0) {
            res.status(404).json({ erro: "Seção não encontrada." });
        } else {
            res.json({ mensagem: "Seção deletada com sucesso!" });
        }
    });
};
