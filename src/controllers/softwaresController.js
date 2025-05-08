const db = require("../config/db");

// 🚀 Buscar todos os softwares e trazer a categoria e site associados
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
                console.error("Erro ao buscar softwares:", err);
                res.status(500).send("Erro interno no servidor");
            } else {
                res.json(resultados);
            }
        }
    );
};

// 🚀 Criar novo software
exports.criarSoftware = (req, res) => {
    const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;

    if (!nome || !id_categoria || !id_site) {
        return res.status(400).json({ erro: "Nome, categoria e site são obrigatórios!" });
    }

    db.run(
        "INSERT INTO softwares (nome, url, desenvolvedor, id_categoria, id_site) VALUES (?, ?, ?, ?, ?)",
        [nome, url, desenvolvedor, id_categoria, id_site],
        function (err) {
            if (err) {
                console.error("Erro ao criar software:", err);
                res.status(500).send("Erro ao criar software");
            } else {
                res.status(201).json({ id_softwares: this.lastID });
            }
        }
    );
};

// 🚀 Buscar software por ID e trazer a categoria e site associados
exports.buscarSoftwarePorId = (req, res) => {
    const softwareID = Number(req.params.id);

    if (isNaN(softwareID)) {
        return res.status(400).json({ erro: "ID inválido!" });
    }

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
                console.error("Erro ao buscar software:", err);
                res.status(500).send("Erro no servidor");
            } else if (!linha) {
                res.status(404).send("Software não encontrado");
            } else {
                res.json(linha);
            }
        }
    );
};

// 🚀 Atualizar software
exports.atualizarSoftware = (req, res) => {
    const softwareID = Number(req.params.id);
    const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;

    if (!nome || !id_categoria || !id_site) {
        return res.status(400).json({ erro: "Nome, categoria e site são obrigatórios!" });
    }

    db.run(
        "UPDATE softwares SET nome = ?, url = ?, desenvolvedor = ?, id_categoria = ?, id_site = ? WHERE id_softwares = ?",
        [nome, url, desenvolvedor, id_categoria, id_site, softwareID],
        function (err) {
            if (err) {
                console.error("Erro ao atualizar software:", err);
                res.status(500).send("Erro interno no servidor");
            } else if (this.changes === 0) {
                res.status(404).send("Software não encontrado");
            } else {
                res.send("Software atualizado com sucesso!");
            }
        }
    );
};

// 🚀 Deletar software
exports.excluirSoftware = (req, res) => {
    const softwareID = Number(req.params.id);

    if (isNaN(softwareID)) {
        return res.status(400).json({ erro: "ID inválido!" });
    }

    db.run("DELETE FROM softwares WHERE id_softwares = ?", [softwareID], function (err) {
        if (err) {
            console.error("Erro ao deletar software:", err);
            res.status(500).send("Erro interno no servidor");
        } else if (this.changes === 0) {
            res.status(404).send("Software não encontrado");
        } else {
            res.send("Software deletado com sucesso!");
        }
    });
};

exports.criarSecaoSoftware = (req, res) => {
    const { id_software, tipo, ordem } = req.body;

    if (!id_software || !tipo || !ordem) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }

    db.run(
        "INSERT INTO software_secoes (id_software, tipo, ordem) VALUES (?, ?, ?)",
        [id_software, tipo, ordem],
        function (err) {
            if (err) {
                console.error("Erro ao criar seção:", err);
                return res.status(500).json({ erro: "Erro interno ao criar seção." });
            }
            res.status(201).json({ id_secao: this.lastID });
        }
    );
};

// 🚀 Buscar todo o conteúdo de uma seção de software
exports.buscarConteudoPorSecaoSoftware = (req, res) => {
    const secaoID = req.params.id;

    db.all(
        `SELECT 
            'titulo' AS tipo, texto 
            FROM software_conteudo_titulo WHERE id_secao = ?
        UNION ALL
        SELECT 
            'area_atuacao' AS tipo, titulo || '|' || descricao 
            FROM software_conteudo_area_atuacao WHERE id_secao = ?
        UNION ALL
        SELECT 
            'paragrafo' AS tipo, texto 
            FROM software_conteudo_paragrafo WHERE id_secao = ?
        UNION ALL
        SELECT 
            'lista' AS tipo, item 
            FROM software_conteudo_lista WHERE id_secao = ?`,
        [secaoID, secaoID, secaoID, secaoID],
        (err, linhas) => {
            if (err) {
                console.error("Erro ao buscar conteúdo:", err);
                res.status(500).json({ erro: "Erro interno no servidor." });
            } else if (!linhas.length) {
                res.status(404).json({ erro: "Nenhum conteúdo encontrado para esta seção." });
            } else {
                res.json(linhas);
            }
        }
    );
};

// 🚀 Criar um novo conteúdo dentro da seção de software
exports.criarConteudoSoftware = (req, res) => {
    const { id_secao, tipo, texto, titulo, descricao, item } = req.body;

    if (!id_secao || !tipo) {
        return res.status(400).json({ erro: "ID da seção e tipo são obrigatórios!" });
    }

    let query = "";
    let valores = [];

    switch (tipo) {
        case "titulo":
            if (!texto) return res.status(400).json({ erro: "Texto do título é obrigatório!" });
            query = `INSERT INTO software_conteudo_titulo (id_secao, texto) VALUES (?, ?)`;
            valores = [id_secao, texto];
            break;
        case "area_atuacao":
            if (!titulo || !descricao) return res.status(400).json({ erro: "Título e descrição são obrigatórios!" });
            query = `INSERT INTO software_conteudo_area_atuacao (id_secao, titulo, descricao) VALUES (?, ?, ?)`;
            valores = [id_secao, titulo, descricao];
            break;
        case "paragrafo":
            if (!texto) return res.status(400).json({ erro: "Texto do parágrafo é obrigatório!" });
            query = `INSERT INTO software_conteudo_paragrafo (id_secao, texto) VALUES (?, ?)`;
            valores = [id_secao, texto];
            break;
        case "lista":
            if (!item) return res.status(400).json({ erro: "Item da lista é obrigatório!" });
            query = `INSERT INTO software_conteudo_lista (id_secao, item) VALUES (?, ?)`;
            valores = [id_secao, item];
            break;
        default:
            return res.status(400).json({ erro: "Tipo de conteúdo inválido!" });
    }

    db.run(query, valores, function (err) {
        if (err) {
            console.error("Erro ao criar conteúdo:", err);
            res.status(500).json({ erro: "Erro interno ao criar conteúdo." });
        } else {
            res.status(201).json({ id_conteudo: this.lastID, tipo });
        }
    });
};