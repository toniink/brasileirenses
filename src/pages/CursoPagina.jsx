import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

const CursoPagina = () => {
    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [loading, setLoading] = useState({
        cursos: true,
        categorias: true
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Carrega categorias (com tratamento para diferentes estruturas de resposta)
        fetch('http://localhost:3000/categorias')
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar categorias');
                return response.json();
            })
            .then(data => {
                // Aceita tanto { data: [...] } quanto o array direto
                const categoriasData = Array.isArray(data) ? data :
                    data.data ? data.data :
                        data.result ? data.result : [];

                if (categoriasData.length === 0) {
                    throw new Error('Nenhuma categoria encontrada');
                }

                setCategorias(categoriasData);
                setLoading(prev => ({ ...prev, categorias: false }));
            })
            .catch(error => {
                console.error('Erro ao carregar categorias:', error);
                setError('Falha ao carregar categorias');
                setLoading(prev => ({ ...prev, categorias: false }));
            });

        // Carrega cursos iniciais
        fetchCursos();
    }, []);

    const fetchCursos = (categoriaId = null) => {
        setLoading(prev => ({ ...prev, cursos: true }));
        setError(null);

        let url = 'http://localhost:3000/cursos/filtrados';
        if (categoriaId) {
            url += `?categoria=${categoriaId}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Aceita tanto { data: [...] } quanto o array direto
                const cursosData = Array.isArray(data) ? data :
                    data.data ? data.data :
                        data.result ? data.result : [];

                setCursos(cursosData);
                setLoading(prev => ({ ...prev, cursos: false }));
            })
            .catch(error => {
                console.error('Erro ao buscar cursos:', error);
                setError(error.message || 'Erro ao carregar cursos');
                setCursos([]);
                setLoading(prev => ({ ...prev, cursos: false }));
            });
    };

    const handleFiltroCategoria = (categoriaId) => {
        setCategoriaSelecionada(categoriaId);
        fetchCursos(categoriaId);
    };

    const handleCursoClick = (id) => {
        navigate(`/cursos/${id}`);
    };

    const isLoading = loading.cursos || loading.categorias;

    return (
        <div className="container-fluid">
            <Header />

            {/* Mensagem de erro */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show mt-3">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                        aria-label="Close"
                    ></button>
                </div>
            )}
            <div className="container mx-auto px-4">

                <div className="row mt-4">
                    {/* Coluna Lateral: Filtro */}
                    <div className="col-md-3 my-4">
                        <div className="card p-3 shadow-sm">
                            <h5 className="mb-3">Filtrar por Categoria</h5>
                            {loading.categorias ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="list-group">
                                    <button
                                        className={`list-group-item list-group-item-action ${!categoriaSelecionada ? 'active' : ''}`}
                                        onClick={() => handleFiltroCategoria(null)}
                                    >
                                        <i className="bi bi-grid-fill me-2"></i>
                                        Todas as Categorias
                                    </button>
                                    {categorias.map(categoria => (
                                        <button
                                            key={categoria.id_categorias || categoria.id}
                                            className={`list-group-item list-group-item-action ${categoriaSelecionada === (categoria.id_categorias || categoria.id) ? 'active' : ''}`}
                                            onClick={() => handleFiltroCategoria(categoria.id_categorias || categoria.id)}
                                        >
                                            {categoria.nome || categoria.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Conteúdo Principal: Cursos */}
                    <div className="col-md-9 my-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">
                                {categoriaSelecionada
                                    ? categorias.find(c => (c.id_categorias || c.id) === categoriaSelecionada)?.nome
                                    : 'Todos os Cursos'}
                            </h2>
                            {!loading.cursos && (
                                <span className="badge bg-primary">
                                    {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
                                </span>
                            )}
                        </div>

                        {loading.cursos ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Carregando...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                {cursos.length > 0 ? (
                                    cursos.map(curso => (
                                        <div
                                            className="col-md-4 mb-4 col-lg-4 col-md-6 col-sm-12"
                                            key={curso.id_cursos || curso.id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleCursoClick(curso.id_cursos || curso.id)}
                                        >
                                            <div className="card h-100 shadow-sm hover-shadow transition-all">
                                                <div className="card-img-top bg-light" style={{ height: '150px' }} />
                                                <div className="card-body d-flex flex-column">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <h5 className="card-title me-2">{curso.nome_curso || curso.nome}</h5>
                                                        <span className={`badge ${(curso.nivel_dificuldade || '').toLowerCase() === 'iniciante' ? 'bg-success' :
                                                                (curso.nivel_dificuldade || '').toLowerCase() === 'intermediario' ? 'bg-warning text-dark' :
                                                                    'bg-danger'
                                                            } text-nowrap flex-shrink-0 align-self-start`}>
                                                            {curso.nivel_dificuldade}
                                                        </span>
                                                    </div>
                                                    <p className="card-text text-muted small flex-grow-1">
                                                        {curso.descricao?.substring(0, 100)}{curso.descricao?.length > 100 ? '...' : ''}
                                                    </p>
                                                    <div className="mt-2">
                                                        <span className="badge bg-primary me-1">
                                                            {curso.nome_categoria || curso.categoria}
                                                        </span>
                                                        <span className="badge bg-info text-dark">
                                                            {curso.formato}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <div className="alert alert-info">
                                            {categoriaSelecionada
                                                ? 'Nenhum curso encontrado nesta categoria.'
                                                : 'Nenhum curso disponível no momento.'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CursoPagina;