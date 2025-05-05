const db = require('../config/db'); // Configuração do banco de dados
const bcrypt = require('bcrypt');  // Importa bcrypt para comparação de senha

// Verificar credenciais de admin
exports.loginAdmin = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('Email e senha são obrigatórios.');
    }

    const query = `
        SELECT * FROM admin
        WHERE email = ?
    `;

    db.get(query, [email], async (err, admin) => {
        if (err) {
            console.error('Erro ao buscar admin:', err);
            res.status(500).send('Erro interno no servidor.');
        } else if (!admin) {
            res.status(401).send('Credenciais inválidas.');
        } else {
            // Compara a senha fornecida com o hash armazenado no banco
            const match = await bcrypt.compare(senha, admin.senha);
            if (match) {
                res.status(200).json({ mensagem: 'Login realizado com sucesso!' });
            } else {
                res.status(401).send('Credenciais inválidas.');
            }
        }
    });
};
