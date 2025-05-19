// src/api/controllers/SoftwareController.js
const db = require("../config/db");
const ContentService = require("../services/ContentService");

class SoftwareController {
  // 🚀 Métodos CRUD para Softwares
  async listAll(req, res) {
    try {
      await db.get("SELECT 1");
      
      const softwares = await new Promise((resolve, reject) => {
        db.all(
          `SELECT 
            s.id_softwares,
            s.nome,
            s.url,
            s.imagem_url,
            s.desenvolvedor,
            c.nome AS nome_categoria,
            st.nome AS nome_site
          FROM softwares s
          LEFT JOIN categorias c ON s.id_categoria = c.id_categorias
          LEFT JOIN sites st ON s.id_site = st.id_site`,
          [],
          (err, rows) => {
            if (err) {
              console.error('Erro na query:', err);
              reject(err);
            } else {
              resolve(rows);
            }
          }
        );
      });

      if (!softwares || softwares.length === 0) {
        console.warn('Nenhum software encontrado no banco de dados');
        return res.status(404).json({ message: "Nenhum software encontrado" });
      }

      res.json(softwares);
    } catch (err) {
      console.error("Erro ao buscar softwares:", err);
      res.status(500).json({ 
        error: "Erro interno no servidor",
        details: err.message 
      });
    }
  }

  async create(req, res) {
  const { nome, url, imagem_url, desenvolvedor, id_categoria, id_site } = req.body;

  if (!nome) {
    return res.status(400).json({ 
      error: "Nome do software é obrigatório"
    });
  }

  try {
    // Verificar se as chaves estrangeiras existem
    if (id_categoria) {
      const categoriaExists = await new Promise((resolve) => {
        db.get("SELECT 1 FROM categorias WHERE id_categorias = ?", [id_categoria], (err, row) => {
          resolve(!!row);
        });
      });
      
      if (!categoriaExists) {
        return res.status(400).json({ error: "Categoria não encontrada" });
      }
    }

    if (id_site) {
      const siteExists = await new Promise((resolve) => {
        db.get("SELECT 1 FROM sites WHERE id_site = ?", [id_site], (err, row) => {
          resolve(!!row);
        });
      });
      
      if (!siteExists) {
        return res.status(400).json({ error: "Site não encontrado" });
      }
    }

    // Inserir o software
    const { lastID } = await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO softwares (nome, url, imagem_url, desenvolvedor, id_categoria, id_site) VALUES (?, ?, ?, ?, ?)",
        [nome, url, imagem_url, desenvolvedor, id_categoria || null, id_site || null],
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });

    res.status(201).json({ 
      id_softwares: lastID,
      message: "Software criado com sucesso" 
    });

  } catch (err) {
    console.error("Erro ao criar software:", err);
    
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ 
        error: "Violação de restrição no banco de dados",
        details: err.message 
      });
    }
    
    res.status(500).json({ 
      error: "Erro ao criar software",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

  async getById(req, res) {
    const softwareID = Number(req.params.id);

    if (isNaN(softwareID)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      const software = await new Promise((resolve, reject) => {
        db.get(
          `SELECT 
            s.id_softwares,
            s.nome,
            s.url,
            s.imagem_url,
            s.desenvolvedor,
            c.nome AS nome_categoria,
            st.nome AS nome_site
          FROM softwares s
          LEFT JOIN categorias c ON s.id_categoria = c.id_categorias
          LEFT JOIN sites st ON s.id_site = st.id_site
          WHERE s.id_softwares = ?`,
          [softwareID],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!software) {
        return res.status(404).json({ error: "Software não encontrado" });
      }

      res.json(software);
    } catch (err) {
      console.error("Erro ao buscar software:", err);
      res.status(500).json({ error: "Erro no servidor" });
    }
  }

  async update(req, res) {
    const softwareID = Number(req.params.id);
    const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;

    if (isNaN(softwareID)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (!nome || !id_categoria || !id_site) {
      return res.status(400).json({ 
        error: "Campos obrigatórios faltando",
        required: ["nome", "id_categoria", "id_site"]
      });
    }

    try {
      const { changes } = await db.run(
        "UPDATE softwares SET nome = ?, url = ?, imagem_url = ?, desenvolvedor = ?, id_categoria = ?, id_site = ? WHERE id_softwares = ?",
        [nome, url, imagem_url, desenvolvedor, id_categoria, id_site, softwareID]
      );

      if (changes === 0) {
        return res.status(404).json({ error: "Software não encontrado" });
      }

      res.json({ message: "Software atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar software:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  async delete(req, res) {
    const softwareID = Number(req.params.id);

    if (isNaN(softwareID)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      const { changes } = await db.run(
        "DELETE FROM softwares WHERE id_softwares = ?",
        [softwareID]
      );

      if (changes === 0) {
        return res.status(404).json({ error: "Software não encontrado" });
      }

      res.json({ message: "Software deletado com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar software:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  // 🎨 Métodos do CMS - Totalmente revisados
async getContentBySoftware(req, res) {
  try {
    const softwareId = parseInt(req.params.id);
    
    if (!softwareId || isNaN(softwareId)) {
      return res.status(400).json({ error: "ID do software inválido" });
    }

    // Verifica se o software existe
    const softwareExists = await new Promise((resolve) => {
      db.get("SELECT 1 FROM softwares WHERE id_softwares = ?", [softwareId], (err, row) => {
        resolve(!!row);
      });
    });

    if (!softwareExists) {
      return res.status(404).json({ error: "Software não encontrado" });
    }

    const content = await ContentService.getFullContent(softwareId);
    
    // Garante que sempre retorne um array, mesmo que vazio
    const contentArray = Array.isArray(content) ? content : [];
    
    res.json(contentArray);

  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    res.status(500).json({ 
      error: "Erro ao buscar conteúdo",
      details: error.message
    });
  }
}

  async createSection(req, res) {
    try {
      const softwareId = parseInt(req.params.id);
      const { tipo, ordem, titulo } = req.body;

      if (!softwareId || isNaN(softwareId)) {
        return res.status(400).json({ error: "ID do software inválido" });
      }

      if (!tipo || ordem === undefined) {
        return res.status(400).json({ 
          error: "Campos obrigatórios faltando",
          required: ["tipo", "ordem"],
          received: req.body
        });
      }

      // Verifica se o software existe
      const softwareExists = await new Promise((resolve) => {
        db.get("SELECT 1 FROM softwares WHERE id_softwares = ?", [softwareId], (err, row) => {
          resolve(!!row);
        });
      });

      if (!softwareExists) {
        return res.status(404).json({ error: "Software não encontrado" });
      }

      // Cria a seção
      const sectionId = await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO software_secoes (id_software, tipo, ordem) VALUES (?, ?, ?)",
          [softwareId, tipo, ordem],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });

      // Se for um título e foi fornecido texto, cria o conteúdo automaticamente
      if (tipo === 'titulo' && titulo) {
        await db.run(
          "INSERT INTO software_conteudo_titulo (id_secao, texto) VALUES (?, ?)",
          [sectionId, titulo]
        );
      }

      res.status(201).json({
        id_secao: sectionId,
        id_software: softwareId,
        tipo,
        ordem,
        message: "Seção criada com sucesso"
      });

    } catch (error) {
      console.error("Erro ao criar seção:", error);
      res.status(500).json({ 
        error: "Erro ao criar seção",
        details: error.message
      });
    }
  }

  async addContent(req, res) {
    try {
      
      const { id_secao, tipo, ...conteudo } = req.body;

      if (!id_secao || !tipo) {
        return res.status(400).json({ 
          error: "Campos obrigatórios faltando",
          required: ["id_secao", "tipo"],
          received: req.body
        });
      }

      // Verifica se a seção existe e se o tipo corresponde
      const secao = await new Promise((resolve, reject) => {
        db.get(
          "SELECT id_secao, tipo FROM software_secoes WHERE id_secao = ?",
          [id_secao],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!secao) {
        return res.status(404).json({ error: "Seção não encontrada" });
      }

      if (secao.tipo !== tipo) {
        return res.status(400).json({ 
          error: "Tipo de conteúdo não corresponde ao tipo da seção",
          sectionType: secao.tipo,
          contentType: tipo
        });
      }

      let tableName, fields, values;

      switch(tipo) {
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
        default:
          return res.status(400).json({ error: "Tipo de conteúdo inválido" });
      }

      // Insere o conteúdo
      const result = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
          values,
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
          }
        );
      });

      res.status(201).json({
        id: result.id,
        id_secao,
        tipo,
        ...conteudo,
        message: "Conteúdo adicionado com sucesso"
      });

    } catch (error) {
      console.error("Erro ao adicionar conteúdo:", error);
      res.status(500).json({ 
        error: "Erro ao adicionar conteúdo",
        details: error.message
      });
    }
  }

  async getSections(req, res) {
    try {
      const softwareId = parseInt(req.params.id);
      
      if (!softwareId || isNaN(softwareId)) {
        return res.status(400).json({ error: "ID do software inválido" });
      }

      // Verifica se o software existe
      const softwareExists = await new Promise((resolve) => {
        db.get("SELECT 1 FROM softwares WHERE id_softwares = ?", [softwareId], (err, row) => {
          resolve(!!row);
        });
      });

      if (!softwareExists) {
        return res.status(404).json({ error: "Software não encontrado" });
      }

      const sections = await new Promise((resolve, reject) => {
        db.all(
          `SELECT 
            s.id_secao,
            s.tipo,
            s.ordem,
            CASE 
              WHEN s.tipo = 'titulo' THEN (SELECT COUNT(*) FROM software_conteudo_titulo WHERE id_secao = s.id_secao)
              WHEN s.tipo = 'paragrafo' THEN (SELECT COUNT(*) FROM software_conteudo_paragrafo WHERE id_secao = s.id_secao)
              WHEN s.tipo = 'area_atuacao' THEN (SELECT COUNT(*) FROM software_conteudo_area_atuacao WHERE id_secao = s.id_secao)
              WHEN s.tipo = 'lista' THEN (SELECT COUNT(*) FROM software_conteudo_lista WHERE id_secao = s.id_secao)
              ELSE 0
            END AS conteudos_count
          FROM software_secoes s
          WHERE s.id_software = ?
          ORDER BY s.ordem`,
          [softwareId],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
          }
        );
      });

      res.json(sections);

    } catch (error) {
      console.error("Erro ao buscar seções:", error);
      res.status(500).json({ 
        error: "Erro ao buscar seções",
        details: error.message
      });
    }
  }

  async deleteContent(req, res) {
    try {
      const { tipo, id } = req.params;
      
      if (!tipo || !id) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
      }

      let tableName;
      switch(tipo) {
        case 'titulo':
          tableName = 'software_conteudo_titulo';
          break;
        case 'paragrafo':
          tableName = 'software_conteudo_paragrafo';
          break;
        case 'area_atuacao':
          tableName = 'software_conteudo_area_atuacao';
          break;
        case 'lista':
          tableName = 'software_conteudo_lista';
          break;
        default:
          return res.status(400).json({ error: "Tipo de conteúdo inválido" });
      }

      const result = await new Promise((resolve, reject) => {
        db.run(
          `DELETE FROM ${tableName} WHERE id = ?`,
          [id],
          function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
          }
        );
      });

      if (result.changes === 0) {
        return res.status(404).json({ error: "Conteúdo não encontrado" });
      }

      res.json({ 
        message: "Conteúdo excluído com sucesso",
        id,
        tipo
      });

    } catch (error) {
      console.error("Erro ao excluir conteúdo:", error);
      res.status(500).json({ 
        error: "Erro ao excluir conteúdo",
        details: error.message
      });
    }
  }
  async listByCategory(req, res) {
    const categoriaId = req.query.categoria;
    
    if (!categoriaId) {
        return res.status(400).json({ error: "ID da categoria é obrigatório" });
    }

    try {
        const softwares = await new Promise((resolve, reject) => {
            db.all(
                `SELECT 
                    s.id_softwares,
                    s.nome,
                    s.url,
                    s.desenvolvedor,
                    c.nome AS nome_categoria
                FROM softwares s
                LEFT JOIN categorias c ON s.id_categoria = c.id_categorias
                WHERE s.id_categoria = ?`,
                [categoriaId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        res.json(softwares || []);
    } catch (err) {
        console.error('Erro ao buscar softwares por categoria:', err);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}
}

module.exports = new SoftwareController();