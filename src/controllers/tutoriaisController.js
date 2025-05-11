const db = require('../config/db');
const TutoriaisContentService = require('../services/tutoriaisContentService');

// Listar todos os tutoriais e seus softwares associados
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

// Criar um novo tutorial e vincular a um software
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

// Buscar um tutorial por ID
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

// Atualizar um tutorial existente
exports.atualizarTutorial = (req, res) => {
    const tutorialID = req.params.id;
    const { titulo, descricao, imagem_url, id_software } = req.body;

    db.run(
        'UPDATE tutoriais SET titulo = ?, descricao = ?, imagem_url = ?, id_software = ? WHERE id_tutorial = ?',
        [titulo, descricao, imagem_url, id_software, tutorialID],
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

// Excluir tutorial
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

// Métodos do CMS - Usando o TutoriaisContentService
exports.getContentByTutorial = async (req, res) => {
    try {
        const tutorialId = parseInt(req.params.id);
        const content = await TutoriaisContentService.getFullContent(tutorialId);
        res.json(content);
    } catch (error) {
        console.error("Erro ao buscar conteúdo:", error);
        res.status(500).json({ 
            error: "Erro ao buscar conteúdo",
            details: error.message
        });
    }
};

exports.createSection = async (req, res) => {
    try {
        const tutorialId = parseInt(req.params.id);
        const { tipo, ordem, titulo } = req.body;
        const section = await TutoriaisContentService.createSection(tutorialId, tipo, ordem, titulo);
        res.status(201).json(section);
    } catch (error) {
        console.error("Erro ao criar seção:", error);
        res.status(500).json({ 
            error: "Erro ao criar seção",
            details: error.message
        });
    }
};

exports.addContent = async (req, res) => {
    try {
        const { id_secao } = req.params;
        const { tipo, ...conteudo } = req.body;
        
        // Verifica se a seção existe
        const secao = await new Promise((resolve, reject) => {
            db.get("SELECT id_secao, tipo FROM secoes_tutorial WHERE id_secao = ?", 
                  [id_secao], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!secao) {
            return res.status(404).json({ error: "Seção não encontrada" });
        }

        // Insere o conteúdo
        const result = await TutoriaisContentService.addContent(id_secao, secao.tipo, conteudo);
        res.status(201).json(result);
    } catch (error) {
        console.error("Erro ao adicionar conteúdo:", error);
        res.status(500).json({ 
            error: "Erro ao adicionar conteúdo",
            details: error.message
        });
    }
};

exports.getSections = async (req, res) => {
    try {
        const tutorialId = parseInt(req.params.id);
        const sections = await TutoriaisContentService.getSections(tutorialId);
        res.json(sections);
    } catch (error) {
        console.error("Erro ao buscar seções:", error);
        res.status(500).json({ 
            error: "Erro ao buscar seções",
            details: error.message
        });
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const { tipo, id } = req.params;
        await TutoriaisContentService.deleteContent(tipo, id);
        res.json({ message: "Conteúdo excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir conteúdo:", error);
        res.status(500).json({ 
            error: "Erro ao excluir conteúdo",
            details: error.message
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        await TutoriaisContentService.deleteSection(id);
        res.json({ message: "Seção excluída com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir seção:", error);
        res.status(500).json({ 
            error: "Erro ao excluir seção",
            details: error.message
        });
    }
};

exports.getSectionContent = async (req, res) => {
    try {
        const { id_secao } = req.params;
        const content = await TutoriaisContentService.getSectionContent(id_secao);
        res.json(content);
    } catch (error) {
        console.error("Erro ao buscar conteúdo da seção:", error);
        res.status(500).json({ 
            error: "Erro ao buscar conteúdo da seção",
            details: error.message
        });
    }
};

// Associar tutorial a um software
exports.associarTutorialSoftware = (req, res) => {
    const { id_software, id_tutorial } = req.body;

    if (!id_software || !id_tutorial) {
        return res.status(400).json({ erro: "Erro: ID do software e ID do tutorial são obrigatórios!" });
    }

    db.run(
        "INSERT INTO tutorial_software (id_software, id_tutorial) VALUES (?, ?)",
        [id_software, id_tutorial],
        function (err) {
            if (err) {
                console.error("Erro ao associar tutorial e software:", err);
                res.status(500).json({ erro: "Erro ao salvar no banco" });
            } else {
                res.status(201).json({ mensagem: "Tutorial vinculado ao software com sucesso!" });
            }
        }
    );
};

// Buscar tutorial vinculado ao software
exports.buscarTutorialPorSoftware = (req, res) => {
    const softwareID = req.params.id;

    db.get(
        `SELECT tutoriais.id_tutorial, tutoriais.titulo FROM tutorial_software 
        INNER JOIN tutoriais ON tutorial_software.id_tutorial = tutoriais.id_tutorial
        WHERE tutorial_software.id_software = ?`,
        [softwareID],
        (err, linha) => {
            if (err) {
                console.error("Erro ao buscar tutorial associado:", err);
                res.status(500).json({ erro: "Erro no servidor" });
            } else if (!linha) {
                res.status(404).json({ erro: "Nenhum tutorial encontrado para este software" });
            } else {
                res.json(linha);
            }
        }
    );
};