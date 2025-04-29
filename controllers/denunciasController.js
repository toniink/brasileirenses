const db = require('../config/db');

// Listar todas as denúncias e trazer detalhes do comentário e usuário associado
exports.buscarTodasDenuncias = (req, res) => {
    db.all(
        `SELECT 
            denuncias.id_denuncia,
            avaliacoesComentarios.comentario AS comentario_denunciado,
            usuarios.nome AS nome_usuario,
            denuncias.data_denuncia
        FROM denuncias
        LEFT JOIN avaliacoesComentarios ON denuncias.id_comentario = avaliacoesComentarios.id_comentario
        LEFT JOIN usuarios ON denuncias.id_usuario = usuarios.idUsuarios`, // Correção aplicada: 'usuarios.idUsuarios'
        [],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar denúncias:', err);
                res.status(500).send('Erro interno no servidor');
            } else {
                res.json(resultados);
            }
        }
    );
};

// Criar uma nova denúncia
exports.criarDenuncia = (req, res) => {
    const { id_comentario, id_usuario } = req.body;

    db.run(
        'INSERT INTO denuncias (id_comentario, id_usuario) VALUES (?, ?)',
        [id_comentario, id_usuario],
        function (err) {
            if (err) {
                console.error('Erro ao registrar denúncia:', err);
                res.status(500).send('Erro ao registrar denúncia');
            } else {
                res.status(201).json({ id_denuncia: this.lastID });
            }
        }
    );
};

// Buscar denúncia por ID e trazer detalhes do comentário e usuário associado
exports.buscarDenunciaPorId = (req, res) => {
    const denunciaID = req.params.id;

    db.get(
        `SELECT 
            denuncias.id_denuncia,
            avaliacoesComentarios.comentario AS comentario_denunciado,
            usuarios.nome AS nome_usuario,
            denuncias.data_denuncia
        FROM denuncias
        LEFT JOIN avaliacoesComentarios ON denuncias.id_comentario = avaliacoesComentarios.id_comentario
        LEFT JOIN usuarios ON denuncias.id_usuario = usuarios.idUsuarios
        WHERE denuncias.id_denuncia = ?`, // Correção aplicada
        [denunciaID],
        (err, linha) => {
            if (err) {
                console.error('Erro ao buscar denúncia:', err);
                res.status(500).send('Erro no servidor');
            } else if (!linha) {
                res.status(404).send('Denúncia não encontrada');
            } else {
                res.json(linha);
            }
        }
    );
};

// Deletar denúncia
exports.excluirDenuncia = (req, res) => {
    const denunciaID = req.params.id;

    db.run('DELETE FROM denuncias WHERE id_denuncia = ?', [denunciaID], function (err) {
        if (err) {
            console.error('Erro ao deletar denúncia:', err);
            res.status(500).send('Erro interno no servidor');
        } else if (this.changes === 0) {
            res.status(404).send('Denúncia não encontrada');
        } else {
            res.send('Denúncia deletada com sucesso!');
        }
    });
};