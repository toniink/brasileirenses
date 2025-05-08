const db = require('../config/db');

// 🔹 Buscar todo o conteúdo de uma seção
exports.buscarConteudoPorSecao = (req, res) => {
    const secaoID = req.params.id;

    db.all(
        `SELECT 
            'paragrafo' AS tipo, texto 
            FROM conteudo_paragrafo WHERE id_secao = ?
        UNION ALL
        SELECT 
            'titulo' AS tipo, texto 
            FROM conteudo_titulo WHERE id_secao = ?
        UNION ALL
        SELECT 
            'lista' AS tipo, item 
            FROM conteudo_lista WHERE id_secao = ?
        UNION ALL
        SELECT 
            'imagem' AS tipo, url || '|' || descricao 
            FROM conteudo_imagem WHERE id_secao = ?`,
        [secaoID, secaoID, secaoID, secaoID],
        (err, linhas) => {
            if (err) {
                console.error('Erro ao buscar conteúdo:', err);
                res.status(500).json({ erro: "Erro interno no servidor." });
            } else if (!linhas.length) {
                res.status(404).json({ erro: "Nenhum conteúdo encontrado para esta seção." });
            } else {
                res.json(linhas);
            }
        }
    );
};

// 🔹 Criar um novo conteúdo dentro da seção
exports.criarConteudo = (req, res) => {
    const { id_secao, tipo, texto, url, descricao } = req.body;

    let query = "";
    let valores = [];

    switch (tipo) {
        case "paragrafo":
            query = `INSERT INTO conteudo_paragrafo (id_secao, texto) VALUES (?, ?)`;
            valores = [id_secao, texto];
            break;
        case "titulo":
            query = `INSERT INTO conteudo_titulo (id_secao, texto) VALUES (?, ?)`;
            valores = [id_secao, texto];
            break;
        case "lista":
            query = `INSERT INTO conteudo_lista (id_secao, item) VALUES (?, ?)`;
            valores = [id_secao, texto];
            break;
        case "imagem":
            query = `INSERT INTO conteudo_imagem (id_secao, url, descricao) VALUES (?, ?, ?)`;
            valores = [id_secao, url, descricao];
            break;
        default:
            return res.status(400).json({ erro: "Tipo de conteúdo inválido!" });
    }

    db.run(query, valores, function (err) {
        if (err) {
            console.error('Erro ao criar conteúdo:', err);
            res.status(500).json({ erro: "Erro interno ao criar conteúdo." });
        } else {
            res.status(201).json({ id_conteudo: this.lastID, tipo });
        }
    });
};

// 🔹 Excluir um conteúdo
exports.excluirConteudo = (req, res) => {
    const { id, tipo } = req.params;

    let query = "";

    switch (tipo) {
        case "paragrafo":
            query = `DELETE FROM conteudo_paragrafo WHERE id_paragrafo = ?`;
            break;
        case "titulo":
            query = `DELETE FROM conteudo_titulo WHERE id_titulo = ?`;
            break;
        case "lista":
            query = `DELETE FROM conteudo_lista WHERE id_item = ?`;
            break;
        case "imagem":
            query = `DELETE FROM conteudo_imagem WHERE id_imagem = ?`;
            break;
        default:
            return res.status(400).json({ erro: "Tipo de conteúdo inválido!" });
    }

    db.run(query, [id], function (err) {
        if (err) {
            console.error('Erro ao excluir conteúdo:', err);
            res.status(500).json({ erro: "Erro interno ao excluir conteúdo." });
        } else if (this.changes === 0) {
            res.status(404).json({ erro: "Conteúdo não encontrado." });
        } else {
            res.json({ mensagem: "Conteúdo deletado com sucesso!" });
        }
    });
};
