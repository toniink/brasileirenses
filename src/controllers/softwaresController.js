const db = require("../config/db");

// 🚀 [1] Métodos básicos de CRUD para Softwares (mantidos como estão)
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

// ... (mantenha os outros métodos CRUD como buscarSoftwarePorId, criarSoftware, etc.) ...

// Métodos do CMS - Corrigidos para usar os nomes corretos das colunas
exports.buscarConteudoPorSoftware = (req, res) => {
    const softwareID = req.params.id;

    // 1. Busca todas as seções do software
    db.all(
        `SELECT id_secao, tipo, ordem FROM software_secoes 
         WHERE id_software = ? ORDER BY ordem`,
        [softwareID],
        (err, secoes) => {
            if (err) {
                console.error("Erro ao buscar seções:", err);
                return res.status(500).json({ erro: "Erro ao buscar seções" });
            }

            if (!secoes.length) {
                return res.json([]);
            }

            // 2. Para cada seção, busca seu conteúdo específico
            const promises = secoes.map(secao => {
                return new Promise((resolve) => {
                    let query;
                    switch(secao.tipo) {
                        case 'area_atuacao':
                            query = `SELECT id_area as id, titulo, descricao 
                                    FROM software_conteudo_area_atuacao 
                                    WHERE id_secao = ?`;
                            break;
                        case 'lista':
                            query = `SELECT id_item as id, item as texto 
                                    FROM software_conteudo_lista 
                                    WHERE id_secao = ?`;
                            break;
                        case 'titulo':
                            query = `SELECT id_titulo as id, texto 
                                    FROM software_conteudo_titulo 
                                    WHERE id_secao = ?`;
                            break;
                        case 'paragrafo':
                            query = `SELECT id_paragrafo as id, texto 
                                    FROM software_conteudo_paragrafo 
                                    WHERE id_secao = ?`;
                            break;
                        default:
                            return resolve({...secao, conteudos: []});
                    }

                    db.all(query, [secao.id_secao], (err, conteudos) => {
                        if (err) {
                            console.error(`Erro ao buscar ${secao.tipo}:`, err);
                            resolve({...secao, conteudos: []});
                        } else {
                            resolve({...secao, conteudos});
                        }
                    });
                });
            });

            Promise.all(promises)
                .then(resultados => res.json(resultados))
                .catch(error => {
                    console.error("Erro ao processar conteúdos:", error);
                    res.status(500).json({ erro: "Erro ao processar conteúdos" });
                });
        }
    );
};

exports.criarSecaoSoftware = async (req, res) => {
    const { id_software, tipo, ordem } = req.body;

    if (!id_software || !tipo || ordem === undefined) {
        return res.status(400).json({ 
            erro: "Todos os campos são obrigatórios!",
            campos: { id_software, tipo, ordem }
        });
    }

    try {
        // Verifica se o software existe
        const softwareExists = await new Promise((resolve) => {
            db.get("SELECT 1 FROM softwares WHERE id_softwares = ?", 
                  [id_software], 
                  (err, row) => resolve(!!row));
        });

        if (!softwareExists) {
            return res.status(404).json({ erro: "Software não encontrado" });
        }

        // Cria a seção
        db.run(
            "INSERT INTO software_secoes (id_software, tipo, ordem) VALUES (?, ?, ?)",
            [id_software, tipo, ordem],
            function (err) {
                if (err) {
                    console.error("Erro ao criar seção:", err);
                    return res.status(500).json({ erro: "Erro ao criar seção" });
                }
                
                res.status(201).json({ 
                    id_secao: this.lastID,
                    id_software,
                    tipo,
                    ordem
                });
            }
        );
    } catch (error) {
        console.error("Erro no processo:", error);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
};

exports.adicionarConteudo = async (req, res) => {
    const { id_secao, tipo, ...conteudo } = req.body;

    if (!id_secao || !tipo) {
        return res.status(400).json({ erro: "ID da seção e tipo são obrigatórios" });
    }

    try {
        // Verifica se a seção existe
        const secao = await new Promise((resolve) => {
            db.get(
                `SELECT id_software FROM software_secoes WHERE id_secao = ?`,
                [id_secao],
                (err, row) => resolve(row)
            );
        });

        if (!secao) {
            return res.status(404).json({ erro: "Seção não encontrada" });
        }

        let query, valores;
        
        switch (tipo) {
            case 'titulo':
                if (!conteudo.texto) return res.status(400).json({ erro: "Texto é obrigatório" });
                query = `INSERT INTO software_conteudo_titulo (id_secao, texto) VALUES (?, ?)`;
                valores = [id_secao, conteudo.texto];
                break;
            case 'paragrafo':
                if (!conteudo.texto) return res.status(400).json({ erro: "Texto é obrigatório" });
                query = `INSERT INTO software_conteudo_paragrafo (id_secao, texto) VALUES (?, ?)`;
                valores = [id_secao, conteudo.texto];
                break;
            case 'area_atuacao':
                if (!conteudo.titulo || !conteudo.descricao) return res.status(400).json({ erro: "Título e descrição são obrigatórios" });
                query = `INSERT INTO software_conteudo_area_atuacao (id_secao, titulo, descricao) VALUES (?, ?, ?)`;
                valores = [id_secao, conteudo.titulo, conteudo.descricao];
                break;
            case 'lista':
                if (!conteudo.item) return res.status(400).json({ erro: "Item é obrigatório" });
                query = `INSERT INTO software_conteudo_lista (id_secao, item) VALUES (?, ?)`;
                valores = [id_secao, conteudo.item];
                break;
            default:
                return res.status(400).json({ erro: "Tipo de conteúdo inválido" });
        }

        db.run(query, valores, function (err) {
            if (err) {
                console.error("Erro ao inserir conteúdo:", err);
                return res.status(500).json({ erro: "Erro ao salvar conteúdo" });
            }
            
            // Retorna o ID correto baseado no tipo
            const idField = {
                'titulo': 'id_titulo',
                'paragrafo': 'id_paragrafo',
                'area_atuacao': 'id_area',
                'lista': 'id_item'
            }[tipo];
            
            res.status(201).json({ 
                [idField]: this.lastID,
                id_secao,
                tipo,
                mensagem: "Conteúdo adicionado com sucesso"
            });
        });

    } catch (error) {
        console.error("Erro no processo:", error);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
};

// Métodos auxiliares
exports.buscarSecoesPorSoftware = (req, res) => {
    const { id_software } = req.params;

    db.all(
        `SELECT id_secao, tipo, ordem 
         FROM software_secoes 
         WHERE id_software = ? 
         ORDER BY ordem`,
        [id_software],
        (err, secoes) => {
            if (err) {
                console.error("Erro ao buscar seções:", err);
                return res.status(500).json({ erro: "Erro ao buscar seções" });
            }
            res.json(secoes);
        }
    );
};

exports.excluirConteudo = (req, res) => {
    const { tipo, id } = req.params;

    const tabelas = {
        'titulo': 'software_conteudo_titulo',
        'paragrafo': 'software_conteudo_paragrafo',
        'lista': 'software_conteudo_lista',
        'area_atuacao': 'software_conteudo_area_atuacao'
    };
    
    const tabela = tabelas[tipo];
    if (!tabela) {
        return res.status(400).json({ erro: "Tipo de conteúdo inválido" });
    }

    const idColumn = {
        'titulo': 'id_titulo',
        'paragrafo': 'id_paragrafo',
        'lista': 'id_item',
        'area_atuacao': 'id_area'
    }[tipo];
    
    db.run(
        `DELETE FROM ${tabela} WHERE ${idColumn} = ?`,
        [id],
        function (err) {
            if (err) {
                console.error("Erro ao excluir conteúdo:", err);
                return res.status(500).json({ erro: "Erro ao excluir conteúdo" });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ erro: "Conteúdo não encontrado" });
            }
            
            res.json({ mensagem: "Conteúdo excluído com sucesso" });
        }
    );
};