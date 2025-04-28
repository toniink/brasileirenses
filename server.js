const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuariosRoutes'); // Importar rotas de usuários

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
const rotasCursos = require('./routes/cursosRoutes');

app.use('/cursos', rotasCursos);

//rotas para sites
const sitesRoutes = require('./routes/sitesRoutes');
app.use('/sites', sitesRoutes);

//rotas para categorias
const categoriasRoutes = require('./routes/categoriasRoutes');
app.use('/categorias', categoriasRoutes);

//categorias secundarias
const categoriasCursosRoutes = require('./routes/categoriasCursosRoutes');
app.use('/categoriasCursos', categoriasCursosRoutes);

//feedbacks
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes); // Rota para feedbacks


//admins
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes); // Rota para login de admins

//softwares
const rotasSoftwares = require('./routes/softwaresRoutes');

app.use('/softwares', rotasSoftwares);


// Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');


});
