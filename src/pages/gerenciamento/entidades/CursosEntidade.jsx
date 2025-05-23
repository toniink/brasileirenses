import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CursosEntidade = () => {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sites, setSites] = useState([]);
    const [softwares, setSoftwares] = useState([]); // Estado para softwares
    const [formData, setFormData] = useState({
        id_cursos: '',
        nome_curso: '',
        descricao: '',
        duracao: '',
        url: '',
        formato: '',
        nivel_dificuldade: '',
        id_categoria: '',
        id_site: '',
        id_software: '' // Novo campo para associar um software
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Buscar cursos, categorias, sites e softwares
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [cursosRes, categoriasRes, sitesRes, softwaresRes] = await Promise.all([
                    fetch('http://localhost:3000/cursos'),
                    fetch('http://localhost:3000/categorias'),
                    fetch('http://localhost:3000/sites'),
                    fetch('http://localhost:3000/softwares') // Nova chamada para softwares
                ]);

                if (!cursosRes.ok) throw new Error('Erro ao buscar cursos');
                if (!categoriasRes.ok) throw new Error('Erro ao buscar categorias');
                if (!sitesRes.ok) throw new Error('Erro ao buscar sites');
                if (!softwaresRes.ok) throw new Error('Erro ao buscar softwares');

                const [cursosData, categoriasData, sitesData, softwaresData] = await Promise.all([
                    cursosRes.json(),
                    categoriasRes.json(),
                    sitesRes.json(),
                    softwaresRes.json()
                ]);

                setCursos(cursosData);
                setCategorias(categoriasData);
                setSites(sitesData);
                setSoftwares(softwaresData);

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

    if (!formData.nome_curso || !formData.descricao || !formData.duracao || 
        !formData.formato || !formData.nivel_dificuldade || !formData.id_categoria || !formData.id_site) {
        setError('Todos os campos obrigatórios devem ser preenchidos.');
        return;
    }

    try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // 1️⃣ Primeiro, cadastrar o curso
        const cursoResponse = await fetch(`http://localhost:3000/cursos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!cursoResponse.ok) {
            throw new Error("Erro ao salvar curso");
        }

        const cursoCriado = await cursoResponse.json();

        // 2️⃣ Agora, associar software ao curso (se algum software foi selecionado)
        if (formData.id_software) {
            const associacaoResponse = await fetch(`http://localhost:3000/cursos/${cursoCriado.id_cursos}/softwares`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id_software: formData.id_software })
            });

            if (!associacaoResponse.ok) {
                throw new Error("Erro ao associar software ao curso");
            }
        }

        setSuccess("Curso e software associado com sucesso!");

        // Recarregar cursos
        const cursosAtualizados = await fetch("http://localhost:3000/cursos");
        setCursos(await cursosAtualizados.json());

        // Reset do formulário
        setFormData({
            id_cursos: '',
            nome_curso: '',
            descricao: '',
            duracao: '',
            url: '',
            formato: '',
            nivel_dificuldade: '',
            id_categoria: '',
            id_site: '',
            id_software: ''
        });
        setEditMode(false);

    } catch (err) {
        console.error("Erro ao salvar:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    // Editar curso
    const handleEdit = (curso) => {
    setFormData({
        id_cursos: curso.id_cursos,
        nome_curso: curso.nome_curso,
        descricao: curso.descricao,
        duracao: curso.duracao,
        url: curso.url,
        formato: curso.formato,
        nivel_dificuldade: curso.nivel_dificuldade,
        id_categoria: categorias.find(c => c.nome === curso.nome_categoria)?.id_categorias || '',
        id_site: sites.find(s => s.nome === curso.nome_site)?.id_site || '',
        id_software: curso.id_software || '' // Adiciona o software associado se existir
    });
    setEditMode(true);
    window.scrollTo(0, 0);
};


    // Excluir curso
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este curso?')) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`http://localhost:3000/cursos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir curso');
            }

            setSuccess('Curso excluído com sucesso!');
            
            // Recarregar cursos
            const cursosResponse = await fetch('http://localhost:3000/cursos');
            const cursosData = await cursosResponse.json();
            setCursos(cursosData);
            
        } catch (err) {
            console.error('Erro ao excluir curso:', err);
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
                    <div className="col-lg-12">
                        <h2 className="mb-4">Gerenciamento de Cursos</h2>

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
                                    {editMode ? 'Editar Curso' : 'Adicionar Novo Curso'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="id_cursos" value={formData.id_cursos} />
                                    
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nome do Curso *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nome_curso"
                                                value={formData.nome_curso}
                                                onChange={handleChange}
                                                placeholder="Digite o nome do curso"
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Duração *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="duracao"
                                                value={formData.duracao}
                                                onChange={handleChange}
                                                placeholder="Ex: 40 horas"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descrição *</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="descricao"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            placeholder="Descreva o curso"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">URL</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="url"
                                                value={formData.url}
                                                onChange={handleChange}
                                                placeholder="https://exemplo.com/curso"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Formato *</label>
                                            <select
                                                className="form-select"
                                                name="formato"
                                                value={formData.formato || ""}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Selecione o formato</option>
                                                <option value="texto">Texto</option>
                                                <option value="video">Vídeo</option>
                                                <option value="interativo">Interativo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nível de Dificuldade *</label>
                                            <select
                                                className="form-select"
                                                name="nivel_dificuldade"
                                                value={formData.nivel_dificuldade || ""}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Selecione o nível</option>
                                                <option value="iniciante">Iniciante</option>
                                                <option value="intermediario">Intermediário</option>
                                                <option value="avancado">Avançado</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
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
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Site *</label>
                                            <select
                                                className="form-select"
                                                name="id_site"
                                                value={formData.id_site || ""}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Selecione um site</option>
                                                {sites.map(site => (
                                                    <option key={site.id_site} value={site.id_site}>
                                                        {site.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* NOVO CAMPO - Lista suspensa de softwares (seleção única) */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Software Associado *</label>
                                            <select
                                                className="form-select"
                                                name="id_software"
                                                value={formData.id_software || ""}
                                                onChange={handleChange}
                                                disabled={loading}
                                            >
                                                <option value="">Selecione um software</option>
                                                {softwares.map(software => (
                                                    <option key={software.id_softwares} value={software.id_softwares}>
                                                        {software.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        {editMode && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setFormData({
                                                        id_cursos: '',
                                                        nome_curso: '',
                                                        descricao: '',
                                                        duracao: '',
                                                        url: '',
                                                        formato: '',
                                                        nivel_dificuldade: '',
                                                        id_categoria: '',
                                                        id_site: '',
                                                        id_software: ''
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
                                                editMode ? 'Atualizar Curso' : 'Adicionar Curso'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Lista de Cursos */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Lista de Cursos</h5>
                                
                                {loading && cursos.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    </div>
                                ) : cursos.length === 0 ? (
                                    <div className="alert alert-info">
                                        Nenhum curso cadastrado ainda.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nome</th>
                                                    <th>Duração</th>
                                                    <th>Formato</th>
                                                    <th>Nível</th>
                                                    <th>Categoria</th>
                                                    <th>Site</th>
                                                    <th>Software</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cursos.map(curso => (
                                                    <tr key={curso.id_cursos}>
                                                        <td>{curso.id_cursos}</td>
                                                        <td>{curso.nome_curso}</td>
                                                        <td>{curso.duracao}</td>
                                                        <td>{curso.formato}</td>
                                                        <td>{curso.nivel_dificuldade}</td>
                                                        <td>{curso.nome_categoria || '-'}</td>
                                                        <td>{curso.nome_site || '-'}</td>
                                                        <td>
                                                            {curso.id_software ? 
                                                                softwares.find(s => s.id_softwares === curso.id_software)?.nome || '-' 
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEdit(curso)}
                                                                    disabled={loading}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(curso.id_cursos)}
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

export default CursosEntidade;