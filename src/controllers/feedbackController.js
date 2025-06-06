const db = require('../config/db'); // Configuração do banco de dados

// 🔍 Buscar todos os feedbacks
exports.buscarTodosFeedbacks = (req, res) => {
    const query = `
        SELECT id_feedback, tipo_feedback, mensagem, email, data_feedback
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

// 📝 Inserir novo feedback (Agora usando email)
exports.criarFeedback = (req, res) => {
    const { tipo_feedback, mensagem, email } = req.body;

    // Validação: tipo de feedback e email são obrigatórios
    if (!tipo_feedback || !email) {
        return res.status(400).send('Os campos "tipo_feedback" e "email" são obrigatórios.');
    }

    const query = `
        INSERT INTO feedback (tipo_feedback, mensagem, email, data_feedback)
        VALUES (?, ?, ?, CURRENT_DATE)
    `;

    db.run(query, [tipo_feedback, mensagem || null, email], function (err) {
        if (err) {
            console.error('Erro ao inserir feedback:', err);
            res.status(500).send('Erro ao inserir feedback.');
        } else {
            res.status(201).json({
                id_feedback: this.lastID,
                tipo_feedback,
                mensagem,
                email,
                data_feedback: new Date().toISOString().split('T')[0], // Data atual
            });
        }
    });
};