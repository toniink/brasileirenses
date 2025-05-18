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

    // 🔄 Buscar dados iniciais (AJUSTADO)
    useEffect(() => {
        // Na função fetchData do useEffect
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar CATEGORIAS - Correção para usar id_categorias do banco
                const categoriasRes = await fetch("http://localhost:3000/categorias");
                if (categoriasRes.ok) {
                    const categoriasData = await categoriasRes.json();
                    setCategorias(categoriasData); // Mantém a estrutura original do backend
                }

                // Buscar SITES - Correção para usar id_site do banco
                const sitesRes = await fetch("http://localhost:3000/sites");
                if (sitesRes.ok) {
                    const sitesData = await sitesRes.json();
                    setSites(sitesData); // Mantém a estrutura original do backend
                }

                // Buscar SOFTWARES
                const softwaresRes = await fetch("http://localhost:3000/softwares");
                if (softwaresRes.ok) {
                    const softwaresData = await softwaresRes.json();
                    setSoftwares(softwaresData);
                }

            } catch (err) {
                console.error("Erro:", err);
                setError("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ✏️ Manipulador de formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 📤 Submeter formulário
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

            // Converter strings vazias para null
            const payload = {
                nome: formData.nome,
                url: formData.url || null,
                desenvolvedor: formData.desenvolvedor || null,
                id_categoria: formData.id_categoria || null,
                id_site: formData.id_site || null
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar software');
            }

            setSuccess(data.message || (editMode ? 'Software atualizado com sucesso!' : 'Software criado com sucesso!'));

            // Atualizar lista de softwares
            const softwaresRes = await fetch("http://localhost:3000/softwares");
            if (softwaresRes.ok) {
                const softwaresData = await softwaresRes.json();
                setSoftwares(softwaresData);
            }

            if (!editMode) {
                setFormData({
                    id_softwares: '',
                    nome: '',
                    url: '',
                    desenvolvedor: '',
                    id_categoria: '',
                    id_site: ''
                });
            }

        } catch (err) {
            console.error("Erro ao salvar:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✏️ Editar software
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

    // 🗑️ Excluir software
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

            // Atualizar lista após exclusão
            const softwaresRes = await fetch('http://localhost:3000/softwares');
            if (softwaresRes.ok) {
                const softwaresData = await softwaresRes.json();
                setSoftwares(softwaresData);
            }

        } catch (err) {
            console.error("Erro ao excluir:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 🏷️ Cabeçalho */}
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

            {/* 📌 Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h2 className="mb-4">
                            {editMode ? "Editar Software" : "Adicionar Novo Software"}
                        </h2>

                        {/* 🚨 Mensagens de status */}
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

                        {/* 📝 Formulário */}
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

                                    {/* 🗂️ Lista Suspensa de Categorias (AJUSTADA) */}
                                    {/* Select de Categorias */}
                                    <div className="mb-3">
                                        <label className="form-label">Categoria</label>
                                        <select
                                            className="form-select"
                                            name="id_categoria"
                                            value={formData.id_categoria || ""}
                                            onChange={handleChange}
                                            disabled={loading || categorias.length === 0}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {categorias.map(categoria => (
                                                <option
                                                    key={categoria.id_categorias}
                                                    value={categoria.id_categorias} // Usa o ID real do banco
                                                >
                                                    {categoria.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Select de Sites */}
                                    <div className="mb-3">
                                        <label className="form-label">Site Relacionado</label>
                                        <select
                                            className="form-select"
                                            name="id_site"
                                            value={formData.id_site || ""}
                                            onChange={handleChange}
                                            disabled={loading || sites.length === 0}
                                        >
                                            <option value="">Selecione um site</option>
                                            {sites.map(site => (
                                                <option
                                                    key={site.id_site}
                                                    value={site.id_site} // Usa o ID real do banco
                                                >
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

                        {/* 📋 Lista de Softwares */}
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

            {/* 🏁 Rodapé */}
            <footer className="bg-dark text-white py-3 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
                </div>
            </footer>
        </div>
    );
};

export default SoftwaresEntidade;