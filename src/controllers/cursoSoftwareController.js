const db = require('../config/db');

// Associar software a um curso (POST tradicional para novas associações)
exports.associarSoftware = (req, res) => {
    const { id_curso } = req.params;
    const { id_software } = req.body;

    if (!id_curso || !id_software) {
        return res.status(400).json({ error: 'IDs do curso e software são obrigatórios' });
    }

    db.run(
        'INSERT INTO cursos_softwares (id_curso, id_software) VALUES (?, ?)',
        [id_curso, id_software],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Esta associação já existe' });
                }
                console.error('Erro ao associar software:', err);
                res.status(500).json({ error: 'Erro ao associar software ao curso' });
            } else {
                res.status(201).json({ 
                    message: 'Software associado ao curso com sucesso',
                    associationId: this.lastID
                });
            }
        }
    );
};

// Atualizar associação (nova rota PUT para substituição completa)
exports.atualizarAssociacoes = (req, res) => {
    const { id_curso } = req.params;
    const { softwares } = req.body; // Array de IDs de softwares

    if (!id_curso || !Array.isArray(softwares)) {
        return res.status(400).json({ error: 'ID do curso e lista de softwares são obrigatórios' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // 1. Remover todas as associações existentes para o curso
        db.run(
            'DELETE FROM cursos_softwares WHERE id_curso = ?',
            [id_curso],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    console.error('Erro ao limpar associações:', err);
                    return res.status(500).json({ error: 'Erro ao atualizar associações' });
                }

                // 2. Inserir as novas associações
                if (softwares.length === 0) {
                    db.run('COMMIT');
                    return res.json({ message: 'Associações atualizadas com sucesso (nenhum software associado)' });
                }

                const placeholders = softwares.map(() => '(?, ?)').join(',');
                const values = softwares.flatMap(id_software => [id_curso, id_software]);

                db.run(
                    `INSERT INTO cursos_softwares (id_curso, id_software) VALUES ${placeholders}`,
                    values,
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            console.error('Erro ao inserir novas associações:', err);
                            return res.status(500).json({ error: 'Erro ao atualizar associações' });
                        }
                        
                        db.run('COMMIT');
                        res.json({ 
                            message: 'Associações atualizadas com sucesso',
                            totalAssociations: this.changes
                        });
                    }
                );
            }
        );
    });
};

// Remover associação específica
exports.removerAssociacaoSoftware = (req, res) => {
    const { id_curso, id_software } = req.params;

    db.run(
        'DELETE FROM cursos_softwares WHERE id_curso = ? AND id_software = ?',
        [id_curso, id_software],
        function(err) {
            if (err) {
                console.error('Erro ao remover associação:', err);
                res.status(500).json({ error: 'Erro ao remover associação' });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Associação não encontrada' });
            } else {
                res.json({ message: 'Associação removida com sucesso' });
            }
        }
    );
};

// Listar softwares associados
exports.listarSoftwaresDoCurso = (req, res) => {
    const { id_curso } = req.params;

    db.all(
        `SELECT 
            softwares.id_softwares,
            softwares.nome,
            softwares.url,
            softwares.desenvolvedor
        FROM softwares
        JOIN cursos_softwares ON softwares.id_softwares = cursos_softwares.id_software
        WHERE cursos_softwares.id_curso = ?`,
        [id_curso],
        (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar softwares:', err);
                res.status(500).json({ error: 'Erro interno no servidor' });
            } else {
                res.json(resultados || []);
            }
        }
    );
};

// Verificar associação específica (nova rota)
exports.verificarAssociacao = (req, res) => {
    const { id_curso, id_software } = req.params;

    db.get(
        'SELECT 1 FROM cursos_softwares WHERE id_curso = ? AND id_software = ?',
        [id_curso, id_software],
        (err, row) => {
            if (err) {
                console.error('Erro ao verificar associação:', err);
                res.status(500).json({ error: 'Erro interno no servidor' });
            } else {
                res.json({ associado: !!row });
            }
        }
    );
};