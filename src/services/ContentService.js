// src/api/services/ContentService.js
const db = require("../config/db");

class ContentService {
  static async getFullContent(id_software) {
    try {
      // Verifica se o software existe
      const softwareExists = await new Promise((resolve) => {
        db.get(
          `SELECT 1 FROM softwares WHERE id_softwares = ?`,
          [id_software],
          (err, row) => resolve(!!row)
        );
      });

      if (!softwareExists) {
        throw new Error(`Software com ID ${id_software} não encontrado`);
      }

      // Busca as seções do software
      const secoes = await new Promise((resolve, reject) => {
        db.all(
          `SELECT id_secao, tipo, ordem 
           FROM software_secoes 
           WHERE id_software = ? 
           ORDER BY ordem`,
          [id_software],
          (err, rows) => {
            if (err) {
              console.error('[ContentService] Erro ao buscar seções:', err);
              reject(err);
            } else {
              
              resolve(rows || []);
            }
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
                tableName = 'software_conteudo_area_atuacao';
                fields = 'id_area as id, titulo, descricao';
                break;
              case 'lista':
                tableName = 'software_conteudo_lista';
                fields = 'id_item as id, item as texto';
                break;
              case 'titulo':
                tableName = 'software_conteudo_titulo';
                fields = 'id_titulo as id, texto';
                break;
              case 'paragrafo':
                tableName = 'software_conteudo_paragrafo';
                fields = 'id_paragrafo as id, texto';
                break;
              default:
                console.warn(`[ContentService] Tipo de seção desconhecido: ${secao.tipo}`);
                return { ...secao, conteudos: [] };
            }

            const conteudos = await new Promise((resolve) => {
              db.all(
                `SELECT ${fields} FROM ${tableName} WHERE id_secao = ?`,
                [secao.id_secao],
                (err, rows) => {
                  if (err) {
                    console.error(`[ContentService] Erro ao buscar conteúdo para seção ${secao.id_secao}:`, err);
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
              idField: secao.tipo === 'area_atuacao' ? 'id_area' :
                      secao.tipo === 'lista' ? 'id_item' :
                      secao.tipo === 'titulo' ? 'id_titulo' : 'id_paragrafo'
            };
          } catch (error) {
            console.error(`[ContentService] Erro no processamento da seção ${secao.id_secao}:`, error);
            return { ...secao, conteudos: [] };
          }
        })
      );

      return contents;
    } catch (error) {
      console.error('[ContentService] Erro geral:', error);
      throw error;
    }
  }

  static async createSection(id_software, tipo, ordem, titulo = null) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO software_secoes (id_software, tipo, ordem) VALUES (?, ?, ?)`,
        [id_software, tipo, ordem],
        function(err) {
          if (err) {
            console.error('[ContentService] Erro ao criar seção:', err);
            reject(err);
          } else {
            const sectionId = this.lastID;
            
            // Se for um título, cria o conteúdo automaticamente
            if (tipo === 'titulo' && titulo) {
              db.run(
                `INSERT INTO software_conteudo_titulo (id_secao, texto) VALUES (?, ?)`,
                [sectionId, titulo],
                function(err) {
                  if (err) {
                    console.error('[ContentService] Erro ao criar conteúdo de título:', err);
                    // Ainda retorna a seção mesmo se falhar ao criar o título
                    resolve({
                      id_secao: sectionId,
                      id_software,
                      tipo,
                      ordem,
                      conteudos: []
                    });
                  } else {
                    resolve({
                      id_secao: sectionId,
                      id_software,
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
                id_software,
                tipo,
                ordem,
                conteudos: []
              });
            }
          }
        }
      );
    });
  }

  static async addContent(id_secao, tipo, conteudo) {
    return new Promise((resolve, reject) => {
      // Primeiro verifica se a seção existe
      db.get(
        `SELECT id_secao, tipo FROM software_secoes WHERE id_secao = ?`,
        [id_secao],
        (err, secao) => {
          if (err) {
            console.error('[ContentService] Erro ao verificar seção:', err);
            return reject(err);
          }

          if (!secao) {
            return reject(new Error('Seção não encontrada'));
          }

          if (secao.tipo !== tipo) {
            return reject(new Error(`Tipo de conteúdo (${tipo}) não corresponde ao tipo da seção (${secao.tipo})`));
          }

          let tableName, fields, values, placeholders;
          
          switch(tipo) {
            case 'area_atuacao':
              tableName = 'software_conteudo_area_atuacao';
              fields = ['id_secao', 'titulo', 'descricao'];
              values = [id_secao, conteudo.titulo, conteudo.descricao];
              break;
            case 'lista':
              tableName = 'software_conteudo_lista';
              fields = ['id_secao', 'item'];
              values = [id_secao, conteudo.item];
              break;
            case 'titulo':
              tableName = 'software_conteudo_titulo';
              fields = ['id_secao', 'texto'];
              values = [id_secao, conteudo.texto];
              break;
            case 'paragrafo':
              tableName = 'software_conteudo_paragrafo';
              fields = ['id_secao', 'texto'];
              values = [id_secao, conteudo.texto];
              break;
            default:
              return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
          }

          placeholders = fields.map(() => '?').join(', ');

          db.run(
            `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
            values,
            function(err) {
              if (err) {
                console.error('[ContentService] Erro ao adicionar conteúdo:', err);
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
    });
  }

  static async getSections(id_software) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id_secao, 
          tipo, 
          ordem,
          (SELECT COUNT(*) FROM software_conteudo_titulo WHERE id_secao = software_secoes.id_secao) AS has_content
         FROM software_secoes 
         WHERE id_software = ? 
         ORDER BY ordem`,
        [id_software],
        (err, rows) => {
          if (err) {
            console.error('[ContentService] Erro ao buscar seções:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async deleteContent(tipo, id) {
    return new Promise((resolve, reject) => {
      let tableName;
      
      switch(tipo) {
        case 'area_atuacao':
          tableName = 'software_conteudo_area_atuacao';
          break;
        case 'lista':
          tableName = 'software_conteudo_lista';
          break;
        case 'titulo':
          tableName = 'software_conteudo_titulo';
          break;
        case 'paragrafo':
          tableName = 'software_conteudo_paragrafo';
          break;
        default:
          return reject(new Error(`Tipo de conteúdo inválido: ${tipo}`));
      }

      db.run(
        `DELETE FROM ${tableName} WHERE id = ?`,
        [id],
        function(err) {
          if (err) {
            console.error('[ContentService] Erro ao deletar conteúdo:', err);
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

module.exports = ContentService;