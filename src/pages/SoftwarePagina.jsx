import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

const SoftwarePagina = () => {
    const [softwares, setSoftwares] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [loading, setLoading] = useState({
        softwares: true,
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
                const categoriasData = Array.isArray(data) ? data : (data.data || data.result || []);
                setCategorias(categoriasData);
                setLoading(prev => ({ ...prev, categorias: false }));
            })
            .catch(error => {
                console.error('Erro ao carregar categorias:', error);
                setError('Falha ao carregar categorias');
                setLoading(prev => ({ ...prev, categorias: false }));
            });

        // Carrega softwares iniciais
        fetchSoftwares();
    }, []);

    const fetchSoftwares = (categoriaId = null) => {
        setLoading(prev => ({ ...prev, softwares: true }));
        setError(null);

        let url = 'http://localhost:3000/softwares';
        if (categoriaId) {
            url += `/filtrados?categoria=${categoriaId}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const softwaresData = Array.isArray(data) ? data : (data.data || data.result || []);
                setSoftwares(softwaresData);
                setLoading(prev => ({ ...prev, softwares: false }));
            })
            .catch(error => {
                console.error('Erro ao buscar softwares:', error);
                setError(error.message || 'Erro ao carregar softwares');
                setSoftwares([]);
                setLoading(prev => ({ ...prev, softwares: false }));
            });
    };

    const handleFiltroCategoria = (categoriaId) => {
        setCategoriaSelecionada(categoriaId);
        fetchSoftwares(categoriaId);
    };

    const handleSoftwareClick = (id) => {
        navigate(`/softwares/${id}`);
    };

    const isLoading = loading.softwares || loading.categorias;

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

            <div className="row mt-4">
                {/* Coluna Lateral: Filtro */}
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

                {/* Conteúdo Principal: Softwares */}
                <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">
                            {categoriaSelecionada
                                ? categorias.find(c => (c.id_categorias || c.id) === categoriaSelecionada)?.nome
                                : 'Todos os Softwares'}
                        </h2>
                        {!loading.softwares && (
                            <span className="badge bg-primary">
                                {softwares.length} {softwares.length === 1 ? 'software' : 'softwares'}
                            </span>
                        )}
                    </div>

                    {loading.softwares ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {softwares.length > 0 ? (
                                softwares.map(software => (
                                    <div 
                                        className="col-md-4 mb-4" 
                                        key={software.id_softwares || software.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSoftwareClick(software.id_softwares || software.id)}
                                    >
                                        <div className="card h-100 shadow-sm hover-shadow transition-all">
                                            <div className="card-img-top bg-secondary" style={{ height: '150px' }} />
                                            <div className="card-body d-flex flex-column">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h5 className="card-title me-2">{software.nome || software.name}</h5>
                                                    <span className="badge bg-info text-dark text-nowrap flex-shrink-0 align-self-start">
                                                        {software.nome_categoria || software.categoria}
                                                    </span>
                                                </div>
                                                <p className="card-text text-muted small flex-grow-1">
                                                    {software.desenvolvedor || 'Desenvolvedor não informado'}
                                                </p>
                                                <div className="mt-2">
                                                    {software.url && (
                                                        <a href={software.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                            Visitar Site
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        {categoriaSelecionada
                                            ? 'Nenhum software encontrado nesta categoria.'
                                            : 'Nenhum software disponível no momento.'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default SoftwarePagina;