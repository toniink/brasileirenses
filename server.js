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


// Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');
});
