import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoriasEntidades = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        id_categorias: '',
        nome: '',
        descricao: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Buscar categorias
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/categorias');
                if (!response.ok) throw new Error('Erro ao buscar categorias');
                const data = await response.json();
                setCategorias(data);
            } catch (err) {
                console.error('Erro ao buscar categorias:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
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
            setError('O nome da categoria é obrigatório');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const url = editMode 
                ? `http://localhost:3000/categorias/${formData.id_categorias}`
                : 'http://localhost:3000/categorias';
            
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
                throw new Error(errorData.message || 'Erro ao salvar categoria');
            }

            const result = await response.json();
            
            setSuccess(editMode ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
            
            // Recarregar categorias
            const categoriasResponse = await fetch('http://localhost:3000/categorias');
            const categoriasData = await categoriasResponse.json();
            setCategorias(categoriasData);
            
            // Limpar formulário
            setFormData({
                id_categorias: '',
                nome: '',
                descricao: ''
            });
            setEditMode(false);
            
        } catch (err) {
            console.error('Erro ao salvar categoria:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Editar categoria
    const handleEdit = (categoria) => {
        setFormData({
            id_categorias: categoria.id_categorias,
            nome: categoria.nome,
            descricao: categoria.descricao
        });
        setEditMode(true);
        window.scrollTo(0, 0);
    };

    // Excluir categoria
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`http://localhost:3000/categorias/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir categoria');
            }

            setSuccess('Categoria excluída com sucesso!');
            
            // Recarregar categorias
            const categoriasResponse = await fetch('http://localhost:3000/categorias');
            const categoriasData = await categoriasResponse.json();
            setCategorias(categoriasData);
            
        } catch (err) {
            console.error('Erro ao excluir categoria:', err);
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
                        <h2 className="mb-4">Gerenciamento de Categorias</h2>

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
                                    {editMode ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="id_categorias" value={formData.id_categorias} />
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Nome da Categoria *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            placeholder="Digite o nome da categoria"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="descricao"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            placeholder="Digite uma descrição para a categoria"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        {editMode && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setFormData({
                                                        id_categorias: '',
                                                        nome: '',
                                                        descricao: ''
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
                                            disabled={loading || !formData.nome}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Salvando...
                                                </>
                                            ) : (
                                                editMode ? 'Atualizar Categoria' : 'Adicionar Categoria'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Lista de Categorias */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Lista de Categorias</h5>
                                
                                {loading && categorias.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    </div>
                                ) : categorias.length === 0 ? (
                                    <div className="alert alert-info">
                                        Nenhuma categoria cadastrada ainda.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nome</th>
                                                    <th>Descrição</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categorias.map(categoria => (
                                                    <tr key={categoria.id_categorias}>
                                                        <td>{categoria.id_categorias}</td>
                                                        <td>{categoria.nome}</td>
                                                        <td>{categoria.descricao || '-'}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEdit(categoria)}
                                                                    disabled={loading}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(categoria.id_categorias)}
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

export default CategoriasEntidades;