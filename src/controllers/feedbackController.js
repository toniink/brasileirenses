const db = require('../config/db'); // Configuração do banco de dados

// Buscar todos os feedbacks
exports.buscarTodosFeedbacks = (req, res) => {
    const query = `
        SELECT id_feedback, id_usuario, tipo_feedback, mensagem, data_feedback
        FROM feedback
        ORDER BY data_feedback DESC
    `;

    db.all(query, [], (err, feedbacks) => {
        if (err) {
            console.error('Erro ao buscar feedbacks:', err);
            res.status(500).send('Erro interno no servidor.');
        } else {
            res.json(feedbacks);
        }
    });
};

// Inserir novo feedback
exports.criarFeedback = (req, res) => {
    const { id_usuario, tipo_feedback, mensagem } = req.body;

    if (!id_usuario || !tipo_feedback) {
        return res.status(400).send('Os campos "id_usuario" e "tipo_feedback" são obrigatórios.');
    }

    const query = `
        INSERT INTO feedback (id_usuario, tipo_feedback, mensagem)
        VALUES (?, ?, ?)
    `;

    db.run(query, [id_usuario, tipo_feedback, mensagem || null], function (err) {
        if (err) {
            console.error('Erro ao inserir feedback:', err);
            res.status(500).send('Erro ao inserir feedback.');
        } else {
            res.status(201).json({
                id_feedback: this.lastID,
                id_usuario,
                tipo_feedback,
                mensagem,
                data_feedback: new Date().toISOString().split('T')[0], // Data atual
            });
        }
    });
};
