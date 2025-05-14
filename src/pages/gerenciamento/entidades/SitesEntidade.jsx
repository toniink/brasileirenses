import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SitesEntidades = () => {
    const navigate = useNavigate();
    const [sites, setSites] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        id_site: '',
        nome: '',
        url: '',
        descricao: '',
        id_categoria: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Buscar sites e categorias
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [sitesRes, categoriasRes] = await Promise.all([
                    fetch('http://localhost:3000/sites'),
                    fetch('http://localhost:3000/categorias')
                ]);

                if (!sitesRes.ok) throw new Error('Erro ao buscar sites');
                if (!categoriasRes.ok) throw new Error('Erro ao buscar categorias');

                const [sitesData, categoriasData] = await Promise.all([
                    sitesRes.json(),
                    categoriasRes.json()
                ]);

                setSites(sitesData);
                setCategorias(categoriasData);

            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Manipulador de formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Submeter formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação
        if (!formData.nome || !formData.url || !formData.descricao || !formData.id_categoria) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const url = editMode 
                ? `http://localhost:3000/sites/${formData.id_site}`
                : 'http://localhost:3000/sites';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar site');
            }

            const result = await response.json();
            
            setSuccess(editMode ? 'Site atualizado com sucesso!' : 'Site criado com sucesso!');
            
            // Recarregar sites
            const sitesResponse = await fetch('http://localhost:3000/sites');
            const sitesData = await sitesResponse.json();
            setSites(sitesData);
            
            // Limpar formulário
            setFormData({
                id_site: '',
                nome: '',
                url: '',
                descricao: '',
                id_categoria: ''
            });
            setEditMode(false);
            
        } catch (err) {
            console.error('Erro ao salvar site:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Editar site
    const handleEdit = (site) => {
        setFormData({
            id_site: site.id_site,
            nome: site.nome,
            url: site.url,
            descricao: site.descricao,
            id_categoria: categorias.find(c => c.nome === site.categoria)?.id_categorias || ''
        });
        setEditMode(true);
        window.scrollTo(0, 0);
    };

    // Excluir site
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este site?')) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`http://localhost:3000/sites/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir site');
            }

            setSuccess('Site excluído com sucesso!');
            
            // Recarregar sites
            const sitesResponse = await fetch('http://localhost:3000/sites');
            const sitesData = await sitesResponse.json();
            setSites(sitesData);
            
        } catch (err) {
            console.error('Erro ao excluir site:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Cabeçalho */}
            <header className="bg-light shadow-sm">
                <div className="container py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <nav className="d-flex gap-3">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="btn btn-link"
                            >
                                Voltar
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h2 className="mb-4">Gerenciamento de Sites</h2>

                        {/* Mensagens de status */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show">
                                {error}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setError(null)}
                                />
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success alert-dismissible fade show">
                                {success}
                            </div>
                        )}

                        {/* Formulário */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {editMode ? 'Editar Site' : 'Adicionar Novo Site'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="id_site" value={formData.id_site} />
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Nome do Site *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            placeholder="Digite o nome do site"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">URL *</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleChange}
                                            placeholder="https://exemplo.com"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descrição *</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="descricao"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            placeholder="Descreva o site"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Categoria *</label>
                                        <select
                                            className="form-select"
                                            name="id_categoria"
                                            value={formData.id_categoria || ""}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {categorias.map(categoria => (
                                                <option key={categoria.id_categorias} value={categoria.id_categorias}>
                                                    {categoria.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        {editMode && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setFormData({
                                                        id_site: '',
                                                        nome: '',
                                                        url: '',
                                                        descricao: '',
                                                        id_categoria: ''
                                                    });
                                                    setEditMode(false);
                                                }}
                                                disabled={loading}
                                            >
                                                Cancelar Edição
                                            </button>
                                        )}
                                        
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Salvando...
                                                </>
                                            ) : (
                                                editMode ? 'Atualizar Site' : 'Adicionar Site'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Lista de Sites */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Lista de Sites</h5>
                                
                                {loading && sites.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    </div>
                                ) : sites.length === 0 ? (
                                    <div className="alert alert-info">
                                        Nenhum site cadastrado ainda.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nome</th>
                                                    <th>Descrição</th>
                                                    <th>URL</th>
                                                    <th>Categoria</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sites.map(site => (
                                                    <tr key={site.id_site}>
                                                        <td>{site.id_site}</td>
                                                        <td>{site.nome}</td>
                                                        <td>{site.descricao}</td>
                                                        <td>
                                                            <a href={site.url} target="_blank" rel="noopener noreferrer">
                                                                Acessar
                                                            </a>
                                                        </td>
                                                        <td>{site.categoria || '-'}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEdit(site)}
                                                                    disabled={loading}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(site.id_site)}
                                                                    disabled={loading}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Rodapé */}
            <footer className="bg-dark text-white py-3 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
                </div>
            </footer>
        </div>
    );
};

export default SitesEntidades;