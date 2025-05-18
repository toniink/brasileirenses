// src/api/services/tutoriaisContentService.js
const db = require("../config/db");

class TutoriaisContentService {
  static async getFullContent(id_tutorial) {
    try {
      // 1. Verifica se o tutorial existe
      const tutorialExists = await new Promise((resolve) => {
        db.get(
          "SELECT 1 FROM tutoriais WHERE id_tutorial = ?", 
          [id_tutorial],
          (err, row) => resolve(!!row)
        );
      });

      if (!tutorialExists) {
        throw new Error(`Tutorial com ID ${id_tutorial} não encontrado`);
      }

      // 2. Busca as seções do tutorial
      const secoes = await new Promise((resolve, reject) => {
        db.all(
          `SELECT id_secao, tipo, ordem 
           FROM secoes_tutorial 
           WHERE id_tutorial = ? 
           ORDER BY ordem`,
          [id_tutorial],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
          }
        );
      });

      // 3. Para cada seção, busca seu conteúdo específico
      const contents = await Promise.all(
        secoes.map(async (secao) => {
          try {
            let tableName, fields;
            
            switch(secao.tipo) {
              case 'titulo':
                tableName = 'conteudo_titulo';
                fields = 'id_titulo as id, texto';
                break;
              case 'paragrafo':
                tableName = 'conteudo_paragrafo';
                fields = 'id_paragrafo as id, texto';
                break;
              case 'imagem':
                tableName = 'conteudo_imagem';
                fields = 'id_imagem as id, url, descricao';
                break;
              case 'lista':
                tableName = 'conteudo_lista';
                fields = 'id_item as id, item as texto';
                break;
              case 'passo':
                tableName = 'conteudo_passo_tutorial';
                fields = 'id_passo as id, numero, instrucao, imagem';
                break;
              default:
                console.warn(`[TutoriaisContentService] Tipo de seção desconhecido: ${secao.tipo}`);
                return { ...secao, conteudos: [] };
            }

            const conteudos = await new Promise((resolve) => {
              db.all(
                `SELECT ${fields} FROM ${tableName} WHERE id_secao = ? ORDER BY ${secao.tipo === 'passo' ? 'numero' : 'id'}`,
                [secao.id_secao],
                (err, rows) => {
                  if (err) {
                    console.error(`[TutoriaisContentService] Erro ao buscar conteúdo para seção ${secao.id_secao}:`, err);
                    resolve([]);
                  } else {
                    resolve(rows || []);
                  }
                }
              );
            });

            return { 
              ...secao, 
              conteudos,
              idField: secao.tipo === 'titulo' ? 'id_titulo' :
                      secao.tipo === 'paragrafo' ? 'id_paragrafo' :
                      secao.tipo === 'imagem' ? 'id_imagem' : 
                      secao.tipo === 'lista' ? 'id_item' : 'id_passo'
            };
          } catch (error) {
            console.error(`[TutoriaisContentService] Erro no processamento da seção ${secao.id_secao}:`, error);
            return { ...secao, conteudos: [] };
          }
        })
      );

      return contents;
    } catch (error) {
      console.error('[TutoriaisContentService] Erro geral:', error);
      throw error;
    }
  }

  static async createSection(id_tutorial, tipo, ordem, titulo = null) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se o tutorial existe
      db.get(
        "SELECT 1 FROM tutoriais WHERE id_tutorial = ?",
        [id_tutorial],
        (err, row) => {
          if (err) {
            console.error('[TutoriaisContentService] Erro ao verificar tutorial:', err);
            return reject(err);
          }

          if (!row) {
            return reject(new Error(`Tutorial com ID ${id_tutorial} não encontrado`));
          }

          // Cria a seção
          db.run(
            `INSERT INTO secoes_tutorial (id_tutorial, tipo, ordem) VALUES (?, ?, ?)`,
            [id_tutorial, tipo, ordem],
            function(err) {
              if (err) {
                console.error('[TutoriaisContentService] Erro ao criar seção:', err);
                reject(err);
              } else {
                const sectionId = this.lastID;
                
                // Se for um título, cria o conteúdo automaticamente
                if (tipo === 'titulo' && titulo) {
                  db.run(
                    `INSERT INTO conteudo_titulo (id_secao, texto) VALUES (?, ?)`,
                    [sectionId, titulo],
                    function(err) {
                      if (err) {
                        console.error('[TutoriaisContentService] Erro ao criar conteúdo de título:', err);
                        resolve({
                          id_secao: sectionId,
                          id_tutorial,
                          tipo,
                          ordem,
                          conteudos: []
                        });
                      } else {
                        resolve({
                          id_secao: sectionId,
                          id_tutorial,
                          tipo,
                          ordem,
                          conteudos: [{
                            id: this.lastID,
                            texto: titulo
                          }]
                        });
                      }
                    }
                  );
                } else {
                  resolve({
                    id_secao: sectionId,
                    id_tutorial,
                    tipo,
                    ordem,
                    conteudos: []
                  });
                }
              }
            }
          );
        }
      );
    });
  }

  static async addContent(id_secao, tipo, conteudo) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se a seção existe
      db.get(
        `SELECT id_secao, tipo, id_tutorial FROM secoes_tutorial WHERE id_secao = ?`,
        [id_secao],
        (err, secao) => {
          if (err) {
            console.error('[TutoriaisContentService] Erro ao verificar seção:', err);
            return reject(err);
          }

          if (!secao) {
            return reject(new Error('Seção não encontrada'));
          }

          // Verifica se o tutorial associado à seção ainda existe
          db.get(
            "SELECT 1 FROM tutoriais WHERE id_tutorial = ?",
            [secao.id_tutorial],
            (err, row) => {
              if (err) {
                console.error('[TutoriaisContentService] Erro ao verificar tutorial:', err);
                return reject(err);
              }

              if (!row) {
                return reject(new Error('Tutorial associado à seção não encontrado'));
              }

              if (secao.tipo !== tipo) {
                return reject(new Error(`Tipo de conteúdo (${tipo}) não corresponde ao tipo da seção (${secao.tipo})`));
              }

              let tableName, fields, values;
              
              switch(tipo) {
                case 'titulo':
                  tableName = 'conteudo_titulo';
                  fields = ['id_secao', 'texto'];
                  values = [id_secao, conteudo.texto];
                  break;
                case 'paragrafo':
                  tableName = 'conteudo_paragrafo';
                  fields = ['id_secao', 'texto'];
                  values = [id_secao, conteudo.texto];
                  break;
                case 'imagem':
                  tableName = 'conteudo_imagem';
                  fields = ['id_secao', 'url', 'descricao'];
                  values = [id_secao, conteudo.url, conteudo.descricao || null];
                  break;
                case 'lista':
                  tableName = 'conteudo_lista';
                  fields = ['id_secao', 'item'];
                  values = [id_secao, conteudo.item];
                  break;
                case 'passo':
                  tableName = 'conteudo_passo_tutorial';
                  fields = ['id_secao', 'numero', 'instrucao', 'imagem'];
                  values = [id_secao, conteudo.numero, conteudo.instrucao, conteudo.imagem || null];
                  break;
                default:
                  return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
              }

              const placeholders = fields.map(() => '?').join(', ');

              db.run(
                `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
                values,
                function(err) {
                  if (err) {
                    console.error('[TutoriaisContentService] Erro ao adicionar conteúdo:', err);
                    reject(err);
                  } else {
                    resolve({
                      id: this.lastID,
                      id_secao,
                      tipo,
                      ...conteudo
                    });
                  }
                }
              );
            }
          );
        }
      );
    });
  }

  static async getSectionContent(id_secao) {
    return new Promise((resolve, reject) => {
      // Primeiro descobre o tipo da seção
      db.get(
        "SELECT tipo FROM secoes_tutorial WHERE id_secao = ?",
        [id_secao],
        (err, secao) => {
          if (err) return reject(err);
          if (!secao) return reject(new Error("Seção não encontrada"));

          let tableName;
          switch(secao.tipo) {
            case 'titulo': tableName = 'conteudo_titulo'; break;
            case 'paragrafo': tableName = 'conteudo_paragrafo'; break;
            case 'imagem': tableName = 'conteudo_imagem'; break;
            case 'lista': tableName = 'conteudo_lista'; break;
            case 'passo': tableName = 'conteudo_passo_tutorial'; break;
            default: return reject(new Error("Tipo de seção inválido"));
          }

          // Busca o conteúdo
          db.all(
            `SELECT * FROM ${tableName} WHERE id_secao = ?`,
            [id_secao],
            (err, rows) => {
              if (err) reject(err);
              else resolve(rows || []);
            }
          );
        }
      );
    });
  }

  static async getSections(id_tutorial) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se o tutorial existe
      db.get(
        "SELECT 1 FROM tutoriais WHERE id_tutorial = ?",
        [id_tutorial],
        (err, row) => {
          if (err) {
            console.error('[TutoriaisContentService] Erro ao verificar tutorial:', err);
            return reject(err);
          }

          if (!row) {
            return reject(new Error(`Tutorial com ID ${id_tutorial} não encontrado`));
          }

          // Busca as seções
          db.all(
            `SELECT 
              id_secao, 
              tipo, 
              ordem
             FROM secoes_tutorial 
             WHERE id_tutorial = ? 
             ORDER BY ordem`,
            [id_tutorial],
            (err, rows) => {
              if (err) {
                console.error('[TutoriaisContentService] Erro ao buscar seções:', err);
                reject(err);
              } else {
                resolve(rows || []);
              }
            }
          );
        }
      );
    });
  }

  static async updateContent(id, tableName, idField, contentData) {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(contentData);
        const values = Object.values(contentData);
        
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        
        db.run(
            `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = ?`,
            [...values, id],
            function(err) {
                if (err) {
                    console.error(`[TutoriaisContentService] Erro ao atualizar conteúdo em ${tableName}:`, err);
                    reject(err);
                } else {
                    resolve({
                        id,
                        ...contentData
                    });
                }
            }
        );
    });
}
  static async deleteContent(tipo, id) {
    return new Promise((resolve, reject) => {
      let tableName, idField;
      
      switch(tipo) {
        case 'titulo':
          tableName = 'conteudo_titulo';
          idField = 'id_titulo';
          break;
        case 'paragrafo':
          tableName = 'conteudo_paragrafo';
          idField = 'id_paragrafo';
          break;
        case 'imagem':
          tableName = 'conteudo_imagem';
          idField = 'id_imagem';
          break;
        case 'lista':
          tableName = 'conteudo_lista';
          idField = 'id_item';
          break;
        case 'passo':
          tableName = 'conteudo_passo_tutorial';
          idField = 'id_passo';
          break;
        default:
          return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
      }

      db.run(
        `DELETE FROM ${tableName} WHERE ${idField} = ?`,
        [id],
        function(err) {
          if (err) {
            console.error('[TutoriaisContentService] Erro ao deletar conteúdo:', err);
            reject(err);
          } else {
            if (this.changes === 0) {
              reject(new Error('Conteúdo não encontrado'));
            } else {
              resolve({ deleted: true, id, tipo });
            }
          }
        }
      );
    });
  }

  static async deleteSection(id_secao) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM secoes_tutorial WHERE id_secao = ?`,
        [id_secao],
        function(err) {
          if (err) {
            console.error('[TutoriaisContentService] Erro ao deletar seção:', err);
            reject(err);
          } else {
            if (this.changes === 0) {
              reject(new Error('Seção não encontrada'));
            } else {
              resolve({ deleted: true, id_secao });
            }
          }
        }
      );
    });
  }

  // Adicionar no final do service existente

static async safeDeleteTutorial(id_tutorial) {
    return new Promise(async (resolve, reject) => {
        try {
            // Verifica se o tutorial existe
            const tutorialExists = await new Promise((resolve) => {
                db.get(
                    "SELECT 1 FROM tutoriais WHERE id_tutorial = ?", 
                    [id_tutorial],
                    (err, row) => resolve(!!row)
                );
            });

            if (!tutorialExists) {
                throw new Error("Tutorial não encontrado");
            }

            // Inicia transação
            await new Promise((resolve, reject) => {
                db.run("BEGIN TRANSACTION", (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // 1. Deleta todo o conteúdo do tutorial
            await new Promise((resolve, reject) => {
                db.run(
                    `DELETE FROM secoes_tutorial 
                     WHERE id_tutorial = ?`,
                    [id_tutorial],
                    function(err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            // 2. Deleta o tutorial (não afetará o software devido ao ON DELETE CASCADE)
            const result = await new Promise((resolve, reject) => {
                db.run(
                    `DELETE FROM tutoriais 
                     WHERE id_tutorial = ?`,
                    [id_tutorial],
                    function(err) {
                        if (err) reject(err);
                        else resolve(this.changes);
                    }
                );
            });

            await new Promise((resolve, reject) => {
                db.run("COMMIT", (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            if (result === 0) {
                throw new Error("Nenhum tutorial foi deletado");
            }

            resolve({
                success: true,
                id_tutorial,
                message: "Tutorial deletado com sucesso (software não foi afetado)"
            });

        } catch (error) {
            // Rollback em caso de erro
            await new Promise((resolve) => {
                db.run("ROLLBACK", () => resolve());
            });
            
            console.error("[TutoriaisContentService] Erro no safeDeleteTutorial:", error);
            reject(error);
        }
    });
}

static async tutorialHasContent(id_tutorial) {
    return new Promise((resolve) => {
        db.get(
            `SELECT 1 FROM secoes_tutorial st
             LEFT JOIN conteudo_paragrafo cp ON st.id_secao = cp.id_secao
             LEFT JOIN conteudo_titulo ct ON st.id_secao = ct.id_secao
             LEFT JOIN conteudo_lista cl ON st.id_secao = cl.id_secao
             LEFT JOIN conteudo_imagem ci ON st.id_secao = ci.id_secao
             WHERE st.id_tutorial = ? AND (
                cp.id_paragrafo IS NOT NULL OR
                ct.id_titulo IS NOT NULL OR
                cl.id_item IS NOT NULL OR
                ci.id_imagem IS NOT NULL
             ) LIMIT 1`,
            [id_tutorial],
            (err, row) => resolve(!!row)
        );
    });
}
}



module.exports = TutoriaisContentService;