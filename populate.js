const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao SQLite com sucesso!');
        popularPlaylistCursos();
    }
});

function popularPlaylistCursos() {
    console.log("Iniciando a inserção de cursos nas playlists...");

    db.run(`INSERT INTO playlistCursos (id_playlist, id_curso) VALUES 
        (1, 2),
        (1, 3),
        (2, 4),
        (2, 5),
        (3, 1),
        (3, 2),
        (4, 5),
        (4, 3),
        (5, 4),
        (5, 1)`, function (err) {
        
        if (err) {
            console.error("Erro ao inserir cursos na playlist:", err);
        } else {
            console.log("Cursos adicionados às playlists com sucesso!");
        }

        // Fechar conexão com o banco
        db.close(() => {
            console.log('Banco de dados atualizado!');
        });
    });
}