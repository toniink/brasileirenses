const db = require('../config/db');

module.exports = {
    // Listar tutoriais com conteúdo
    listTutoriaisComConteudo: (req, res) => {
        db.all(`
            SELECT DISTINCT t.* 
            FROM tutoriais t
            JOIN secoes_tutorial sec ON t.id_tutorial = sec.id_tutorial
            LEFT JOIN conteudo_paragrafo par ON sec.id_secao = par.id_secao
            LEFT JOIN conteudo_titulo tit ON sec.id_secao = tit.id_secao
            LEFT JOIN conteudo_lista lis ON sec.id_secao = lis.id_secao
            LEFT JOIN conteudo_imagem img ON sec.id_secao = img.id_secao
            WHERE par.id_paragrafo IS NOT NULL
               OR tit.id_titulo IS NOT NULL
               OR lis.id_item IS NOT NULL
               OR img.id_imagem IS NOT NULL
        `, [], (err, tutoriais) => {
            if (err) {
                console.error('Erro ao buscar tutoriais com conteúdo:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            res.json(tutoriais || []);
        });
    },

    // Deletar conteúdo de tutorial
    deleteOnlyContent: (req, res) => {
        const tutorialId = Number(req.params.id);
        
        if (isNaN(tutorialId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            // 1. Encontrar seções do tutorial
            db.all(
                "SELECT id_secao FROM secoes_tutorial WHERE id_tutorial = ?", 
                [tutorialId],
                (err, secoes) => {
                    if (err) {
                        db.run("ROLLBACK");
                        console.error('Erro ao buscar seções:', err);
                        return res.status(500).json({ error: 'Erro interno' });
                    }

                    // 2. Deletar de todas as tabelas de conteúdo
                    const deleteOperations = secoes.map(secao => {
                        return new Promise((resolve, reject) => {
                            const queries = [
                                "DELETE FROM conteudo_paragrafo WHERE id_secao = ?",
                                "DELETE FROM conteudo_titulo WHERE id_secao = ?",
                                "DELETE FROM conteudo_lista WHERE id_secao = ?",
                                "DELETE FROM conteudo_imagem WHERE id_secao = ?"
                            ];

                            queries.forEach(query => {
                                db.run(query, [secao.id_secao], (err) => {
                                    if (err) reject(err);
                                });
                            });
                            resolve();
                        });
                    });

                    // 3. Deletar as seções
                    Promise.all(deleteOperations)
                        .then(() => {
                            db.run(
                                "DELETE FROM secoes_tutorial WHERE id_tutorial = ?",
                                [tutorialId],
                                function(err) {
                                    if (err) {
                                        db.run("ROLLBACK");
                                        console.error('Erro ao deletar seções:', err);
                                        return res.status(500).json({ error: 'Erro interno' });
                                    }
                                    db.run("COMMIT");
                                    res.json({ 
                                        message: 'Conteúdo de tutorial deletado com sucesso',
                                        secoesRemovidas: this.changes
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

    // Verificar se tutorial tem conteúdo
    verificarConteudo: (req, res) => {
        const tutorialId = Number(req.params.id);
        
        db.get(`
            SELECT 1 FROM secoes_tutorial sec
            LEFT JOIN conteudo_paragrafo par ON sec.id_secao = par.id_secao
            LEFT JOIN conteudo_titulo tit ON sec.id_secao = tit.id_secao
            LEFT JOIN conteudo_lista lis ON sec.id_secao = lis.id_secao
            LEFT JOIN conteudo_imagem img ON sec.id_secao = img.id_secao
            WHERE sec.id_tutorial = ?
              AND (par.id_paragrafo IS NOT NULL
                OR tit.id_titulo IS NOT NULL
                OR lis.id_item IS NOT NULL
                OR img.id_imagem IS NOT NULL)
            LIMIT 1
        `, [tutorialId], (err, row) => {
            if (err) {
                console.error('Erro ao verificar conteúdo:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            res.json({ temConteudo: !!row });
        });
    }
};