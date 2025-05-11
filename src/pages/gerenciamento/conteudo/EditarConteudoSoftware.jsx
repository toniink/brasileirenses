import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditarConteudoSoftware = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [secoes, setSecoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [software, setSoftware] = useState(null);

    // 🚀 Carregar conteúdo existente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCarregando(true);
                setErro(null);
                
                // 1. Buscar informações básicas do software
                const softwareRes = await fetch(`http://localhost:3000/softwares/${id}`);
                if (!softwareRes.ok) throw new Error("Software não encontrado");
                const softwareData = await softwareRes.json();
                setSoftware(softwareData);
                
                // 2. Buscar conteúdo existente
                const contentRes = await fetch(`http://localhost:3000/softwares/${id}/content`);
                if (!contentRes.ok) throw new Error("Erro ao buscar conteúdo");
                
                const contentData = await contentRes.json();
                const dadosArray = Array.isArray(contentData) ? contentData : [];
                
                // Marcar todas as seções como editáveis
                const secoesFormatadas = dadosArray.map(secao => ({
                    id_secao: secao.id_secao,
                    tipo: secao.tipo,
                    ordem: secao.ordem,
                    conteudos: Array.isArray(secao.conteudos) ? secao.conteudos : [],
                    editando: true // Todas as seções são editáveis por padrão
                }));
                
                setSecoes(secoesFormatadas);
                
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        };
        
        fetchData();
    }, [id]);

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

    // 🚀 Salvar alterações
    const salvarAlteracoes = async () => {
        try {
            setCarregando(true);
            setErro(null);

            // Processa cada seção modificada
            for (const secao of secoes) {
                try {
                    // Atualizar conteúdo de cada seção existente
                    for (const conteudo of secao.conteudos) {
                        const response = await fetch(`http://localhost:3000/softwares/conteudo`, {
                            method: "PUT", // Usando PUT para atualização
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                id_secao: secao.id_secao,
                                tipo: secao.tipo,
                                ...conteudo
                            })
                        });

                        if (!response.ok) {
                            throw new Error(`Erro ao atualizar conteúdo: ${response.status}`);
                        }
                    }
                } catch (error) {
                    console.error(`Erro ao processar seção:`, error);
                    throw error;
                }
            }
            
            alert("Conteúdo atualizado com sucesso!");
            navigate(`/softwares/${id}`);
            
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setErro("Erro ao salvar alterações: " + error.message);
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Renderizar inputs de edição
    const renderizarEditorSecao = (secao, indexSecao) => {
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

    // 🚀 Renderização condicional
    if (carregando && !software) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Carregando conteúdo do software...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">
                    <h4>Erro ao carregar conteúdo</h4>
                    <p>{erro}</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>
            </div>
        );
    }

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
                        </nav>
                        <button className="btn btn-primary">Fazer Login</button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Editando Conteúdo: {software?.nome}</h2>
                    <button 
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/softwares/${id}`)}
                    >
                        Ver Página Pública
                    </button>
                </div>
                
                {/* Mensagens de Erro */}
                {erro && (
                    <div className="alert alert-danger">
                        {erro}
                    </div>
                )}

                {/* Lista de Seções Editáveis */}
                <div className="card shadow">
                    <div className="card-body">
                        <h5 className="card-title mb-4">Seções do Conteúdo</h5>
                        
                        {secoes.length === 0 ? (
                            <div className="alert alert-info">
                                Nenhuma seção encontrada para este software.
                            </div>
                        ) : (
                            <div className="list-group">
                                {secoes.map((secao, index) => (
                                    <div 
                                        key={secao.id_secao}
                                        className="list-group-item border-primary"
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0 text-capitalize">
                                                {secao.tipo} - Ordem: {secao.ordem}
                                                <small className="text-muted ms-2">(ID: {secao.id_secao})</small>
                                            </h6>
                                            <span className="badge bg-info">Editando</span>
                                        </div>
                                        {renderizarEditorSecao(secao, index)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                        disabled={carregando}
                    >
                        Cancelar
                    </button>
                    
                    <button
                        className="btn btn-primary"
                        onClick={salvarAlteracoes}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Salvando...
                            </>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </button>
                </div>
            </main>

            {/* Rodapé */}
            <footer className="bg-primary text-white py-3 mt-4">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} - CMS de Conteúdo</p>
                </div>
            </footer>
        </div>
    );
};

export default EditarConteudoSoftware;