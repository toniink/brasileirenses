const db = require('../database');

// Criar software
exports.createSoftware = (req, res) => {
  const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;
  const sql = `INSERT INTO softwares (nome, url, desenvolvedor, id_categoria, id_site)
               VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [nome, url, desenvolvedor, id_categoria, id_site], function (err) {
    if (err) return res.status(500).send(err.message);
    res.send({ id: this.lastID });
  });
};

// Listar todos
exports.getAllSoftwares = (req, res) => {
  db.all(`SELECT * FROM softwares`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
};

// Atualizar
exports.updateSoftware = (req, res) => {
  const { id } = req.params;
  const { nome, url, desenvolvedor, id_categoria, id_site } = req.body;
  const sql = `UPDATE softwares SET nome = ?, url = ?, desenvolvedor = ?, id_categoria = ?, id_site = ? WHERE id_softwares = ?`;
  db.run(sql, [nome, url, desenvolvedor, id_categoria, id_site, id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.send({ message: 'Software atualizado' });
  });
};

// Deletar
exports.deleteSoftware = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM softwares WHERE id_softwares = ?`, [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.send({ message: 'Software excluído' });
  });
};
