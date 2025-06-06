const db = require('../config/db');
const CursoContentService = require('../services/cursoContentService');

// Listar todos os cursos
exports.buscarTodosCursos = (req, res) => {
    db.all(
        `SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            cursos.descricao,
            cursos.duracao,
            cursos.url,
            cursos.formato,
            cursos.nivel_dificuldade,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM cursos
        LEFT JOIN categorias ON cursos.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON cursos.id_site = sites.id_site`,
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar cursos:', err);
                res.status(500).json({ error: 'Erro interno no servidor' });
            } else {
                res.json(resultados || []);
            }
        }
    );
};

// Criar novo curso
exports.criarCurso = (req, res) => {
    const { nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site } = req.body;

    if (!nome_curso) {
        return res.status(400).json({ error: 'Nome do curso é obrigatório' });
    }

    db.run(
        'INSERT INTO cursos (nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site],
        function (err) {
            if (err) {
                console.error('Erro ao criar curso:', err);
                res.status(500).json({ error: 'Erro ao criar curso' });
            } else {
                res.status(201).json({ 
                    id_cursos: this.lastID,
                    message: 'Curso criado com sucesso'
                });
            }
        }
    );
};

// Buscar curso por ID
exports.buscarCursoPorId = (req, res) => {
    const cursoID = Number(req.params.id);

    if (isNaN(cursoID)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    db.get(
        `SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            cursos.descricao,
            cursos.duracao,
            cursos.url,
            cursos.formato,
            cursos.nivel_dificuldade,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM cursos
        LEFT JOIN categorias ON cursos.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON cursos.id_site = sites.id_site
        WHERE cursos.id_cursos = ?`,
        [cursoID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar curso:', err);
                res.status(500).json({ error: 'Erro no servidor' });
            } else if (!linha) {
                res.status(404).json({ error: 'Curso não encontrado' });
            } else {
                res.json(linha);
            }
        }
    );
};

// Atualizar curso
exports.atualizarCurso = (req, res) => {
    const cursoID = Number(req.params.id);
    const { nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site } = req.body;

    if (isNaN(cursoID)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!nome_curso) {
        return res.status(400).json({ error: 'Nome do curso é obrigatório' });
    }

    db.run(
        'UPDATE cursos SET nome_curso = ?, descricao = ?, duracao = ?, url = ?, formato = ?, nivel_dificuldade = ?, id_categoria = ?, id_site = ? WHERE id_cursos = ?',
        [nome_curso, descricao, duracao, url, formato, nivel_dificuldade, id_categoria, id_site, cursoID],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar curso:', err);
                res.status(500).json({ error: 'Erro interno' });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Curso não encontrado' });
            } else {
                res.json({ message: 'Curso atualizado com sucesso!' });
            }
        }
    );
};

// Deletar curso
exports.excluirCurso = (req, res) => {
    const cursoID = Number(req.params.id);

    if (isNaN(cursoID)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    db.run('DELETE FROM cursos WHERE id_cursos = ?', [cursoID], function (err) {
        if (err) {
            console.error('Erro ao deletar curso:', err);
            res.status(500).json({ error: 'Erro interno no servidor' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Curso não encontrado' });
        } else {
            res.json({ message: 'Curso deletado com sucesso!' });
        }
    });
};

// Adicionar categorias secundarias aos cursos
exports.adicionarCategoriasSecundarias = (req, res) => {
    const id_curso = Number(req.params.id);
    const { categorias } = req.body;

    if (isNaN(id_curso)) {
        return res.status(400).json({ error: 'ID do curso inválido' });
    }

    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
        return res.status(400).json({ error: 'Lista de categorias inválida' });
    }

    // Verificar se o curso existe
    db.get('SELECT 1 FROM cursos WHERE id_cursos = ?', [id_curso], (err, row) => {
        if (err) {
            console.error('Erro ao verificar curso:', err);
            return res.status(500).json({ error: 'Erro interno' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }

        // Remover categorias secundárias existentes para evitar duplicação
        db.run('DELETE FROM categoriasCursos WHERE id_curso = ?', [id_curso], (err) => {
            if (err) {
                console.error('Erro ao remover categorias antigas:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }

            // Inserir categorias secundárias novas
            const stmt = db.prepare('INSERT INTO categoriasCursos (id_curso, id_categoria) VALUES (?, ?)');
            let errorOccurred = false;

            categorias.forEach((id_categoria) => {
                if (errorOccurred) return;
                
                stmt.run(id_curso, id_categoria, (err) => {
                    if (err) {
                        console.error('Erro ao inserir categoria secundária:', err);
                        errorOccurred = true;
                    }
                });
            });

            stmt.finalize((err) => {
                if (err || errorOccurred) {
                    console.error('Erro ao finalizar inserção:', err);
                    return res.status(500).json({ error: 'Erro ao adicionar categorias' });
                }
                res.json({ message: 'Categorias secundárias adicionadas com sucesso!' });
            });
        });
    });
};

// 🎨 Métodos do CMS de Conteúdo

// Buscar conteúdo completo do curso
exports.getContentByCurso = async (req, res) => {
    try {
        const cursoId = parseInt(req.params.id);
        
        if (!cursoId || isNaN(cursoId)) {
            return res.status(400).json({ error: "ID do curso inválido" });
        }

        // Verifica se o curso existe
        const cursoExists = await new Promise((resolve) => {
            db.get("SELECT 1 FROM cursos WHERE id_cursos = ?", [cursoId], (err, row) => {
                resolve(!!row);
            });
        });

        if (!cursoExists) {
            return res.status(404).json({ error: "Curso não encontrado" });
        }

        const content = await CursoContentService.getFullContent(cursoId);
        
        // Garante que sempre retorne um array, mesmo que vazio
        res.json(Array.isArray(content) ? content : []);

    } catch (error) {
        console.error("Erro ao buscar conteúdo:", error);
        res.status(500).json({ 
            error: "Erro ao buscar conteúdo",
            details: error.message
        });
    }
};

// Criar nova seção no curso
exports.createSection = async (req, res) => {
    try {
        const cursoId = parseInt(req.params.id);
        const { tipo, ordem, titulo } = req.body;

        if (!cursoId || isNaN(cursoId)) {
            return res.status(400).json({ error: "ID do curso inválido" });
        }

        if (!tipo || ordem === undefined) {
            return res.status(400).json({ 
                error: "Campos obrigatórios faltando",
                required: ["tipo", "ordem"],
                received: req.body
            });
        }

        // Verifica se o curso existe
        const cursoExists = await new Promise((resolve) => {
            db.get("SELECT 1 FROM cursos WHERE id_cursos = ?", [cursoId], (err, row) => {
                resolve(!!row);
            });
        });

        if (!cursoExists) {
            return res.status(404).json({ error: "Curso não encontrado" });
        }

        const section = await CursoContentService.createSection(cursoId, tipo, ordem, titulo);
        res.status(201).json(section);

    } catch (error) {
        console.error("Erro ao criar seção:", error);
        res.status(500).json({ 
            error: "Erro ao criar seção",
            details: error.message
        });
    }
};

// Adicionar conteúdo a uma seção
exports.addContent = async (req, res) => {
    try {
        const { tipo } = req.params;
        const { id_secao_curso, ...conteudo } = req.body;

        console.log("Recebendo conteúdo para adicionar:", {
            tipo,
            id_secao_curso,
            conteudo
        });

        if (!id_secao_curso || !tipo) {
            return res.status(400).json({ 
                error: "Campos obrigatórios faltando",
                required: ["id_secao_curso", "tipo"],
                received: req.body
            });
        }

        const result = await CursoContentService.addContent(id_secao_curso, tipo, conteudo);
        
        console.log("Conteúdo adicionado com sucesso:", result);
        
        res.status(201).json(result);

    } catch (error) {
        console.error("Erro detalhado ao adicionar conteúdo:", error);
        res.status(500).json({ 
            error: "Erro ao adicionar conteúdo",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Listar seções do curso
exports.getSections = async (req, res) => {
    try {
        const cursoId = parseInt(req.params.id);
        
        if (!cursoId || isNaN(cursoId)) {
            return res.status(400).json({ error: "ID do curso inválido" });
        }

        const sections = await CursoContentService.getSections(cursoId);
        res.json(sections);

    } catch (error) {
        console.error("Erro ao buscar seções:", error);
        res.status(500).json({ 
            error: "Erro ao buscar seções",
            details: error.message
        });
    }
};

// Deletar conteúdo
exports.deleteContent = async (req, res) => {
    try {
        const { tipo, id } = req.params;
        
        if (!tipo || !id) {
            return res.status(400).json({ error: "Parâmetros inválidos" });
        }

        await CursoContentService.deleteContent(tipo, id);
        res.json({ message: "Conteúdo excluído com sucesso" });

    } catch (error) {
        console.error("Erro ao excluir conteúdo:", error);
        res.status(500).json({ 
            error: "Erro ao excluir conteúdo",
            details: error.message
        });
    }
};

// No cursosController.js, adicione este novo método
// No cursosController.js, modifique o método buscarCursosPorCategoria
exports.buscarCursosPorCategoria = (req, res) => {
    const categoriaId = req.query.categoria;
    const id = categoriaId ? parseInt(categoriaId) : null;

    let query = `
        SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            cursos.descricao,
            cursos.duracao,
            cursos.url,
            cursos.formato,
            cursos.nivel_dificuldade,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM cursos
        LEFT JOIN categorias ON cursos.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON cursos.id_site = sites.id_site
    `;
    
    const params = [];
    
    if (id) {
        query += ` WHERE cursos.id_categoria = ? OR EXISTS (
            SELECT 1 FROM categoriasCursos 
            WHERE categoriasCursos.id_curso = cursos.id_cursos 
            AND categoriasCursos.id_categoria = ?
        )`;
        params.push(id, id);
    }
    
    db.all(query, params, (err, resultados) => {
        if (err) {
            console.error('Erro ao buscar cursos:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Erro no servidor'
            });
        }
        res.json({
            success: true,
            data: resultados || []
        });
    });
};

// Buscar curso por ID com softwares associados
exports.buscarCursoPorIdComSoftwares = (req, res) => {
    const cursoID = Number(req.params.id);

    if (isNaN(cursoID)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    // Primeiro busca os dados básicos do curso
    db.get(
        `SELECT 
            cursos.id_cursos,
            cursos.nome_curso,
            cursos.descricao,
            cursos.duracao,
            cursos.url,
            cursos.formato,
            cursos.nivel_dificuldade,
            categorias.nome AS nome_categoria,
            sites.nome AS nome_site
        FROM cursos
        LEFT JOIN categorias ON cursos.id_categoria = categorias.id_categorias
        LEFT JOIN sites ON cursos.id_site = sites.id_site
        WHERE cursos.id_cursos = ?`,
        [cursoID],
        (err, curso) => {
            if (err) {
                console.error('Erro ao buscar curso:', err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }
            
            if (!curso) {
                return res.status(404).json({ error: 'Curso não encontrado' });
            }

            // Depois busca os softwares associados
            db.all(
                `SELECT 
                    softwares.id_softwares,
                    softwares.nome,
                    softwares.url,
                    softwares.desenvolvedor
                FROM softwares
                JOIN cursos_softwares ON softwares.id_softwares = cursos_softwares.id_software
                WHERE cursos_softwares.id_curso = ?`,
                [cursoID],
                (err, softwares) => {
                    if (err) {
                        console.error('Erro ao buscar softwares:', err);
                        return res.status(500).json({ error: 'Erro ao buscar softwares associados' });
                    }

                    // Combina os resultados
                    res.json({
                        ...curso,
                        softwares: softwares || []
                    });
                }
            );
        }
    );
};

// Buscar site associado ao curso
exports.getSiteByCurso = (req, res) => {
    const cursoID = Number(req.params.id);

    if (isNaN(cursoID)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    db.get(
        `SELECT 
            s.id_site, 
            s.nome, 
            s.url,
            s.descricao
        FROM cursos c
        LEFT JOIN sites s ON c.id_site = s.id_site
        WHERE c.id_cursos = ?`,
        [cursoID],
        (err, site) => {
            if (err) {
                console.error("Erro ao buscar site do curso:", err);
                return res.status(500).json({ 
                    error: "Erro interno no servidor",
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            if (!site || !site.id_site) {
                return res.status(404).json({ 
                    error: "Nenhum site associado a este curso",
                    code: "SITE_NOT_FOUND"
                });
            }

            res.json({
                id_site: site.id_site,
                nome: site.nome,
                url: site.url,
                descricao: site.descricao
            });
        }
    );
};