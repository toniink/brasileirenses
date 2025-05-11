import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TutorialGenerico = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutorialData, setTutorialData] = useState(null);
    const [conteudoCompleto, setConteudoCompleto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [softwareAssociado, setSoftwareAssociado] = useState(null);

    useEffect(() => {
        if (!id || isNaN(id)) {
            setError("ID do tutorial inválido");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca dados básicos do tutorial
                const tutorialRes = await fetch(`http://localhost:3000/tutoriais/${id}`);
                if (!tutorialRes.ok) throw new Error("Tutorial não encontrado");
                
                const tutorialData = await tutorialRes.json();
                if (!tutorialData) throw new Error("Dados do tutorial são inválidos");
                
                setTutorialData(tutorialData);

                // Busca conteúdo completo ordenado
                const conteudoRes = await fetch(`http://localhost:3000/tutoriais/${id}/conteudo`);
                if (!conteudoRes.ok) throw new Error("Conteúdo não encontrado");
                
                let conteudoData = await conteudoRes.json();
                if (!Array.isArray(conteudoData)) {
                    throw new Error("Formato de conteúdo inválido");
                }
                
                // Ordena as seções pela propriedade 'ordem'
                conteudoData = conteudoData.sort((a, b) => a.ordem - b.ordem);
                setConteudoCompleto(conteudoData);

                // Busca software associado se existir
                if (tutorialData.id_software) {
                    const softwareRes = await fetch(`http://localhost:3000/softwares/${tutorialData.id_software}`);
                    if (softwareRes.ok) {
                        const softwareData = await softwareRes.json();
                        setSoftwareAssociado(softwareData);
                    }
                }

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(err.message);
                setTutorialData(null);
                setConteudoCompleto([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const renderConteudoPorTipo = (secao) => {
        if (!secao?.conteudos || secao.conteudos.length === 0) {
            return (
                <div className="alert alert-warning">
                    Seção sem conteúdo disponível
                </div>
            );
        }

        switch(secao.tipo) {
            case 'titulo':
                return (
                    <h3 className="text-dark border-bottom pb-2 mb-3">
                        {secao.conteudos[0]?.texto || "Título não disponível"}
                    </h3>
                );

            case 'paragrafo':
                return secao.conteudos.map((conteudo, i) => (
                    <p key={`paragrafo-${i}`} className="text-secondary mb-3">
                        {conteudo?.texto || "Conteúdo não disponível"}
                    </p>
                ));

            case 'lista':
                const items = secao.conteudos.map(conteudo => 
                    conteudo?.item || conteudo?.texto || "Item sem conteúdo"
                );

                return (
                    <div className="mb-4">
                        <ul className="list-group">
                            {items.map((item, index) => (
                                <li key={`item-${index}`} className="list-group-item">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            case 'imagem':
                return (
                    <div className="text-center my-4">
                        {secao.conteudos[0]?.url ? (
                            <>
                                <img 
                                    src={secao.conteudos[0].url} 
                                    alt={secao.conteudos[0]?.descricao || "Imagem do tutorial"} 
                                    className="img-fluid rounded shadow" 
                                    style={{ maxWidth: "80%", maxHeight: "400px", objectFit: "contain" }} 
                                />
                                {secao.conteudos[0]?.descricao && (
                                    <p className="text-muted mt-2">{secao.conteudos[0].descricao}</p>
                                )}
                            </>
                        ) : (
                            <div className="alert alert-warning">Imagem não disponível</div>
                        )}
                    </div>
                );

            case 'codigo':
                return (
                    <div className="mb-4">
                        <pre className="bg-dark text-light p-3 rounded">
                            <code>{secao.conteudos[0]?.conteudo || "Código não disponível"}</code>
                        </pre>
                        {secao.conteudos[0]?.linguagem && (
                            <small className="text-muted">
                                Linguagem: {secao.conteudos[0].linguagem}
                            </small>
                        )}
                    </div>
                );

            case 'passo':
                return (
                    <div className="mb-4">
                        <h5 className="mb-3">Passo a Passo</h5>
                        {secao.conteudos.length > 0 ? (
                            <ol className="list-group list-group-numbered">
                                {secao.conteudos
                                    .sort((a, b) => (a?.numero || 0) - (b?.numero || 0))
                                    .map((passo, i) => (
                                        <li key={`passo-${i}`} className="list-group-item">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">Passo {passo?.numero || i+1}</div>
                                                {passo?.instrucao || "Instrução não disponível"}
                                            </div>
                                            {passo?.imagem && (
                                                <div className="mt-2 text-center">
                                                    <img 
                                                        src={passo.imagem} 
                                                        alt={`Passo ${passo.numero}`} 
                                                        className="img-fluid rounded" 
                                                        style={{ maxWidth: "60%" }} 
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    ))}
                            </ol>
                        ) : (
                            <div className="alert alert-warning">Nenhum passo disponível</div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="alert alert-warning">
                        Tipo de seção desconhecido: {secao.tipo}
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Carregando tutorial...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">
                    <h4>Erro ao carregar o tutorial</h4>
                    <p>{error}</p>
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
        <div className="container-fluid px-0">
            {/* Cabeçalho */}
            <header className="bg-primary text-white py-4 shadow">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="mb-0">{tutorialData?.titulo || "Tutorial sem título"}</h1>
                        {softwareAssociado && (
                            <button 
                                className="btn btn-light"
                                onClick={() => navigate(`/softwares/${softwareAssociado.id_softwares}`)}
                            >
                                Ver Software: {softwareAssociado.nome}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mensagem de erro (se houver) */}
            {error && (
                <div className="container mt-3">
                    <div className="alert alert-danger">
                        <p>Ocorreu um erro: {error}</p>
                    </div>
                </div>
            )}

            {/* Conteúdo Principal */}
            <main className="container py-4">
                {/* Descrição */}
                {tutorialData?.descricao && (
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-body">
                            <p className="lead mb-0">{tutorialData.descricao}</p>
                        </div>
                    </div>
                )}

                {/* Conteúdo do Tutorial */}
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {conteudoCompleto.length > 0 ? (
                            conteudoCompleto.map((secao) => (
                                <div 
                                    key={`secao-${secao.id_secao}`} 
                                    className="card mb-4 border-0 shadow-sm"
                                >
                                    <div className="card-body">
                                        {renderConteudoPorTipo(secao)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted">Nenhum conteúdo disponível para este tutorial</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    {tutorialData?.url && (
                        <a 
                            href={tutorialData.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary px-4"
                        >
                            Site Oficial
                        </a>
                    )}
                    
                    {softwareAssociado && (
                        <button 
                            className="btn btn-outline-primary px-4"
                            onClick={() => navigate(`/softwares/${softwareAssociado.id_softwares}`)}
                        >
                            Instalação do Software
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TutorialGenerico;