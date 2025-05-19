import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header from './components/ui/Header';

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
        // Carrega categorias
        fetch('http://localhost:3000/categorias')
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar categorias');
                return response.json();
            })
            .then(data => {
                const categoriasData = Array.isArray(data) ? data : data.data || [];
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
        if (categoriaId) url += `?categoria=${categoriaId}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const cursosData = Array.isArray(data) ? data : data.data || [];
                setCursos(cursosData);
                setLoading(prev => ({ ...prev, cursos: false }));
            })
            .catch(error => {
                console.error('Erro ao buscar cursos:', error);
                setError(error.message || 'Erro ao carregar cursos');
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

            {error && (
                <div className="alert alert-danger alert-dismissible fade show mt-3">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}

            <div className="row mt-4">
                <div className="col-md-3">
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
                                    <i className="bi bi-grid-fill me-2"></i> Todas as Categorias
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

                <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">
                            {categoriaSelecionada
                                ? categorias.find(c => (c.id_categorias || c.id) === categoriaSelecionada)?.nome
                                : 'Todos os Cursos'}
                        </h2>
                        {!loading.cursos && <span className="badge bg-primary">{cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}</span>}
                    </div>

                    {loading.cursos ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {cursos.length > 0 ? cursos.map(curso => (
                                <div className="col-md-4 mb-4" key={curso.id_cursos} onClick={() => handleCursoClick(curso.id_cursos)} style={{ cursor: 'pointer' }}>
                                    <div className="card h-100 shadow-sm hover-shadow transition-all">
                                        <div className="card-img-top" style={{ height: '150px', overflow: 'hidden' }}>
                                            {curso.imagem_url ? (
                                                <img 
                                                    src={`/assets/cursos/${curso.imagem_url}`}
                                                    alt={curso.nome_curso}
                                                    className="img-fluid h-100 w-100 object-fit-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23DDDDDD" width="100" height="100"/%3E%3Ctext fill="%23666666" font-family="sans-serif" font-size="16" dy=".5em" text-anchor="middle" x="50" y="50"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            ) : (
                                                <div className="bg-secondary h-100 d-flex align-items-center justify-content-center">
                                                    <span className="text-white">Sem imagem</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h5 className="card-title me-2">{curso.nome_curso}</h5>
                                                <span className={`badge ${
                                                    curso.nivel_dificuldade?.toLowerCase() === 'iniciante' ? 'bg-success' :
                                                    curso.nivel_dificuldade?.toLowerCase() === 'intermediario' ? 'bg-warning text-dark' :
                                                    'bg-danger'
                                                }`}>
                                                    {curso.nivel_dificuldade}
                                                </span>
                                            </div>
                                            <p className="card-text text-muted small flex-grow-1">
                                                {curso.descricao?.substring(0, 100)}{curso.descricao?.length > 100 ? '...' : ''}
                                            </p>
                                            <div className="mt-2">
                                                <span className="badge bg-primary me-1">{curso.nome_categoria}</span>
                                                <span className="badge bg-info text-dark">{curso.formato}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        {categoriaSelecionada ? 'Nenhum curso encontrado nesta categoria.' : 'Nenhum curso disponível no momento.'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <footer className="bg-primary text-light py-4 mt-4">
                <div className="container">
                    <div className="row">
                        {/* Footer content */}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CursoPagina;