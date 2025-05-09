import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarSoftware = () => {
    const [softwares, setSoftwares] = useState([]);
    const [idSoftwareSelecionado, setIdSoftwareSelecionado] = useState("");
    const [conteudo, setConteudo] = useState([]);
    const [carregando, setCarregando] = useState(false);

    // 🚀 Buscar softwares disponíveis
    useEffect(() => {
        fetch("http://localhost:3000/softwares") // Alterado para porta 5000 (backend)
            .then((res) => res.json())
            .then((data) => setSoftwares(data))
            .catch((error) => console.error("Erro ao buscar softwares:", error));
    }, []);

    // 🚀 Carregar conteúdo quando selecionar um software
    useEffect(() => {
        if (idSoftwareSelecionado) {
            setCarregando(true);
            fetch(`http://localhost:3000/softwares/${idSoftwareSelecionado}/conteudoCompleto`)
                .then((res) => res.json())
                .then((data) => {
                    // Transforma a resposta da API no formato esperado pelo componente
                    const conteudoFormatado = data.map(secao => ({
                        tipo: secao.tipo,
                        ordem: secao.ordem,
                        texto: secao.conteudos[0]?.texto || '',
                        id_secao: secao.id_secao
                    }));
                    setConteudo(conteudoFormatado);
                })
                .catch((error) => console.error("Erro ao buscar conteúdo:", error))
                .finally(() => setCarregando(false));
        }
    }, [idSoftwareSelecionado]);

    // 🚀 Adicionar uma seção ao software (apenas no estado local)
    const adicionarSecao = (tipo) => {
        const novaSecao = { 
            tipo, 
            ordem: conteudo.length + 1, 
            texto: "", 
            id_secao: null // Será preenchido quando salvar
        };
        setConteudo([...conteudo, novaSecao]);
    };

    // 🚀 Atualizar o conteúdo das seções
    const atualizarConteudo = (index, campo, valor) => {
        const copiaConteudo = [...conteudo];
        copiaConteudo[index][campo] = valor;
        setConteudo(copiaConteudo);
    };

    // 🚀 Enviar seções e conteúdos para o banco
    const salvarSoftware = async () => {
        if (!idSoftwareSelecionado) {
            alert("Selecione um software primeiro!");
            return;
        }

        try {
            setCarregando(true);
            
            // Primeiro salva todas as seções
            for (const secao of conteudo) {
                // Se já tem ID, a seção já existe no banco
                if (secao.id_secao) continue;
                
                const response = await fetch("http://localhost:3000/softwares/secoes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_software: Number(idSoftwareSelecionado),
                        tipo: secao.tipo,
                        ordem: secao.ordem
                    })
                });

                const data = await response.json();
                if (!data.id_secao) {
                    throw new Error("Erro ao criar seção");
                }
                
                // Atualiza o ID da seção no estado local
                secao.id_secao = data.id_secao;
            }

            // Depois salva os conteúdos de cada seção
            for (const secao of conteudo) {
                let body = {
                    id_secao: secao.id_secao,
                    tipo: secao.tipo
                };

                // Monta o body de acordo com o tipo de conteúdo
                if (secao.tipo === 'area_atuacao') {
                    body.titulo = secao.texto.split('|')[0] || '';
                    body.descricao = secao.texto.split('|')[1] || '';
                } else if (secao.tipo === 'lista') {
                    body.item = secao.texto;
                } else {
                    body.texto = secao.texto;
                }

                await fetch("http://localhost:3000/softwares/conteudo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
            }

            alert("Conteúdo salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Ocorreu um erro ao salvar o conteúdo");
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Renderização condicional para cada tipo de conteúdo
    const renderizarInputConteudo = (secao, index) => {
        switch (secao.tipo) {
            case "lista":
                return (
                    <>
                        <h4>Lista:</h4>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Adicione itens separados por vírgula"
                            value={secao.texto}
                            onChange={(e) => atualizarConteudo(index, 'texto', e.target.value)}
                        />
                    </>
                );
            case "area_atuacao":
                return (
                    <>
                        <h4>Área de Atuação:</h4>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Título da área"
                            value={secao.texto.split('|')[0] || ''}
                            onChange={(e) => {
                                const partes = secao.texto.split('|');
                                partes[0] = e.target.value;
                                atualizarConteudo(index, 'texto', partes.join('|'));
                            }}
                        />
                        <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Descrição da área"
                            value={secao.texto.split('|')[1] || ''}
                            onChange={(e) => {
                                const partes = secao.texto.split('|');
                                partes[1] = e.target.value;
                                atualizarConteudo(index, 'texto', partes.join('|'));
                            }}
                        />
                    </>
                );
            default:
                return (
                    <>
                        <h4>{secao.tipo === "paragrafo" ? "Parágrafo:" : "Título:"}</h4>
                        <input
                            type="text"
                            className="form-control"
                            value={secao.texto}
                            onChange={(e) => atualizarConteudo(index, 'texto', e.target.value)}
                        />
                    </>
                );
        }
    };

    return (
        <div>
            {/* Cabeçalho (mantido igual) */}
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

            {/* Conteúdo principal */}
            <main className="container mt-4">
                <h2>Gerenciamento de Softwares</h2>

                {/* Seleção do Software */}
                <div className="mb-3">
                    <label>Selecione o Software:</label>
                    <select 
                        className="form-control" 
                        value={idSoftwareSelecionado} 
                        onChange={(e) => setIdSoftwareSelecionado(e.target.value)}
                        disabled={carregando}
                    >
                        <option value="">Selecione</option>
                        {softwares.map((software) => (
                            <option key={software.id_softwares} value={software.id_softwares}>
                                {software.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botões de Adicionar Seções */}
                <div className="mb-3">
                    <button 
                        className="btn btn-primary me-2" 
                        onClick={() => adicionarSecao("paragrafo")}
                        disabled={!idSoftwareSelecionado || carregando}
                    >
                        Adicionar Parágrafo
                    </button>
                    <button 
                        className="btn btn-secondary me-2" 
                        onClick={() => adicionarSecao("titulo")}
                        disabled={!idSoftwareSelecionado || carregando}
                    >
                        Adicionar Título
                    </button>
                    <button 
                        className="btn btn-warning me-2" 
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
                        Adicionar Área de Atuação
                    </button>
                </div>

                {/* Inputs Dinâmicos para Conteúdo */}
                {carregando && !conteudo.length ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                ) : (
                    conteudo.map((secao, index) => (
                        <div key={`${secao.id_secao || 'new'}-${index}`} className="mb-3 p-3 border rounded">
                            {renderizarInputConteudo(secao, index)}
                            <small className="text-muted">Tipo: {secao.tipo} | Ordem: {secao.ordem}</small>
                        </div>
                    ))
                )}

                {/* Botão de Salvar */}
                <button 
                    className="btn btn-success mt-3" 
                    onClick={salvarSoftware}
                    disabled={!idSoftwareSelecionado || !conteudo.length || carregando}
                >
                    {carregando ? 'Salvando...' : 'Salvar Conteúdo'}
                </button>
            </main>

            {/* Footer (mantido igual) */}
            <footer className="bg-primary text-light py-4 text-center">
                <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
            </footer>
        </div>
    );
};

export default GerenciarSoftware;