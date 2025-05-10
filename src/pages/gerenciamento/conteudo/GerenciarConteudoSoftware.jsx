import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarConteudoSoftware = () => {
    const [softwares, setSoftwares] = useState([]);
    const [idSoftwareSelecionado, setIdSoftwareSelecionado] = useState("");
    const [secoes, setSecoes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    // 🚀 Buscar softwares disponíveis
    useEffect(() => {
        setCarregando(true);
        fetch("http://localhost:3000/softwares")
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar softwares");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setSoftwares(data);
                } else {
                    setSoftwares([]);
                    console.warn("Dados recebidos não são um array:", data);
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar softwares:", error);
                setErro(error.message);
            })
            .finally(() => setCarregando(false));
    }, []);

    // 🚀 Carregar seções quando selecionar um software
    useEffect(() => {
        if (idSoftwareSelecionado) {
            setCarregando(true);
            setErro(null);
            
            fetch(`http://localhost:3000/softwares/${idSoftwareSelecionado}/content`)
                .then((res) => {
                    if (!res.ok) throw new Error("Erro ao buscar conteúdo");
                    return res.json();
                })
                .then((data) => {
                    // Garante que data seja um array antes de usar map
                    const dadosArray = Array.isArray(data) ? data : [];
                    const secoesFormatadas = dadosArray.map(secao => ({
                        id_secao: secao.id_secao,
                        tipo: secao.tipo,
                        ordem: secao.ordem,
                        conteudos: Array.isArray(secao.conteudos) ? secao.conteudos : [],
                        editando: false
                    }));
                    setSecoes(secoesFormatadas);
                })
                .catch((error) => {
                    console.error("Erro ao buscar conteúdo:", error);
                    setErro(error.message);
                    setSecoes([]); // Garante array vazio em caso de erro
                })
                .finally(() => setCarregando(false));
        } else {
            setSecoes([]); // Limpa seções quando nenhum software está selecionado
        }
    }, [idSoftwareSelecionado]);

    // 🚀 Adicionar uma nova seção (apenas no estado local)
    const adicionarSecao = (tipo) => {
        const novaSecao = { 
            tipo, 
            ordem: secoes.length + 1, 
            conteudos: [{
                texto: "",
                ...(tipo === 'area_atuacao' ? { titulo: "", descricao: "" } : {}),
                ...(tipo === 'lista' ? { item: "" } : {})
            }],
            editando: true,
            id_secao: null // Marca como nova seção
        };
        setSecoes([...secoes, novaSecao]);
    };

    // 🚀 Atualizar conteúdo de uma seção
    const atualizarConteudo = (indexSecao, indexConteudo, campo, valor) => {
        const novasSecoes = [...secoes];
        if (!novasSecoes[indexSecao].conteudos[indexConteudo]) {
            novasSecoes[indexSecao].conteudos[indexConteudo] = {};
        }
        novasSecoes[indexSecao].conteudos[indexConteudo][campo] = valor;
        novasSecoes[indexSecao].editando = true;
        setSecoes(novasSecoes);
    };

    // 🚀 Salvar todas as alterações no backend
    const salvarAlteracoes = async () => {
        if (!idSoftwareSelecionado) {
            setErro("Selecione um software primeiro!");
            return;
        }

        try {
            setCarregando(true);
            setErro(null);

            // Processa cada seção modificada
            for (const secao of secoes.filter(s => s.editando)) {
                try {
                    if (secao.id_secao) {
                        // Seção existente - atualizar conteúdo
                        for (const conteudo of secao.conteudos) {
                            const response = await fetch(`http://localhost:3000/softwares/conteudo`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id_secao: secao.id_secao,
                                    tipo: secao.tipo,
                                    ...conteudo
                                })
                            });

                            if (!response.ok) {
                                throw new Error(`Erro ao salvar conteúdo: ${response.status}`);
                            }
                        }
                    } else {
                        // Nova seção - criar primeiro a seção
                        const secaoResponse = await fetch(`http://localhost:3000/softwares/${idSoftwareSelecionado}/sections`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                tipo: secao.tipo,
                                ordem: secao.ordem
                            })
                        });
                        
                        if (!secaoResponse.ok) {
                            throw new Error(`Erro ao criar seção: ${secaoResponse.status}`);
                        }

                        const novaSecao = await secaoResponse.json();
                        
                        // Depois criar os conteúdos
                        for (const conteudo of secao.conteudos) {
                            const contentResponse = await fetch(`http://localhost:3000/softwares/conteudo`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id_secao: novaSecao.id_secao,
                                    tipo: secao.tipo,
                                    ...conteudo
                                })
                            });

                            if (!contentResponse.ok) {
                                throw new Error(`Erro ao salvar conteúdo: ${contentResponse.status}`);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Erro ao processar seção:`, error);
                    throw error; // Propaga o erro para ser capturado no catch externo
                }
            }

            // Recarrega as seções após salvar
            const response = await fetch(`http://localhost:3000/softwares/${idSoftwareSelecionado}/content`);
            if (!response.ok) {
                throw new Error(`Erro ao recarregar conteúdo: ${response.status}`);
            }

            const data = await response.json();
            const dadosArray = Array.isArray(data) ? data : [];
            setSecoes(dadosArray.map(s => ({ ...s, editando: false })));
            
            alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setErro("Erro ao salvar alterações: " + error.message);
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Renderizar inputs de edição para cada tipo de seção
    const renderizarEditorSecao = (secao, indexSecao) => {
        // Garante que conteudos seja um array
        const conteudos = Array.isArray(secao.conteudos) ? secao.conteudos : [];
        
        return conteudos.map((conteudo, indexConteudo) => {
            switch (secao.tipo) {
                case "titulo":
                case "paragrafo":
                    return (
                        <div key={indexConteudo} className="mb-3">
                            <h4>{secao.tipo === "titulo" ? "Título" : "Parágrafo"}:</h4>
                            <input
                                type="text"
                                className="form-control"
                                value={conteudo.texto || ""}
                                onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'texto', e.target.value)}
                            />
                        </div>
                    );
                case "lista":
                    return (
                        <div key={indexConteudo} className="mb-3">
                            <h4>Item da Lista:</h4>
                            <input
                                type="text"
                                className="form-control"
                                value={conteudo.item || ""}
                                onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'item', e.target.value)}
                            />
                        </div>
                    );
                case "area_atuacao":
                    return (
                        <div key={indexConteudo} className="mb-3">
                            <h4>Área de Atuação:</h4>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Título"
                                value={conteudo.titulo || ""}
                                onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'titulo', e.target.value)}
                            />
                            <textarea
                                className="form-control"
                                placeholder="Descrição"
                                value={conteudo.descricao || ""}
                                onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'descricao', e.target.value)}
                            />
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Cabeçalho */}
            <header className="bg-light py-3">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <nav className="d-flex gap-3">
                            <Link to="/" className="btn btn-link">HOME</Link>
                            <Link to="/softwares" className="btn btn-link">SOFTWARES</Link>
                            <Link to="/categorias" className="btn btn-link">CATEGORIAS</Link>
                            <button className="btn btn-link">CONTATO</button>
                        </nav>
                        <button className="btn btn-primary">Fazer Login</button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <h2 className="mb-4">Gerenciamento de Conteúdo</h2>
                
                {/* Mensagens de Erro */}
                {erro && (
                    <div className="alert alert-danger">
                        {erro}
                    </div>
                )}

                {/* Seleção do Software */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Selecione o Software</h5>
                        <select 
                            className="form-select"
                            value={idSoftwareSelecionado} 
                            onChange={(e) => setIdSoftwareSelecionado(e.target.value)}
                            disabled={carregando}
                        >
                            <option value="">Selecione um software</option>
                            {softwares.map((software) => (
                                <option key={software.id_softwares} value={software.id_softwares}>
                                    {software.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Controles de Adição */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Adicionar Seção</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <button 
                                className="btn btn-primary"
                                onClick={() => adicionarSecao("titulo")}
                                disabled={!idSoftwareSelecionado || carregando}
                            >
                                Adicionar Título
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => adicionarSecao("paragrafo")}
                                disabled={!idSoftwareSelecionado || carregando}
                            >
                                Adicionar Parágrafo
                            </button>
                            <button 
                                className="btn btn-warning"
                                onClick={() => adicionarSecao("lista")}
                                disabled={!idSoftwareSelecionado || carregando}
                            >
                                Adicionar Lista
                            </button>
                            <button 
                                className="btn btn-info"
                                onClick={() => adicionarSecao("area_atuacao")}
                                disabled={!idSoftwareSelecionado || carregando}
                            >
                                Adicionar Área
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Seções */}
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Seções do Conteúdo</h5>
                        
                        {carregando && secoes.length === 0 ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Carregando...</span>
                                </div>
                            </div>
                        ) : secoes.length === 0 ? (
                            <div className="alert alert-info">
                                {idSoftwareSelecionado 
                                    ? "Nenhuma seção encontrada. Adicione uma seção."
                                    : "Selecione um software para visualizar ou adicionar seções."}
                            </div>
                        ) : (
                            <div className="list-group">
                                {secoes.map((secao, index) => (
                                    <div 
                                        key={`${secao.id_secao || 'new'}-${index}`}
                                        className={`list-group-item ${secao.editando ? 'border-primary' : ''}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0 text-capitalize">
                                                {secao.tipo} - Ordem: {secao.ordem}
                                                {secao.id_secao && <small className="text-muted ms-2">(ID: {secao.id_secao})</small>}
                                            </h6>
                                            {secao.editando && (
                                                <span className="badge bg-primary">Modificado</span>
                                            )}
                                        </div>
                                        {renderizarEditorSecao(secao, index)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botão de Salvar */}
                <div className="mt-4">
                    <button 
                        className="btn btn-success px-4 py-2"
                        onClick={salvarAlteracoes}
                        disabled={!idSoftwareSelecionado || carregando || !secoes.some(s => s.editando)}
                    >
                        {carregando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Salvando...
                            </>
                        ) : (
                            "Salvar Todas as Alterações"
                        )}
                    </button>
                </div>
            </main>

            {/* Rodapé */}
            <footer className="bg-primary text-white py-3 mt-4">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} - Desenvolvido por Brasilierenses</p>
                </div>
            </footer>
        </div>
    );
};

export default GerenciarConteudoSoftware;