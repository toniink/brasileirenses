import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CursosEntidade = () => {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sites, setSites] = useState([]);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        id_cursos: '',
        nome_curso: '',
        descricao: '',
        duracao: '',
        url: '',
        imagem_url: '',
        formato: '',
        nivel_dificuldade: '',
        id_categoria: '',
        id_site: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const getCourseImages = async () => {
        try {
            const imageModules = import.meta.glob('/src/assets/cursos/*.{png,jpg,jpeg,gif,webp}');
            const imagePaths = Object.keys(imageModules);

            const loadedImages = await Promise.all(
                imagePaths.map(async (path) => {
                    const module = await imageModules[path]();
                    return {
                        name: path.split('/').pop(),
                        path: module.default
                    };
                })
            );
            return loadedImages;
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Carrega categorias e sites primeiro
                const [categoriasRes, sitesRes] = await Promise.all([
                    fetch('http://localhost:3000/categorias'),
                    fetch('http://localhost:3000/sites')
                ]);

                const [categoriasData, sitesData] = await Promise.all([
                    categoriasRes.json(),
                    sitesRes.json()
                ]);

                // Garante que são arrays mesmo se vierem com a estrutura {success, data}
                const categoriasArray = Array.isArray(categoriasData) ? categoriasData :
                    (categoriasData.success ? categoriasData.data : []);

                const sitesArray = Array.isArray(sitesData) ? sitesData :
                    (sitesData.success ? sitesData.data : []);

                setCategorias(categoriasArray);
                setSites(sitesArray);

                // Depois carrega cursos
                const cursosRes = await fetch('http://localhost:3000/cursos');
                const cursosData = await cursosRes.json();
                const cursosArray = Array.isArray(cursosData) ? cursosData :
                    (cursosData.success ? cursosData.data : []);
                setCursos(cursosArray);

                // Carrega imagens
                const loadedImages = await getCourseImages();
                setImages(loadedImages);

            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (e) => {
        const selectedImageName = e.target.value;
        setFormData(prev => ({ ...prev, imagem_url: selectedImageName }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome_curso || !formData.descricao || !formData.duracao ||
            !formData.formato || !formData.nivel_dificuldade || !formData.id_categoria || !formData.id_site) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const url = editMode
                ? `http://localhost:3000/cursos/${formData.id_cursos}`
                : 'http://localhost:3000/cursos';

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
                throw new Error(errorData.message || 'Erro ao salvar curso');
            }

            const result = await response.json();
            setSuccess(editMode ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!');

            // Recarregar cursos
            const cursosResponse = await fetch('http://localhost:3000/cursos');
            const cursosData = await cursosResponse.json();
            setCursos(cursosData.success ? cursosData.data : []);

            // Limpar formulário
            setFormData({
                id_cursos: '',
                nome_curso: '',
                descricao: '',
                duracao: '',
                url: '',
                imagem_url: '',
                formato: '',
                nivel_dificuldade: '',
                id_categoria: '',
                id_site: ''
            });
            setEditMode(false);

        } catch (err) {
            console.error('Erro ao salvar curso:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (curso) => {
        // Encontra a categoria correspondente pelo nome
        const categoriaCorrespondente = categorias.find(
            c => c.nome === curso.nome_categoria
        );

        // Encontra o site correspondente pelo nome
        const siteCorrespondente = sites.find(
            s => s.nome === curso.nome_site
        );

        setFormData({
            id_cursos: curso.id_cursos,
            nome_curso: curso.nome_curso,
            descricao: curso.descricao,
            duracao: curso.duracao,
            url: curso.url,
            imagem_url: curso.imagem_url || '',
            formato: curso.formato,
            nivel_dificuldade: curso.nivel_dificuldade,
            id_categoria: categoriaCorrespondente?.id_categorias || '',
            id_site: siteCorrespondente?.id_site || ''
        });
        setEditMode(true);
    };

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
            setCursos(cursosData.success ? cursosData.data : []);

        } catch (err) {
            console.error('Erro ao excluir curso:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imageName) => {
        if (!imageName) return null;
        const image = images.find(img => img.name === imageName);
        return image ? image.path : null;
    };

    return (
        <div className="d-flex flex-column min-vh-100">
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

            <main className="container flex-grow-1 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <h2 className="mb-4">Gerenciamento de Cursos</h2>

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
                                            {!loading && categorias.length === 0 && (
                                                <small className="text-danger">Nenhuma categoria carregada</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
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
                                        {!loading && sites.length === 0 && (
                                            <small className="text-danger">Nenhum site carregado</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Imagem do Curso</label>
                                        <select
                                            className="form-select"
                                            name="imagem_url"
                                            value={formData.imagem_url || ""}
                                            onChange={handleImageSelect}
                                            disabled={loading || images.length === 0}
                                        >
                                            <option value="">Selecione uma imagem</option>
                                            {images.map((image, index) => (
                                                <option key={index} value={image.name}>
                                                    {image.name}
                                                </option>
                                            ))}
                                        </select>
                                        {images.length === 0 && (
                                            <small className="text-muted">
                                                Nenhuma imagem encontrada na pasta assets/cursos
                                            </small>
                                        )}
                                    </div>

                                    {formData.imagem_url && getImageUrl(formData.imagem_url) && (
                                        <div className="mb-3">
                                            <label className="form-label">Pré-visualização:</label>
                                            <div className="border p-2 rounded" style={{ maxWidth: '300px' }}>
                                                <img
                                                    src={getImageUrl(formData.imagem_url)}
                                                    alt="Pré-visualização"
                                                    className="img-fluid"
                                                    style={{ maxHeight: '150px' }}
                                                />
                                                <div className="mt-2">
                                                    <small>{formData.imagem_url}</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                                        imagem_url: '',
                                                        formato: '',
                                                        nivel_dificuldade: '',
                                                        id_categoria: '',
                                                        id_site: ''
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
                                                    <th>Imagem</th>
                                                    <th>Nome</th>
                                                    <th>Duração</th>
                                                    <th>Formato</th>
                                                    <th>Nível</th>
                                                    <th>Categoria</th>
                                                    <th>Site</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cursos.map(curso => (
                                                    <tr key={curso.id_cursos}>
                                                        <td>{curso.id_cursos}</td>
                                                        <td>
                                                            {curso.imagem_url && (
                                                                <img
                                                                    src={`/src/assets/cursos/${curso.imagem_url}`}
                                                                    alt={`Capa ${curso.nome_curso}`}
                                                                    style={{ width: '50px', height: '30px', objectFit: 'cover' }}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                        <td>{curso.nome_curso}</td>
                                                        <td>{curso.duracao}</td>
                                                        <td>{curso.formato}</td>
                                                        <td>{curso.nivel_dificuldade}</td>
                                                        <td>{curso.nome_categoria || '-'}</td>
                                                        <td>{curso.nome_site || '-'}</td>
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

            <footer className="bg-dark text-white py-3 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
                </div>
            </footer>
        </div>
    );
};

export default CursosEntidade;