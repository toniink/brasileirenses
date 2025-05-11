import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './pages/components/ui/Loading';

// Rotas públicas (carregamento imediato)
import HomePage from './pages/Home';
import CursoPagina from './pages/CursoPagina';
import SoftwarePagina from './pages/SoftwarePagina';

// Rotas públicas com lazy loading
const CursoDetalhe = lazy(() => import('./pages/CursoDetalhe'));
const SoftwareDetalhes = lazy(() => import('./pages/SoftwareDetalhes'));
const TutorialGenerico = lazy(() => import('./pages/TutorialGenerico'));

// Rotas de gerenciamento (lazy loading individual)
const DashboardGerenciamento = lazy(() => import('./pages/gerenciamento/DashboardGerenciamento'))
const GerenciarTutorial = lazy(() => import('./pages/gerenciamento/conteudo/GerenciarTutorial'));
const GerenciarSoftware = lazy(() => import('./pages/gerenciamento/conteudo/GerenciarConteudoSoftware'));
const GerenciarCurso = lazy(() => import('./pages/gerenciamento/conteudo/GerenciarConteudoCursos'));
const ConteudoGerenciamento = lazy(() => import('./pages/gerenciamento/ConteudoGerenciamento'));
import ListaConteudos from './pages/gerenciamento/conteudo/ListaConteudos';
const EditarConteudo = lazy(() => import('./pages/gerenciamento/EditarConteudo'))
const EditarSoftware = lazy(() => import('./pages/gerenciamento/entidades/EditarSoftwares'))
const EditarConteudoSoftware = lazy(() => import('./pages/gerenciamento/conteudo/EditarConteudoSoftware'))
const EditarConteudoTutorial = lazy(() => import('./pages/gerenciamento/conteudo/EditarConteudoTutorial'))

const App = () => (
    <Router>
        <Suspense fallback={<LoadingSpinner fullPage />}>
            <Routes>
                {/* --------------------------- */}
                {/* ROTAS PÚBLICAS (FRONT-END) */}
                {/* --------------------------- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/cursos" element={<CursoPagina />} />
                <Route path="/cursos/:id" element={<CursoDetalhe />} />
                <Route path="/softwares" element={<SoftwarePagina />} />
                <Route path="/softwares/:id" element={<SoftwareDetalhes />} />
                <Route path="/tutorial/:id" element={<TutorialGenerico />} />

                {/* --------------------------- */}
                {/* ROTAS DE GERENCIAMENTO (ADMIN) */}
                {/* --------------------------- */}
                <Route path="/gerenciamento" element={<DashboardGerenciamento />} />
                <Route path="/gerenciamento/conteudo/cursos" element={<ListaConteudos tipo="cursos" />} />
                <Route path="/gerenciamento/conteudo/softwares" element={<ListaConteudos tipo="softwares" />} />
                <Route path="/gerenciamento/conteudo/tutoriais" element={<ListaConteudos tipo="tutoriais" />} />
                <Route path="/gerenciamento/conteudo" element={<ConteudoGerenciamento />} />
                <Route path="/gerenciamento/conteudo/cursos/novo" element={<GerenciarCurso />} />
                <Route path="gerenciamento/conteudo/softwares/novo" element={<GerenciarSoftware />} />
                <Route path="/gerenciamento/conteudo/tutoriais/novo" element={<GerenciarTutorial />} />
                <Route path="/gerenciamento/conteudo/:tipo/editar/:id" element={<EditarConteudo />} />
                <Route path="gerenciamento/softwares/editar/:id" element={<EditarSoftware />} />
                <Route path="gerenciamento/conteudo/softwares/editar-conteudo/:id" element={<EditarConteudoSoftware />} />
                <Route path="gerenciamento/conteudo/tutoriais/editar-conteudo/:id" element={<EditarConteudoTutorial />} />


            </Routes>
        </Suspense>
    </Router>
);

export default App;