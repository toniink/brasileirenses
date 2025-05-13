import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarConteudoSoftware = () => {
    const navigate = useNavigate();
    const [softwares, setSoftwares] = useState([]);
    const [formData, setFormData] = useState({
        id_software: "",
        titulo: "",
        descricao: ""
    });
    const [secoes, setSecoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Buscar softwares disponíveis
    useEffect(() => {
        const fetchSoftwares = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:3000/softwares");
                if (!response.ok) throw new Error("Erro ao buscar softwares");
                const data = await response.json();
                setSoftwares(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar softwares:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSoftwares();
    }, []);

    // Carregar conteúdo quando um software é selecionado
    useEffect(() => {
        const fetchConteudoSoftware = async () => {
            if (!formData.id_software) {
                setSecoes([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`http://localhost:3000/softwares/${formData.id_software}/content`);
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

        fetchConteudoSoftware();
    }, [formData.id_software]);

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
            id_secao: null
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

    // Remover seção
    const removerSecao = (secaoIndex) => {
        setSecoes(secoes.filter((_, i) => i !== secaoIndex));
    };

    // Salvar alterações
    const salvarAlteracoes = async () => {
        if (!formData.id_software) {
            setError("Selecione um software primeiro!");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Processa cada seção modificada
            for (const secao of secoes.filter(s => s.editando)) {
                if (secao.id_secao) {
                    // Atualizar seção existente
                    await fetch(`http://localhost:3000/softwares/conteudo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_secao: secao.id_secao,
                            tipo: secao.tipo,
                            ...secao.conteudos[0]
                        })
                    });
                } else {
                    // Criar nova seção
                    const secaoResponse = await fetch(`http://localhost:3000/softwares/${formData.id_software}/sections`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            tipo: secao.tipo,
                            ordem: secao.ordem
                        })
                    });
                    
                    const novaSecao = await secaoResponse.json();
                    
                    // Criar conteúdo para a nova seção
                    await fetch(`http://localhost:3000/softwares/conteudo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_secao: novaSecao.id_secao,
                            tipo: secao.tipo,
                            ...secao.conteudos[0]
                        })
                    });
                }
            }

            // Recarrega as seções após salvar
            const response = await fetch(`http://localhost:3000/softwares/${formData.id_software}/content`);
            const data = await response.json();
            setSecoes((Array.isArray(data) ? data : []).map(s => ({ ...s, editando: false })));
            
            setSuccess("Alterações salvas com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar:", err);
            setError("Erro ao salvar alterações: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Renderização condicional
    if (loading && softwares.length === 0) {
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
                            <Link to="/softwares" className="btn btn-link">Softwares</Link>
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
                        <h2 className="mb-4">Gerenciar Conteúdo de Software</h2>

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

                        {/* Formulário básico */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Software Relacionado*</label>
                                    <select 
                                        className="form-select"
                                        name="id_software"
                                        value={formData.id_software}
                                        onChange={handleInputChange}
                                        required
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
                                <h5 className="mb-0">Conteúdo do Software</h5>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("titulo")}
                                        disabled={loading || !formData.id_software}
                                    >
                                        + Título
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("paragrafo")}
                                        disabled={loading || !formData.id_software}
                                    >
                                        + Parágrafo
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("lista")}
                                        disabled={loading || !formData.id_software}
                                    >
                                        + Lista
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("area_atuacao")}
                                        disabled={loading || !formData.id_software}
                                    >
                                        + Área
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("imagem")}
                                        disabled={loading || !formData.id_software}
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
                                        {formData.id_software 
                                            ? "Nenhuma seção adicionada ainda" 
                                            : "Selecione um software para começar"}
                                    </div>
                                ) : (
                                    secoes.map((secao, secaoIndex) => (
                                        <div 
                                            key={`secao-${secao.id_secao || secaoIndex}`}
                                            className={`mb-4 p-3 border rounded ${secao.editando ? 'border-primary' : ''}`}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 text-capitalize">
                                                    <span className="badge bg-secondary me-2">
                                                        {secao.ordem}
                                                    </span>
                                                    {secao.tipo}
                                                    {secao.id_secao && (
                                                        <small className="text-muted ms-2">(ID: {secao.id_secao})</small>
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
                                disabled={loading || !formData.id_software || !secoes.some(s => s.editando)}
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

export default GerenciarConteudoSoftware;