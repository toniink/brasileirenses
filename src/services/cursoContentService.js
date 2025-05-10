// src/api/services/cursoContentService.js
const db = require("../config/db");

class CursoContentService {
  static async getFullContent(id_curso) {
    try {
      // 1. Verifica se o curso existe na tabela cursos (com id_cursos)
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

      // 2. Busca as seções do curso
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

      // 3. Para cada seção, busca seu conteúdo específico
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
                console.warn(`[CursoContentService] Tipo de seção desconhecido: ${secao.tipo}`);
                return { ...secao, conteudos: [] };
            }

            const conteudos = await new Promise((resolve) => {
              db.all(
                `SELECT ${fields} FROM ${tableName} WHERE id_secao_curso = ? ORDER BY ${secao.tipo === 'passo_a_passo' ? 'numero' : 'id'}`,
                [secao.id_secao_curso],
                (err, rows) => {
                  if (err) {
                    console.error(`[CursoContentService] Erro ao buscar conteúdo para seção ${secao.id_secao_curso}:`, err);
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
              idField: secao.tipo === 'area_atuacao' ? 'id_area_curso' :
                      secao.tipo === 'lista' ? 'id_item_curso' :
                      secao.tipo === 'titulo' ? 'id_titulo_curso' : 
                      secao.tipo === 'paragrafo' ? 'id_paragrafo_curso' : 'id_passo_curso'
            };
          } catch (error) {
            console.error(`[CursoContentService] Erro no processamento da seção ${secao.id_secao_curso}:`, error);
            return { ...secao, conteudos: [] };
          }
        })
      );

      return contents;
    } catch (error) {
      console.error('[CursoContentService] Erro geral:', error);
      throw error;
    }
  }

  static async createSection(id_curso, tipo, ordem, titulo = null) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se o curso existe na tabela cursos (com id_cursos)
      db.get(
        "SELECT 1 FROM cursos WHERE id_cursos = ?",
        [id_curso],
        (err, row) => {
          if (err) {
            console.error('[CursoContentService] Erro ao verificar curso:', err);
            return reject(err);
          }

          if (!row) {
            return reject(new Error(`Curso com ID ${id_curso} não encontrado`));
          }

          // Cria a seção
          db.run(
            `INSERT INTO curso_secoes (id_curso, tipo, ordem) VALUES (?, ?, ?)`,
            [id_curso, tipo, ordem],
            function(err) {
              if (err) {
                console.error('[CursoContentService] Erro ao criar seção:', err);
                reject(err);
              } else {
                const sectionId = this.lastID;
                
                // Se for um título, cria o conteúdo automaticamente
                if (tipo === 'titulo' && titulo) {
                  db.run(
                    `INSERT INTO curso_conteudo_titulo (id_secao_curso, texto) VALUES (?, ?)`,
                    [sectionId, titulo],
                    function(err) {
                      if (err) {
                        console.error('[CursoContentService] Erro ao criar conteúdo de título:', err);
                        resolve({
                          id_secao_curso: sectionId,
                          id_curso,
                          tipo,
                          ordem,
                          conteudos: []
                        });
                      } else {
                        resolve({
                          id_secao_curso: sectionId,
                          id_curso,
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
                    id_secao_curso: sectionId,
                    id_curso,
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

  static async addContent(id_secao_curso, tipo, conteudo) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se a seção existe
      db.get(
        `SELECT id_secao_curso, tipo, id_curso FROM curso_secoes WHERE id_secao_curso = ?`,
        [id_secao_curso],
        (err, secao) => {
          if (err) {
            console.error('[CursoContentService] Erro ao verificar seção:', err);
            return reject(err);
          }

          if (!secao) {
            return reject(new Error('Seção não encontrada'));
          }

          // Verifica se o curso associado à seção ainda existe
          db.get(
            "SELECT 1 FROM cursos WHERE id_cursos = ?",
            [secao.id_curso],
            (err, row) => {
              if (err) {
                console.error('[CursoContentService] Erro ao verificar curso:', err);
                return reject(err);
              }

              if (!row) {
                return reject(new Error('Curso associado à seção não encontrado'));
              }

              if (secao.tipo !== tipo) {
                return reject(new Error(`Tipo de conteúdo (${tipo}) não corresponde ao tipo da seção (${secao.tipo})`));
              }

              let tableName, fields, values;
              
              switch(tipo) {
                case 'area_atuacao':
                  tableName = 'curso_conteudo_area_atuacao';
                  fields = ['id_secao_curso', 'titulo', 'descricao'];
                  values = [id_secao_curso, conteudo.titulo, conteudo.descricao];
                  break;
                case 'lista':
                  tableName = 'curso_conteudo_lista';
                  fields = ['id_secao_curso', 'item'];
                  values = [id_secao_curso, conteudo.item];
                  break;
                case 'titulo':
                  tableName = 'curso_conteudo_titulo';
                  fields = ['id_secao_curso', 'texto'];
                  values = [id_secao_curso, conteudo.texto];
                  break;
                case 'paragrafo':
                  tableName = 'curso_conteudo_paragrafo';
                  fields = ['id_secao_curso', 'texto'];
                  values = [id_secao_curso, conteudo.texto];
                  break;
                case 'passo_a_passo':
                  tableName = 'curso_conteudo_passo';
                  fields = ['id_secao_curso', 'numero', 'instrucao', 'imagem'];
                  values = [id_secao_curso, conteudo.numero, conteudo.instrucao, conteudo.imagem || null];
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
                    console.error('[CursoContentService] Erro ao adicionar conteúdo:', err);
                    reject(err);
                  } else {
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
        }
      );
    });
  }

  static async getSections(id_curso) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se o curso existe na tabela cursos (com id_cursos)
      db.get(
        "SELECT 1 FROM cursos WHERE id_cursos = ?",
        [id_curso],
        (err, row) => {
          if (err) {
            console.error('[CursoContentService] Erro ao verificar curso:', err);
            return reject(err);
          }

          if (!row) {
            return reject(new Error(`Curso com ID ${id_curso} não encontrado`));
          }

          // Busca as seções
          db.all(
            `SELECT 
              id_secao_curso, 
              tipo, 
              ordem,
              (SELECT COUNT(*) FROM curso_conteudo_titulo WHERE id_secao_curso = curso_secoes.id_secao_curso) AS has_content
             FROM curso_secoes 
             WHERE id_curso = ? 
             ORDER BY ordem`,
            [id_curso],
            (err, rows) => {
              if (err) {
                console.error('[CursoContentService] Erro ao buscar seções:', err);
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

  static async deleteContent(tipo, id) {
    return new Promise((resolve, reject) => {
      let tableName;
      
      switch(tipo) {
        case 'area_atuacao':
          tableName = 'curso_conteudo_area_atuacao';
          break;
        case 'lista':
          tableName = 'curso_conteudo_lista';
          break;
        case 'titulo':
          tableName = 'curso_conteudo_titulo';
          break;
        case 'paragrafo':
          tableName = 'curso_conteudo_paragrafo';
          break;
        case 'passo_a_passo':
          tableName = 'curso_conteudo_passo';
          break;
        default:
          return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
      }

      db.run(
        `DELETE FROM ${tableName} WHERE id = ?`,
        [id],
        function(err) {
          if (err) {
            console.error('[CursoContentService] Erro ao deletar conteúdo:', err);
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
}

module.exports = CursoContentService;