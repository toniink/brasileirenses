import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarConteudoCurso = () => {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [formData, setFormData] = useState({
        id_curso: "",
        titulo: "",
        descricao: ""
    });
    const [secoes, setSecoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Buscar cursos disponíveis
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:3000/cursos");
                if (!response.ok) throw new Error("Erro ao buscar cursos");
                const data = await response.json();
                setCursos(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar cursos:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    // Carregar conteúdo quando um curso é selecionado
    useEffect(() => {
        const fetchConteudoCurso = async () => {
            if (!formData.id_curso) {
                setSecoes([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`http://localhost:3000/cursos/${formData.id_curso}/content`);
                if (!response.ok) throw new Error("Erro ao buscar conteúdo");
                
                const data = await response.json();
                const dadosArray = Array.isArray(data) ? data : [];
                
                setSecoes(dadosArray.map(secao => ({
                    ...secao,
                    conteudos: Array.isArray(secao.conteudos) ? secao.conteudos : [],
                    editando: false
                })));
            } catch (err) {
                console.error("Erro ao buscar conteúdo:", err);
                setError(err.message);
                setSecoes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchConteudoCurso();
    }, [formData.id_curso]);

    // Manipuladores de formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Adicionar nova seção
    const adicionarSecao = (tipo) => {
        const novaSecao = {
            tipo,
            ordem: secoes.length + 1,
            conteudos: [criarConteudoInicial(tipo)],
            editando: true,
            id_secao_curso: null
        };
        setSecoes([...secoes, novaSecao]);
    };

    // Criar conteúdo inicial baseado no tipo
    const criarConteudoInicial = (tipo) => {
        switch(tipo) {
            case 'titulo':
            case 'paragrafo':
                return { texto: "" };
            case 'lista':
                return { item: "" };
            case 'area_atuacao':
                return { titulo: "", descricao: "" };
            case 'passo_a_passo':
                return { numero: secoes.filter(s => s.tipo === 'passo_a_passo').length + 1, instrucao: "", imagem: "" };
            case 'imagem':
                return { url: "", descricao: "" };
            default:
                return {};
        }
    };

    // Atualizar conteúdo da seção
    const atualizarConteudo = (secaoIndex, conteudoIndex, campo, valor) => {
        const novasSecoes = [...secoes];
        if (!novasSecoes[secaoIndex].conteudos[conteudoIndex]) {
            novasSecoes[secaoIndex].conteudos[conteudoIndex] = {};
        }
        novasSecoes[secaoIndex].conteudos[conteudoIndex][campo] = valor;
        novasSecoes[secaoIndex].editando = true;
        setSecoes(novasSecoes);
    };

    // Remover seção (apenas o conteúdo, não o curso)
    const removerSecao = async (secaoIndex) => {
        const secao = secoes[secaoIndex];
        
        if (!secao.id_secao_curso) {
            setSecoes(secoes.filter((_, i) => i !== secaoIndex));
            return;
        }

        try {
            setLoading(true);
            
            const response = await fetch(`http://localhost:3000/cursos/${secao.id_secao_curso}/conteudo`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Erro ao remover seção");

            setSecoes(secoes.filter((_, i) => i !== secaoIndex));
            setSuccess("Seção removida com sucesso!");
        } catch (err) {
            console.error("Erro ao remover seção:", err);
            setError("Erro ao remover seção: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Salvar alterações - VERSÃO CORRIGIDA
    const salvarAlteracoes = async () => {
        if (!formData.id_curso) {
            setError("Selecione um curso primeiro!");
            return;
        }

        console.log("Iniciando salvamento...", { secoesModificadas: secoes.filter(s => s.editando) });

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Processa apenas as seções modificadas
            const secoesModificadas = secoes.filter(s => s.editando);
            
            for (const secao of secoesModificadas) {
                console.log(`Processando seção: ${secao.tipo}`, secao);
                
                if (secao.id_secao_curso) {
                    // Atualizar conteúdo existente
                    console.log("Atualizando conteúdo existente...");
                    const response = await fetch(`http://localhost:3000/cursos/conteudo/${secao.tipo}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_secao_curso: secao.id_secao_curso,
                            ...secao.conteudos[0]
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `Falha ao atualizar ${secao.tipo}`);
                    }
                    
                    console.log("Conteúdo atualizado com sucesso");
                } else {
                    // Criar nova seção e conteúdo
                    console.log("Criando nova seção...");
                    
                    // 1. Criar a seção primeiro
                    const secaoResponse = await fetch(`http://localhost:3000/cursos/${formData.id_curso}/sections`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            tipo: secao.tipo,
                            ordem: secao.ordem,
                            titulo: secao.titulo || ""
                        })
                    });
                    
                    if (!secaoResponse.ok) {
                        const errorData = await secaoResponse.json();
                        throw new Error(errorData.error || "Falha ao criar seção");
                    }

                    const novaSecao = await secaoResponse.json();
                    console.log("Seção criada:", novaSecao);
                    
                    // 2. Adicionar conteúdo à seção
                    console.log("Adicionando conteúdo à seção...");
                    const conteudoResponse = await fetch(`http://localhost:3000/cursos/conteudo/${secao.tipo}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_secao_curso: novaSecao.id_secao_curso,
                            ...secao.conteudos[0]
                        })
                    });

                    if (!conteudoResponse.ok) {
                        const errorData = await conteudoResponse.json();
                        throw new Error(errorData.error || `Falha ao criar conteúdo ${secao.tipo}`);
                    }
                    
                    console.log("Conteúdo adicionado com sucesso");
                }
            }

            setSuccess("Alterações salvas com sucesso!");
            console.log("Todas as alterações foram salvas");
            
            // Recarrega as seções atualizadas
            const response = await fetch(`http://localhost:3000/cursos/${formData.id_curso}/content`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao recarregar conteúdo");
            }
            
            const data = await response.json();
            setSecoes((Array.isArray(data) ? data : []).map(s => ({ ...s, editando: false })));
        } catch (err) {
            console.error("Erro detalhado ao salvar:", {
                message: err.message,
                stack: err.stack
            });
            setError("Erro ao salvar alterações: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Renderização condicional
    if (loading && cursos.length === 0) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Cabeçalho */}
            <header className="bg-light shadow-sm">
                <div className="container py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <nav className="d-flex gap-3">
                            <Link to="/" className="btn btn-link">Home</Link>
                            <Link to="/cursos" className="btn btn-link">Cursos</Link>
                            <Link to="/categorias" className="btn btn-link">Categorias</Link>
                        </nav>
                        <button className="btn btn-primary">Fazer Login</button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h2 className="mb-4">Gerenciar Conteúdo de Curso</h2>

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

                        {/* Formulário básico */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Curso Relacionado*</label>
                                    <select 
                                        className="form-select"
                                        name="id_curso"
                                        value={formData.id_curso}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Selecione um curso</option>
                                        {cursos.map(curso => (
                                            <option key={curso.id_cursos} value={curso.id_cursos}>
                                                {curso.nome_curso}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        placeholder="Digite o título"
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
                                        onChange={handleInputChange}
                                        placeholder="Digite uma descrição"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gerenciamento de Seções */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Conteúdo do Curso</h5>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("titulo")}
                                        disabled={loading || !formData.id_curso}
                                    >
                                        + Título
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("paragrafo")}
                                        disabled={loading || !formData.id_curso}
                                    >
                                        + Parágrafo
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("lista")}
                                        disabled={loading || !formData.id_curso}
                                    >
                                        + Lista
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("area_atuacao")}
                                        disabled={loading || !formData.id_curso}
                                    >
                                        + Área
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("passo_a_passo")}
                                        disabled={loading || !formData.id_curso}
                                    >
                                        + Passo a Passo
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("imagem")}
                                        disabled={loading || !formData.id_curso}
                                    >
                                        + Imagem
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                {loading && secoes.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    </div>
                                ) : secoes.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        {formData.id_curso 
                                            ? "Nenhuma seção adicionada ainda" 
                                            : "Selecione um curso para começar"}
                                    </div>
                                ) : (
                                    secoes.map((secao, secaoIndex) => (
                                        <div 
                                            key={`secao-${secao.id_secao_curso || secaoIndex}`}
                                            className={`mb-4 p-3 border rounded ${secao.editando ? 'border-primary' : ''}`}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 text-capitalize">
                                                    <span className="badge bg-secondary me-2">
                                                        {secao.ordem}
                                                    </span>
                                                    {secao.tipo}
                                                    {secao.id_secao_curso && (
                                                        <small className="text-muted ms-2">(ID: {secao.id_secao_curso})</small>
                                                    )}
                                                </h6>
                                                <div>
                                                    {secao.editando && (
                                                        <span className="badge bg-primary me-2">Modificado</span>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removerSecao(secaoIndex)}
                                                        disabled={loading}
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Renderização do conteúdo específico */}
                                            {["titulo", "paragrafo"].includes(secao.tipo) && (
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    value={secao.conteudos[0]?.texto || ""}
                                                    onChange={(e) => atualizarConteudo(secaoIndex, 0, "texto", e.target.value)}
                                                    placeholder={`Digite ${secao.tipo}`}
                                                    disabled={loading}
                                                />
                                            )}

                                            {secao.tipo === "lista" && (
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    value={secao.conteudos[0]?.item || ""}
                                                    onChange={(e) => atualizarConteudo(secaoIndex, 0, "item", e.target.value)}
                                                    placeholder="Digite item da lista"
                                                    disabled={loading}
                                                />
                                            )}

                                            {secao.tipo === "area_atuacao" && (
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="form-control mb-2"
                                                        value={secao.conteudos[0]?.titulo || ""}
                                                        onChange={(e) => atualizarConteudo(secaoIndex, 0, "titulo", e.target.value)}
                                                        placeholder="Título da área"
                                                        disabled={loading}
                                                    />
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={secao.conteudos[0]?.descricao || ""}
                                                        onChange={(e) => atualizarConteudo(secaoIndex, 0, "descricao", e.target.value)}
                                                        placeholder="Descrição da área"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            )}

                                            {secao.tipo === "passo_a_passo" && (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Número do Passo</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={secao.conteudos[0]?.numero || secaoIndex + 1}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "numero", parseInt(e.target.value))}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Instrução</label>
                                                        <textarea
                                                            className="form-control"
                                                            value={secao.conteudos[0]?.instrucao || ""}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "instrucao", e.target.value)}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">URL da Imagem (opcional)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={secao.conteudos[0]?.imagem || ""}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "imagem", e.target.value)}
                                                            placeholder="https://exemplo.com/imagem.jpg"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {secao.tipo === "imagem" && (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="form-label">URL da Imagem</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={secao.conteudos[0]?.url || ""}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "url", e.target.value)}
                                                            placeholder="https://exemplo.com/imagem.jpg"
                                                            disabled={loading}
                                                        />
                                                        <small className="text-muted">(Funcionalidade de imagem será implementada posteriormente)</small>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Descrição</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={secao.conteudos[0]?.descricao || ""}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "descricao", e.target.value)}
                                                            placeholder="Descrição da imagem"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="d-flex justify-content-between">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary px-4"
                                onClick={salvarAlteracoes}
                                disabled={loading || !formData.id_curso || !secoes.some(s => s.editando)}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Salvando...
                                    </>
                                ) : (
                                    "Salvar Alterações"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Rodapé */}
            <footer className="bg-dark text-white py-3 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} - Desenvolvido por Brasilierenses</p>
                </div>
            </footer>
        </div>
    );
};

export default GerenciarConteudoCurso;