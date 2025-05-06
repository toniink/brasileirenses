import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Importa o React Router
import HomePage from './pages/Home'; // Importa o arquivo Home.js
import CursoPagina from './pages/CursoPagina'; // Importa o arquivo CursoPagina.js
import CursoDetalhe from './pages/CursoDetalhe'; // importa a pagina de detalhes do curso
import SoftwarePagina from './pages/SoftwarePagina';
import SoftwareDetalhes from './pages/SoftwareDetalhes';
import TutorialGenerico from './pages/TutorialGenerico';
import GerenciarTutorial from './pages/GerenciarTutorial';

const App = () => (
    <Router>
        <Routes>
            {/* Rota para a Home */}
            <Route path="/" element={<HomePage />} />
            {/* Rota para Cursos */}
            <Route path="/cursos" element={<CursoPagina />} />
            {/* Rota para Cursos */}
            <Route path="/cursos/:id" element={<CursoDetalhe />} />
            {/* Rota para Cursos */}
            <Route path="/softwares" element={<SoftwarePagina />} />
            {/* Rota para Cursos */}
            <Route path="/softwares/:id" element={<SoftwareDetalhes />} />
            {/* Rota para Cursos */}
            <Route path="/tutorial/:software" element={<TutorialGenerico />} />
            <Route path="/gerenciar-tutorial" element={<GerenciarTutorial />} />
        </Routes>
    </Router>
);

export default App;
