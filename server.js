const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./src/routes/usuariosRoutes'); // Importar rotas de usuários

const app = express();
app.use(cors());
app.use(express.json());

// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('API do Portal de Recursos está funcionando!');
});

// Usar as rotas de usuários
app.use('/usuarios', usuariosRoutes);

//Usar rotas de cursos
const rotasCursos = require('./src/routes/cursosRoutes');

app.use('/cursos', rotasCursos);

//rotas para sites
const sitesRoutes = require('./src/routes/sitesRoutes');
app.use('/sites', sitesRoutes);

//rotas para categorias
const categoriasRoutes = require('./src/routes/categoriasRoutes');
app.use('/categorias', categoriasRoutes);

//categorias secundarias
const categoriasCursosRoutes = require('./src/routes/categoriasCursosRoutes');
app.use('/categoriasCursos', categoriasCursosRoutes);

//feedbacks
const feedbackRoutes = require('./src/routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes); // Rota para feedbacks


//admins
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes); // Rota para login de admins

//softwares
const rotasSoftwares = require('./src/routes/softwaresRoutes');
app.use('/softwares', rotasSoftwares);

//tutoriais
const tutoriaisRoutes = require('./src/routes/tutoriaisRoutes');
app.use('/tutoriais', tutoriaisRoutes);

//avaliacoesComentarios
const rotasAvaliacoes = require('./src/routes/avaliacoesComentariosRoutes');
app.use('/avaliacoesComentarios', rotasAvaliacoes);

//denuncias
const rotasDenuncias = require('./src/routes/denunciasRoutes');
app.use('/denuncias', rotasDenuncias);

//playlistUsuarios
const rotasPlaylists = require('./src/routes/playlistUsuariosRoutes');
app.use('/playlistUsuarios', rotasPlaylists);

//playlistCursos - tabela intermediaria
const rotasPlaylistCursos = require('./src/routes/playlistCursosRoutes');
app.use('/playlistCursos', rotasPlaylistCursos);

const secoesRoutes = require('./src/routes/secoesRoutes');
app.use('/secoes', secoesRoutes);

const conteudoRoutes = require('./src/routes/conteudoRoutes');
app.use('/conteudo', conteudoRoutes);



// Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');


});

//teste
