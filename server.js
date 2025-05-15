const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./src/routes/usuariosRoutes'); // Importar rotas de usuários

const app = express();

app.use(cors({
  origin: true, // Reflete dinamicamente a origin da requisição
  credentials: true // Desative se não estiver usando cookies/sessão
}));

app.use(express.json());

// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('API do Portal de Recursos está funcionando!');
});

// Usar as rotas de usuários
app.use('/usuarios', usuariosRoutes);
const usuariosController = require('./src/controllers/usuariosController');
app.post('/login', usuariosController.loginUsuario);

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
const softwareRoutes = require('./src/routes/softwaresRoutes');
app.use('/softwares', softwareRoutes);

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

// const tutoriaisSecoesRoutes = require('./src/routes/tutoriaisSecoesRoutes');
// app.use('/tutoriais/:id/secoes', tutoriaisSecoesRoutes);

const conteudoRoutes = require('./src/routes/conteudoRoutes');
app.use('/conteudoSoftware', conteudoRoutes);



// Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');


});

//teste
