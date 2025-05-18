// src/api/controllers/cursosContentController.js
const db = require('../config/db');

module.exports = {
    // Listar cursos que possuem conteúdo (versão corrigida)
    listCursosComConteudo: (req, res) => {
    db.all('SELECT * FROM cursos_com_conteudo ORDER BY nome_curso', [], (err, cursos) => {
        if (err) {
            console.error('Erro ao buscar cursos com conteúdo:', err);
            return res.status(500).json({ error: 'Erro interno' });
        }
        res.json(cursos || []);
    });



},


    // Deletar apenas o conteúdo de um curso (versão corrigida)
    deleteOnlyContent: (req, res) => {
        const cursoId = Number(req.params.id);
        
        if (isNaN(cursoId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            
            // 1. Encontrar todas as seções do curso
            db.all(
                "SELECT id_secao_curso FROM curso_secoes WHERE id_curso = ?", 
                [cursoId],
                (err, secoes) => {
                    if (err) {
                        db.run("ROLLBACK");
                        console.error('Erro ao buscar seções:', err);
                        return res.status(500).json({ error: 'Erro interno' });
                    }

                    // 2. Para cada seção, deletar de todas as tabelas de conteúdo
                    const deleteOperations = secoes.map(secao => {
                        return new Promise((resolve, reject) => {
                            const queries = [
                                "DELETE FROM curso_conteudo_titulo WHERE id_secao_curso = ?",
                                "DELETE FROM curso_conteudo_area_atuacao WHERE id_secao_curso = ?",
                                "DELETE FROM curso_conteudo_paragrafo WHERE id_secao_curso = ?",
                                "DELETE FROM curso_conteudo_lista WHERE id_secao_curso = ?",
                                "DELETE FROM curso_conteudo_passo WHERE id_secao_curso = ?"
                            ];

                            queries.forEach(query => {
                                db.run(query, [secao.id_secao_curso], (err) => {
                                    if (err) reject(err);
                                });
                            });
                            resolve();
                        });
                    });

                    // 3. Quando todos os conteúdos forem deletados, deletar as seções
                    Promise.all(deleteOperations)
                        .then(() => {
                            db.run(
                                "DELETE FROM curso_secoes WHERE id_curso = ?",
                                [cursoId],
                                function(err) {
                                    if (err) {
                                        db.run("ROLLBACK");
                                        console.error('Erro ao deletar seções:', err);
                                        return res.status(500).json({ error: 'Erro interno' });
                                    }
                                    db.run("COMMIT");
                                    res.json({ 
                                        message: 'Conteúdo deletado com sucesso',
                                        secoesDeletadas: this.changes
                                    });
                                }
                            );
                        })
                        .catch(err => {
                            db.run("ROLLBACK");
                            console.error('Erro ao deletar conteúdo:', err);
                            res.status(500).json({ error: 'Erro ao deletar conteúdo' });
                        });
                }
            );
        });
    },

    // Verificar se curso tem conteúdo (versão corrigida)
    verificarConteudo: (req, res) => {
        const cursoId = Number(req.params.id);
        
        db.get(`
            SELECT 1 FROM curso_secoes sec
            WHERE sec.id_curso = ?
            AND (
                EXISTS (SELECT 1 FROM curso_conteudo_titulo WHERE id_secao_curso = sec.id_secao_curso)
                OR EXISTS (SELECT 1 FROM curso_conteudo_area_atuacao WHERE id_secao_curso = sec.id_secao_curso)
                OR EXISTS (SELECT 1 FROM curso_conteudo_paragrafo WHERE id_secao_curso = sec.id_secao_curso)
                OR EXISTS (SELECT 1 FROM curso_conteudo_lista WHERE id_secao_curso = sec.id_secao_curso)
                OR EXISTS (SELECT 1 FROM curso_conteudo_passo WHERE id_secao_curso = sec.id_secao_curso)
            )
            LIMIT 1
        `, [cursoId], (err, row) => {
            if (err) {
                console.error('Erro ao verificar conteúdo:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            res.json({ temConteudo: !!row });
        });
    },

    // Atualizar conteúdo de um curso (novo método)
updateCourseContent: (req, res) => {
    const cursoId = Number(req.params.id);
    const { secoes } = req.body;

    if (isNaN(cursoId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!secoes || !Array.isArray(secoes)) {
        return res.status(400).json({ error: 'Dados de seções inválidos' });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        // Primeiro verifica se o curso existe
        db.get("SELECT 1 FROM cursos WHERE id_cursos = ?", [cursoId], (err, row) => {
            if (err) {
                db.run("ROLLBACK");
                console.error('Erro ao verificar curso:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            
            if (!row) {
                db.run("ROLLBACK");
                return res.status(404).json({ error: 'Curso não encontrado' });
            }

            // Processa cada seção
            const updatePromises = secoes.map(secao => {
                return new Promise((resolve, reject) => {
                    // Verifica se a seção existe
                    db.get(
                        "SELECT 1 FROM curso_secoes WHERE id_secao_curso = ? AND id_curso = ?",
                        [secao.id_secao_curso, cursoId],
                        (err, secRow) => {
                            if (err) return reject(err);
                            if (!secRow) return reject(new Error(`Seção ${secao.id_secao_curso} não encontrada`));
                            
                            // Atualiza cada conteúdo da seção
                            const contentPromises = secao.conteudos.map(conteudo => {
                                return new Promise((resolve, reject) => {
                                    let query, params;
                                    
                                    switch(secao.tipo) {
                                        case 'titulo':
                                            query = "UPDATE curso_conteudo_titulo SET texto = ? WHERE id_titulo_curso = ?";
                                            params = [conteudo.texto, conteudo.id];
                                            break;
                                        case 'paragrafo':
                                            query = "UPDATE curso_conteudo_paragrafo SET texto = ? WHERE id_paragrafo_curso = ?";
                                            params = [conteudo.texto, conteudo.id];
                                            break;
                                        case 'area_atuacao':
                                            query = "UPDATE curso_conteudo_area_atuacao SET titulo = ?, descricao = ? WHERE id_area_curso = ?";
                                            params = [conteudo.titulo, conteudo.descricao, conteudo.id];
                                            break;
                                        case 'lista':
                                            query = "UPDATE curso_conteudo_lista SET item = ? WHERE id_item_curso = ?";
                                            params = [conteudo.texto, conteudo.id];
                                            break;
                                        case 'passo_a_passo':
                                            query = "UPDATE curso_conteudo_passo SET instrucao = ?, imagem = ? WHERE id_passo_curso = ?";
                                            params = [conteudo.instrucao, conteudo.imagem, conteudo.id];
                                            break;
                                        default:
                                            return reject(new Error(`Tipo de seção inválido: ${secao.tipo}`));
                                    }

                                    db.run(query, params, function(err) {
                                        if (err) return reject(err);
                                        if (this.changes === 0) {
                                            console.warn(`Nenhum conteúdo atualizado para ID ${conteudo.id} (tipo: ${secao.tipo})`);
                                        }
                                        resolve();
                                    });
                                });
                            });

                            Promise.all(contentPromises)
                                .then(resolve)
                                .catch(reject);
                        }
                    );
                });
            });

            Promise.all(updatePromises)
                .then(() => {
                    db.run("COMMIT");
                    res.json({ success: true, message: 'Conteúdo atualizado com sucesso' });
                })
                .catch(err => {
                    db.run("ROLLBACK");
                    console.error('Erro ao atualizar conteúdo:', err);
                    res.status(500).json({ error: err.message || 'Erro ao atualizar conteúdo' });
                });
        });
    });
}
};