const db = require('../config/db');

module.exports = {
    // Listar softwares com conteúdo
    listSoftwaresComConteudo: (req, res) => {
       console.log('Recebida requisição para listar softwares com conteúdo');
        
        db.all(`
            SELECT DISTINCT s.* 
            FROM softwares s
            JOIN software_secoes sec ON s.id_softwares = sec.id_software
            LEFT JOIN software_conteudo_titulo tit ON sec.id_secao = tit.id_secao
            LEFT JOIN software_conteudo_area_atuacao area ON sec.id_secao = area.id_secao
            LEFT JOIN software_conteudo_paragrafo par ON sec.id_secao = par.id_secao
            LEFT JOIN software_conteudo_lista lis ON sec.id_secao = lis.id_secao
            WHERE tit.id_titulo IS NOT NULL 
               OR area.id_area IS NOT NULL
               OR par.id_paragrafo IS NOT NULL
               OR lis.id_item IS NOT NULL
            ORDER BY s.nome ASC
        `, [], (err, softwares) => {
            if (err) {
                console.error('Erro ao buscar softwares com conteúdo:', err);
                return res.status(500).json({ 
                    error: 'Erro interno no servidor',
                    details: err.message 
                });
            }
            
            console.log(`Encontrados ${softwares.length} softwares com conteúdo`);
            res.json(softwares || []);
        });
    },

    // Deletar conteúdo de software (adaptado para suas tabelas)
    deleteOnlyContent: (req, res) => {
        const softwareId = Number(req.params.id);
        
        if (isNaN(softwareId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        db.serialize(() => {
            // Inicia transação
            db.run("BEGIN TRANSACTION");

            // 1. Encontrar seções do software
            db.all(
                "SELECT id_secao FROM software_secoes WHERE id_software = ?", 
                [softwareId],
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
                                "DELETE FROM software_conteudo_titulo WHERE id_secao = ?",
                                "DELETE FROM software_conteudo_area_atuacao WHERE id_secao = ?",
                                "DELETE FROM software_conteudo_paragrafo WHERE id_secao = ?",
                                "DELETE FROM software_conteudo_lista WHERE id_secao = ?"
                            ];

                            // Executa todas as queries de delete para a seção
                            queries.forEach(query => {
                                db.run(query, [secao.id_secao], (err) => {
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
                                "DELETE FROM software_secoes WHERE id_software = ?",
                                [softwareId],
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

    // Verificar se software tem conteúdo
    verificarConteudo: (req, res) => {
        const softwareId = Number(req.params.id);
        
        db.get(`
            SELECT 1 FROM software_secoes sec
            LEFT JOIN software_conteudo_titulo tit ON sec.id_secao = tit.id_secao
            LEFT JOIN software_conteudo_area_atuacao area ON sec.id_secao = area.id_secao
            LEFT JOIN software_conteudo_paragrafo par ON sec.id_secao = par.id_secao
            LEFT JOIN software_conteudo_lista lis ON sec.id_secao = lis.id_secao
            WHERE sec.id_software = ? 
              AND (tit.id_titulo IS NOT NULL
                OR area.id_area IS NOT NULL
                OR par.id_paragrafo IS NOT NULL
                OR lis.id_item IS NOT NULL)
            LIMIT 1
        `, [softwareId], (err, row) => {
            if (err) {
                console.error('Erro ao verificar conteúdo:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            res.json({ temConteudo: !!row });
        });
    },

    // Atualizar conteúdo de um software
updateSoftwareContent: (req, res) => {
    const softwareId = Number(req.params.id);
    const { secoes } = req.body;

    if (isNaN(softwareId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!secoes || !Array.isArray(secoes)) {
        return res.status(400).json({ error: 'Dados de seções inválidos' });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        // Verifica se o software existe
        db.get("SELECT 1 FROM softwares WHERE id_softwares = ?", [softwareId], (err, row) => {
            if (err) {
                db.run("ROLLBACK");
                console.error('Erro ao verificar software:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            
            if (!row) {
                db.run("ROLLBACK");
                return res.status(404).json({ error: 'Software não encontrado' });
            }

            // Processa cada seção
            const updatePromises = secoes.map(secao => {
                return new Promise((resolve, reject) => {
                    // Verifica se a seção existe
                    db.get(
                        "SELECT 1 FROM software_secoes WHERE id_secao = ? AND id_software = ?",
                        [secao.id_secao, softwareId],
                        (err, secRow) => {
                            if (err) return reject(err);
                            if (!secRow) return reject(new Error(`Seção ${secao.id_secao} não encontrada`));
                            
                            // Atualiza cada conteúdo da seção
                            const contentPromises = secao.conteudos.map(conteudo => {
                                return new Promise((resolve, reject) => {
                                    let query, params;
                                    
                                    switch(secao.tipo) {
                                        case 'titulo':
                                            query = "UPDATE software_conteudo_titulo SET texto = ? WHERE id_titulo = ?";
                                            params = [conteudo.texto, conteudo.id];
                                            break;
                                        case 'paragrafo':
                                            query = "UPDATE software_conteudo_paragrafo SET texto = ? WHERE id_paragrafo = ?";
                                            params = [conteudo.texto, conteudo.id];
                                            break;
                                        case 'area_atuacao':
                                            query = "UPDATE software_conteudo_area_atuacao SET titulo = ?, descricao = ? WHERE id_area = ?";
                                            params = [conteudo.titulo, conteudo.descricao, conteudo.id];
                                            break;
                                        case 'lista':
                                            query = "UPDATE software_conteudo_lista SET item = ? WHERE id_item = ?";
                                            params = [conteudo.texto, conteudo.id];
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