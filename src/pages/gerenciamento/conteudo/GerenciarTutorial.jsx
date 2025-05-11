import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarTutorial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const editMode = !!id;
    
    // Estados do componente
    const [softwares, setSoftwares] = useState([]);
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        id_software: ""
    });
    const [secoes, setSecoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Buscar dados iniciais
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                
                // Busca lista de softwares
                const softwaresRes = await fetch("http://localhost:3000/softwares");
                if (!softwaresRes.ok) throw new Error("Erro ao carregar softwares");
                setSoftwares(await softwaresRes.json());

                // Se estiver em modo edição, carrega os dados do tutorial
                if (editMode) {
                    const [tutorialRes, conteudoRes] = await Promise.all([
                        fetch(`http://localhost:3000/tutoriais/${id}`),
                        fetch(`http://localhost:3000/tutoriais/${id}/conteudo`)
                    ]);

                    if (!tutorialRes.ok || !conteudoRes.ok) {
                        throw new Error("Erro ao carregar dados do tutorial");
                    }

                    const tutorialData = await tutorialRes.json();
                    const conteudoData = await conteudoRes.json();

                    setFormData({
                        titulo: tutorialData.titulo,
                        descricao: tutorialData.descricao,
                        id_software: tutorialData.id_software || ""
                    });

                    setSecoes(conteudoData.sort((a, b) => a.ordem - b.ordem));
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [id, editMode]);

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
            conteudos: [criarConteudoInicial(tipo)]
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
            case 'imagem':
                return { url: "", descricao: "" };
            case 'codigo':
                return { linguagem: "javascript", conteudo: "" };
            case 'passo':
                return { numero: secoes.filter(s => s.tipo === 'passo').length + 1, instrucao: "", imagem: "" };
            default:
                return {};
        }
    };

    // Atualizar conteúdo da seção
    const atualizarConteudo = (secaoIndex, conteudoIndex, campo, valor) => {
        const novasSecoes = [...secoes];
        novasSecoes[secaoIndex].conteudos[conteudoIndex][campo] = valor;
        setSecoes(novasSecoes);
    };

    // Adicionar item à lista
    const adicionarItemLista = (secaoIndex) => {
        const novasSecoes = [...secoes];
        novasSecoes[secaoIndex].conteudos.push({ item: "" });
        setSecoes(novasSecoes);
    };

    // Remover item da lista
    const removerItemLista = (secaoIndex, itemIndex) => {
        const novasSecoes = [...secoes];
        novasSecoes[secaoIndex].conteudos.splice(itemIndex, 1);
        setSecoes(novasSecoes);
    };

    // Remover seção
    const removerSecao = (secaoIndex) => {
        setSecoes(secoes.filter((_, i) => i !== secaoIndex));
    };

    // Reordenar seções
    const reordenarSecoes = (fromIndex, toIndex) => {
        const novasSecoes = [...secoes];
        const [removed] = novasSecoes.splice(fromIndex, 1);
        novasSecoes.splice(toIndex, 0, removed);
        
        // Atualiza a ordem numérica
        setSecoes(novasSecoes.map((secao, index) => ({
            ...secao,
            ordem: index + 1
        })));
    };

    // Salvar tutorial
    const salvarTutorial = async () => {
        if (!formData.titulo.trim() || !formData.id_software) {
            setError("Título e software são obrigatórios!");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Dados básicos do tutorial
            const tutorialData = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                id_software: Number(formData.id_software),
                imagem_url: ""
            };

            // 1. Criar ou atualizar tutorial
            const tutorialEndpoint = editMode 
                ? `http://localhost:3000/tutoriais/${id}`
                : 'http://localhost:3000/tutoriais';
            
            const tutorialMethod = editMode ? 'PUT' : 'POST';
            
            const tutorialResponse = await fetch(tutorialEndpoint, {
                method: tutorialMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tutorialData)
            });

            const tutorialResult = await tutorialResponse.json();
            const tutorialIdToUse = editMode ? id : tutorialResult.id_tutorial;

            if (!tutorialIdToUse) throw new Error("Erro ao salvar tutorial");

            // 2. Limpar seções existentes (em edição)
            if (editMode) {
                const secoesRes = await fetch(`http://localhost:3000/tutoriais/${tutorialIdToUse}/secoes`);
                if (secoesRes.ok) {
                    const secoesExistentes = await secoesRes.json();
                    await Promise.all(
                        secoesExistentes.map(secao => 
                            fetch(`http://localhost:3000/tutoriais/${tutorialIdToUse}/secoes/${secao.id_secao}`, {
                                method: "DELETE"
                            })
                        )
                    );
                }
            }

            // 3. Salvar novas seções e conteúdos
            for (const secao of secoes) {
                // Salva a seção
                const secaoResponse = await fetch(
                    `http://localhost:3000/tutoriais/${tutorialIdToUse}/secoes`, 
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tipo: secao.tipo,
                            ordem: secao.ordem
                        })
                    }
                );

                const secaoData = await secaoResponse.json();
                
                // Salva cada conteúdo da seção
                await Promise.all(
                    secao.conteudos.map(conteudo => 
                        fetch(
                            `http://localhost:3000/tutoriais/${tutorialIdToUse}/secoes/${secaoData.id_secao}/conteudo`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    tipo: secao.tipo,
                                    ...conteudo
                                })
                            }
                        )
                    )
                );
            }

            setSuccess("Tutorial salvo com sucesso!");
            setTimeout(() => navigate(`/tutoriais/${tutorialIdToUse}`), 1500);
        } catch (err) {
            console.error("Erro ao salvar tutorial:", err);
            setError(err.message || "Erro ao salvar tutorial");
        } finally {
            setLoading(false);
        }
    };

    // Renderização condicional
    if (loading && !editMode) {
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
                            <Link to="/tutoriais" className="btn btn-link">Tutoriais</Link>
                            <Link to="/softwares" className="btn btn-link">Softwares</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h2 className="mb-4">
                            {editMode ? "Editar Tutorial" : "Criar Novo Tutorial"}
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
                                    <label className="form-label">Título do Tutorial*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        placeholder="Digite o título"
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
                                <h5 className="mb-0">Conteúdo do Tutorial</h5>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("titulo")}
                                        disabled={loading}
                                    >
                                        + Título
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("paragrafo")}
                                        disabled={loading}
                                    >
                                        + Parágrafo
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("lista")}
                                        disabled={loading}
                                    >
                                        + Lista
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("imagem")}
                                        disabled={loading}
                                    >
                                        + Imagem
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("codigo")}
                                        disabled={loading}
                                    >
                                        + Código
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => adicionarSecao("passo")}
                                        disabled={loading}
                                    >
                                        + Passo
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                {secoes.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        Nenhuma seção adicionada ainda
                                    </div>
                                ) : (
                                    secoes.map((secao, secaoIndex) => (
                                        <div 
                                            key={`secao-${secaoIndex}`} 
                                            className="mb-4 p-3 border rounded"
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 text-capitalize">
                                                    <span className="badge bg-secondary me-2">
                                                        {secao.ordem}
                                                    </span>
                                                    {secao.tipo}
                                                </h6>
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger me-2"
                                                        onClick={() => removerSecao(secaoIndex)}
                                                        disabled={loading}
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Renderização do conteúdo específico */}
                                            {secao.tipo === "titulo" && (
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    value={secao.conteudos[0].texto}
                                                    onChange={(e) => atualizarConteudo(secaoIndex, 0, "texto", e.target.value)}
                                                    placeholder="Digite o título"
                                                    disabled={loading}
                                                />
                                            )}

                                            {secao.tipo === "paragrafo" && (
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={secao.conteudos[0].texto}
                                                    onChange={(e) => atualizarConteudo(secaoIndex, 0, "texto", e.target.value)}
                                                    placeholder="Digite o parágrafo"
                                                    disabled={loading}
                                                />
                                            )}

                                            {secao.tipo === "lista" && (
                                                <div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <h6>Itens da Lista</h6>
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => adicionarItemLista(secaoIndex)}
                                                            disabled={loading}
                                                        >
                                                            + Item
                                                        </button>
                                                    </div>
                                                    {secao.conteudos.map((item, itemIndex) => (
                                                        <div key={`item-${itemIndex}`} className="input-group mb-2">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={item.item}
                                                                onChange={(e) => {
                                                                    const novasSecoes = [...secoes];
                                                                    novasSecoes[secaoIndex].conteudos[itemIndex].item = e.target.value;
                                                                    setSecoes(novasSecoes);
                                                                }}
                                                                placeholder="Digite um item"
                                                                disabled={loading}
                                                            />
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => removerItemLista(secaoIndex, itemIndex)}
                                                                disabled={loading}
                                                            >
                                                                Remover
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {secao.tipo === "imagem" && (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="form-label">URL da Imagem</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={secao.conteudos[0].url}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "url", e.target.value)}
                                                            placeholder="https://exemplo.com/imagem.jpg"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Descrição</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={secao.conteudos[0].descricao}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "descricao", e.target.value)}
                                                            placeholder="Descrição da imagem"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {secao.tipo === "codigo" && (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Linguagem</label>
                                                        <select
                                                            className="form-select"
                                                            value={secao.conteudos[0].linguagem}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "linguagem", e.target.value)}
                                                            disabled={loading}
                                                        >
                                                            <option value="javascript">JavaScript</option>
                                                            <option value="html">HTML</option>
                                                            <option value="css">CSS</option>
                                                            <option value="python">Python</option>
                                                            <option value="java">Java</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Código</label>
                                                        <textarea
                                                            className="form-control font-monospace"
                                                            rows="5"
                                                            value={secao.conteudos[0].conteudo}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "conteudo", e.target.value)}
                                                            placeholder="Cole seu código aqui"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {secao.tipo === "passo" && (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Número do Passo</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={secao.conteudos[0].numero}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "numero", e.target.value)}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label">Instrução</label>
                                                        <textarea
                                                            className="form-control"
                                                            rows="3"
                                                            value={secao.conteudos[0].instrucao}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "instrucao", e.target.value)}
                                                            placeholder="Descreva este passo"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label">URL da Imagem (opcional)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={secao.conteudos[0].imagem}
                                                            onChange={(e) => atualizarConteudo(secaoIndex, 0, "imagem", e.target.value)}
                                                            placeholder="https://exemplo.com/imagem.jpg"
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
                                onClick={salvarTutorial}
                                disabled={loading || !formData.titulo || !formData.id_software}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Salvando...
                                    </>
                                ) : (
                                    editMode ? "Atualizar Tutorial" : "Salvar Tutorial"
                                )}
                            </button>
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

export default GerenciarTutorial;