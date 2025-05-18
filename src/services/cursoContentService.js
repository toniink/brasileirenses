// src/api/services/cursoContentService.js
const db = require("../config/db");

class CursoContentService {
  static async getFullContent(id_curso) {
    try {
      // Verifica se o curso existe
      const cursoExists = await new Promise((resolve) => {
        db.get(
          "SELECT 1 FROM cursos WHERE id_cursos = ?", 
          [id_curso],
          (err, row) => resolve(!!row)
        );
      });

      if (!cursoExists) {
        throw new Error(`Curso com ID ${id_curso} não encontrado`);
      }

      // Busca as seções do curso
      const secoes = await new Promise((resolve, reject) => {
        db.all(
          `SELECT id_secao_curso, tipo, ordem 
           FROM curso_secoes 
           WHERE id_curso = ? 
           ORDER BY ordem`,
          [id_curso],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
          }
        );
      });

      // Para cada seção, busca seu conteúdo específico
      const contents = await Promise.all(
        secoes.map(async (secao) => {
          try {
            let tableName, fields;
            
            switch(secao.tipo) {
              case 'area_atuacao':
                tableName = 'curso_conteudo_area_atuacao';
                fields = 'id_area_curso as id, titulo, descricao';
                break;
              case 'lista':
                tableName = 'curso_conteudo_lista';
                fields = 'id_item_curso as id, item as texto';
                break;
              case 'titulo':
                tableName = 'curso_conteudo_titulo';
                fields = 'id_titulo_curso as id, texto';
                break;
              case 'paragrafo':
                tableName = 'curso_conteudo_paragrafo';
                fields = 'id_paragrafo_curso as id, texto';
                break;
              case 'passo_a_passo':
                tableName = 'curso_conteudo_passo';
                fields = 'id_passo_curso as id, numero, instrucao, imagem';
                break;
              default:
                console.warn(`Tipo de seção desconhecido: ${secao.tipo}`);
                return { ...secao, conteudos: [] };
            }

            const conteudos = await new Promise((resolve) => {
              db.all(
                `SELECT ${fields} FROM ${tableName} WHERE id_secao_curso = ? ORDER BY ${secao.tipo === 'passo_a_passo' ? 'numero' : 'id'}`,
                [secao.id_secao_curso],
                (err, rows) => {
                  if (err) {
                    console.error(`Erro ao buscar conteúdo para seção ${secao.id_secao_curso}:`, err);
                    resolve([]);
                  } else {
                    resolve(rows || []);
                  }
                }
              );
            });

            return { 
              ...secao, 
              conteudos
            };
          } catch (error) {
            console.error(`Erro no processamento da seção ${secao.id_secao_curso}:`, error);
            return { ...secao, conteudos: [] };
          }
        })
      );

      return contents;
    } catch (error) {
      console.error('Erro geral:', error);
      throw error;
    }
  }

  static async createSection(id_curso, tipo, ordem, titulo = null) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO curso_secoes (id_curso, tipo, ordem) VALUES (?, ?, ?)`,
        [id_curso, tipo, ordem],
        function(err) {
          if (err) {
            console.error('Erro ao criar seção:', err);
            reject(err);
          } else {
            resolve({
              id_secao_curso: this.lastID,
              id_curso,
              tipo,
              ordem
            });
          }
        }
      );
    });
  }

  static async addContent(id_secao_curso, tipo, conteudo) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se a seção existe e se o tipo bate
      db.get(
        `SELECT id_secao_curso, tipo FROM curso_secoes WHERE id_secao_curso = ?`,
        [id_secao_curso],
        (err, secao) => {
          if (err) return reject(err);
          if (!secao) return reject(new Error('Seção não encontrada'));
          if (secao.tipo !== tipo) {
            return reject(new Error(`Tipo de conteúdo (${tipo}) não corresponde ao tipo da seção (${secao.tipo})`));
          }

          let tableName, fields, values;
          
          switch(tipo) {
            case 'area_atuacao':
              tableName = 'curso_conteudo_area_atuacao';
              fields = ['id_secao_curso', 'titulo', 'descricao'];
              values = [id_secao_curso, conteudo.titulo || '', conteudo.descricao || ''];
              break;
            case 'lista':
              tableName = 'curso_conteudo_lista';
              fields = ['id_secao_curso', 'item'];
              values = [id_secao_curso, conteudo.item || ''];
              break;
            case 'titulo':
              tableName = 'curso_conteudo_titulo';
              fields = ['id_secao_curso', 'texto'];
              values = [id_secao_curso, conteudo.texto || ''];
              break;
            case 'paragrafo':
              tableName = 'curso_conteudo_paragrafo';
              fields = ['id_secao_curso', 'texto'];
              values = [id_secao_curso, conteudo.texto || ''];
              break;
            case 'passo_a_passo':
              tableName = 'curso_conteudo_passo';
              fields = ['id_secao_curso', 'numero', 'instrucao', 'imagem'];
              values = [
                id_secao_curso, 
                conteudo.numero || 0, 
                conteudo.instrucao || '', 
                conteudo.imagem || null
              ];
              break;
            default:
              return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
          }

          const placeholders = fields.map(() => '?').join(', ');
          const query = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`;

          console.log('Executando query:', query);
          console.log('Com valores:', values);

          db.run(
            query,
            values,
            function(err) {
              if (err) {
                console.error('Erro ao adicionar conteúdo:', err);
                reject(err);
              } else {
                console.log('Conteúdo adicionado com sucesso. ID:', this.lastID);
                resolve({
                  id: this.lastID,
                  id_secao_curso,
                  tipo,
                  ...conteudo
                });
              }
            }
          );
        }
      );
    });
  }

  static async getSections(id_curso) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id_secao_curso, 
          tipo, 
          ordem
         FROM curso_secoes 
         WHERE id_curso = ? 
         ORDER BY ordem`,
        [id_curso],
        (err, rows) => {
          if (err) {
            console.error('Erro ao buscar seções:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async deleteContentItem(tipo, id) {
    return new Promise((resolve, reject) => {
      let tableName, idField;
      
      switch(tipo) {
        case 'area_atuacao':
          tableName = 'curso_conteudo_area_atuacao';
          idField = 'id_area_curso';
          break;
        case 'lista':
          tableName = 'curso_conteudo_lista';
          idField = 'id_item_curso';
          break;
        case 'titulo':
          tableName = 'curso_conteudo_titulo';
          idField = 'id_titulo_curso';
          break;
        case 'paragrafo':
          tableName = 'curso_conteudo_paragrafo';
          idField = 'id_paragrafo_curso';
          break;
        case 'passo_a_passo':
          tableName = 'curso_conteudo_passo';
          idField = 'id_passo_curso';
          break;
        default:
          return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
      }

      db.run(
        `DELETE FROM ${tableName} WHERE ${idField} = ?`,
        [id],
        function(err) {
          if (err) {
            console.error('Erro ao deletar item de conteúdo:', err);
            reject(err);
          } else {
            if (this.changes === 0) {
              reject(new Error('Item de conteúdo não encontrado'));
            } else {
              resolve({ 
                success: true,
                message: 'Item de conteúdo deletado com sucesso',
                tipo,
                id
              });
            }
          }
        }
      );
    });
  }

  static async deleteSection(id_secao_curso) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Primeiro deleta todos os conteúdos da seção
        const queries = [
          "DELETE FROM curso_conteudo_titulo WHERE id_secao_curso = ?",
          "DELETE FROM curso_conteudo_area_atuacao WHERE id_secao_curso = ?",
          "DELETE FROM curso_conteudo_paragrafo WHERE id_secao_curso = ?",
          "DELETE FROM curso_conteudo_lista WHERE id_secao_curso = ?",
          "DELETE FROM curso_conteudo_passo WHERE id_secao_curso = ?"
        ];

        Promise.all(queries.map(query => {
          return new Promise((resolve, reject) => {
            db.run(query, [id_secao_curso], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }))
        .then(() => {
          // Depois deleta a seção em si
          db.run(
            "DELETE FROM curso_secoes WHERE id_secao_curso = ?",
            [id_secao_curso],
            function(err) {
              if (err) {
                db.run("ROLLBACK");
                reject(err);
              } else {
                db.run("COMMIT");
                resolve({
                  success: true,
                  message: 'Seção e seu conteúdo deletados com sucesso',
                  id_secao_curso
                });
              }
            }
          );
        })
        .catch(err => {
          db.run("ROLLBACK");
          reject(err);
        });
      });
    });
  }

  static async deleteAllCourseContent(id_curso) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // 1. Obter todas as seções do curso
        db.all(
          "SELECT id_secao_curso FROM curso_secoes WHERE id_curso = ?",
          [id_curso],
          (err, secoes) => {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }

            // 2. Para cada seção, deletar seu conteúdo
            const deletePromises = secoes.map(secao => {
              return new Promise((resolve, reject) => {
                const queries = [
                  "DELETE FROM curso_conteudo_titulo WHERE id_secao_curso = ?",
                  "DELETE FROM curso_conteudo_area_atuacao WHERE id_secao_curso = ?",
                  "DELETE FROM curso_conteudo_paragrafo WHERE id_secao_curso = ?",
                  "DELETE FROM curso_conteudo_lista WHERE id_secao_curso = ?",
                  "DELETE FROM curso_conteudo_passo WHERE id_secao_curso = ?"
                ];

                Promise.all(queries.map(query => {
                  return new Promise((resolve, reject) => {
                    db.run(query, [secao.id_secao_curso], (err) => {
                      if (err) reject(err);
                      else resolve();
                    });
                  });
                }))
                .then(resolve)
                .catch(reject);
              });
            });

            Promise.all(deletePromises)
              .then(() => {
                // 3. Deletar as seções do curso
                db.run(
                  "DELETE FROM curso_secoes WHERE id_curso = ?",
                  [id_curso],
                  function(err) {
                    if (err) {
                      db.run("ROLLBACK");
                      reject(err);
                    } else {
                      db.run("COMMIT");
                      resolve({
                        success: true,
                        message: 'Todo o conteúdo do curso foi deletado',
                        id_curso,
                        secoesDeletadas: this.changes
                      });
                    }
                  }
                );
              })
              .catch(err => {
                db.run("ROLLBACK");
                reject(err);
              });
          }
        );
      });
    });
  }
}

module.exports = CursoContentService;