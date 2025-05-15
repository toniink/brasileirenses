import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SoftwaresEntidade = () => {
    const navigate = useNavigate();
    const [softwares, setSoftwares] = useState([]);
    const [formData, setFormData] = useState({
        id_softwares: '',
        nome: '',
        url: '',
        desenvolvedor: '',
        id_categoria: '',
        id_site: ''
    });
    const [categorias, setCategorias] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Buscar dados iniciais
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [softwaresRes, categoriasRes, sitesRes] = await Promise.all([
                    fetch("http://localhost:3000/softwares"),
                    fetch("http://localhost:3000/categorias"),
                    fetch("http://localhost:3000/sites")
                ]);

                if (!softwaresRes.ok) throw new Error("Erro ao buscar softwares");
                if (!categoriasRes.ok) throw new Error("Erro ao buscar categorias");
                if (!sitesRes.ok) throw new Error("Erro ao buscar sites");

                const [softwaresData, categoriasData, sitesData] = await Promise.all([
                    softwaresRes.json(),
                    categoriasRes.json(),
                    sitesRes.json()
                ]);

                // Padroniza os dados recebidos
                const categoriasPadronizadas = categoriasData.map(cat => ({
                    id_categoria: cat.id_categorias || cat.id_categoria,
                    nome: cat.nome
                }));

                const sitesPadronizados = sitesData.map(site => ({
                    id: site.id_site || site.id,
                    nome: site.nome,
                    categoria: site.categoria
                }));

                setSoftwares(softwaresData);
                setCategorias(categoriasPadronizadas);
                setSites(sitesPadronizados);

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
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
        
        if (!formData.nome) {
            setError("O nome do software é obrigatório");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const url = editMode 
                ? `http://localhost:3000/softwares/${formData.id_softwares}`
                : 'http://localhost:3000/softwares';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    // Garante que os IDs sejam números
                    id_categoria: formData.id_categoria ? Number(formData.id_categoria) : null,
                    id_site: formData.id_site ? Number(formData.id_site) : null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar software');
            }

            const result = await response.json();
            
            setSuccess(editMode ? 'Software atualizado com sucesso!' : 'Software criado com sucesso!');
            
            // Recarregar dados
            const [softwaresResponse, sitesResponse] = await Promise.all([
                fetch('http://localhost:3000/softwares'),
                fetch('http://localhost:3000/sites')
            ]);
            
            const [softwaresData, sitesData] = await Promise.all([
                softwaresResponse.json(),
                sitesResponse.json()
            ]);

            setSoftwares(softwaresData);
            setSites(sitesData.map(site => ({
                id: site.id_site || site.id,
                nome: site.nome,
                categoria: site.categoria
            })));
            
            // Limpar formulário
            setFormData({
                id_softwares: '',
                nome: '',
                url: '',
                desenvolvedor: '',
                id_categoria: '',
                id_site: ''
            });
            setEditMode(false);
            
        } catch (err) {
            console.error("Erro ao salvar software:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Editar software
    const handleEdit = (software) => {
        setFormData({
            id_softwares: software.id_softwares,
            nome: software.nome,
            url: software.url,
            desenvolvedor: software.desenvolvedor,
            id_categoria: software.id_categoria || '',
            id_site: software.id_site || ''
        });
        setEditMode(true);
        window.scrollTo(0, 0);
    };

    // Excluir software
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este software?')) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`http://localhost:3000/softwares/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir software');
            }

            setSuccess('Software excluído com sucesso!');
            
            // Recarregar softwares
            const softwaresResponse = await fetch('http://localhost:3000/softwares');
            const softwaresData = await softwaresResponse.json();
            setSoftwares(softwaresData);
            
        } catch (err) {
            console.error("Erro ao excluir software:", err);
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
                        <h2 className="mb-4">
                            {editMode ? "Editar Software" : "Adicionar Novo Software"}
                        </h2>

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
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setSuccess(null)}
                                />
                            </div>
                        )}

                        {/* Formulário */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="id_softwares" value={formData.id_softwares} />
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Nome do Software *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            placeholder="Digite o nome do software"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">URL Oficial</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleChange}
                                            placeholder="https://exemplo.com"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Desenvolvedor</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="desenvolvedor"
                                            value={formData.desenvolvedor}
                                            onChange={handleChange}
                                            placeholder="Nome do desenvolvedor ou empresa"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Categoria</label>
                                        <select
                                            className="form-select"
                                            name="id_categoria"
                                            value={formData.id_categoria || ""}
                                            onChange={handleChange}
                                            disabled={loading}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {categorias.map(categoria => (
                                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                                    {categoria.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Site Relacionado</label>
                                        <select
                                            className="form-select"
                                            name="id_site"
                                            value={formData.id_site || ""}
                                            onChange={handleChange}
                                            disabled={loading}
                                        >
                                            <option value="">Selecione um site</option>
                                            {sites.map(site => (
                                                <option key={site.id} value={site.id}>
                                                    {site.nome} {site.categoria && `(${site.categoria})`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                setFormData({
                                                    id_softwares: '',
                                                    nome: '',
                                                    url: '',
                                                    desenvolvedor: '',
                                                    id_categoria: '',
                                                    id_site: ''
                                                });
                                                setEditMode(false);
                                                setError(null);
                                                setSuccess(null);
                                            }}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={loading || !formData.nome}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Salvando...
                                                </>
                                            ) : (
                                                editMode ? 'Atualizar Software' : 'Cadastrar Software'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Lista de Softwares */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Lista de Softwares</h5>
                                
                                {loading && softwares.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    </div>
                                ) : softwares.length === 0 ? (
                                    <div className="alert alert-info">
                                        Nenhum software cadastrado ainda.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nome</th>
                                                    <th>Desenvolvedor</th>
                                                    <th>Categoria</th>
                                                    <th>URL</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {softwares.map(software => (
                                                    <tr key={software.id_softwares}>
                                                        <td>{software.id_softwares}</td>
                                                        <td>{software.nome}</td>
                                                        <td>{software.desenvolvedor || '-'}</td>
                                                        <td>
                                                            {categorias.find(c => c.id_categoria === software.id_categoria)?.nome || '-'}
                                                        </td>
                                                        <td>
                                                            {software.url ? (
                                                                <a 
                                                                    href={software.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-decoration-none"
                                                                >
                                                                    Acessar
                                                                </a>
                                                            ) : '-'}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEdit(software)}
                                                                    disabled={loading}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(software.id_softwares)}
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

export default SoftwaresEntidade;