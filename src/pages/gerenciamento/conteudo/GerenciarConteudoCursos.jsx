import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarConteudoCurso = () => {
    const [cursos, setCursos] = useState([]);
    const [idCursoSelecionado, setIdCursoSelecionado] = useState("");
    const [secoes, setSecoes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    // 🚀 Buscar cursos disponíveis
    useEffect(() => {
        setCarregando(true);
        fetch("http://localhost:3000/cursos")
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar cursos");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setCursos(data);
                } else {
                    setCursos([]);
                    console.warn("Dados recebidos não são um array:", data);
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar cursos:", error);
                setErro(error.message);
            })
            .finally(() => setCarregando(false));
    }, []);

    // 🚀 Carregar seções quando selecionar um curso
    useEffect(() => {
        if (idCursoSelecionado) {
            setCarregando(true);
            setErro(null);
            
            fetch(`http://localhost:3000/cursos/${idCursoSelecionado}/content`)
                .then((res) => {
                    if (!res.ok) throw new Error("Erro ao buscar conteúdo");
                    return res.json();
                })
                .then((data) => {
                    const dadosArray = Array.isArray(data) ? data : [];
                    const secoesFormatadas = dadosArray.map(secao => ({
                        id_secao_curso: secao.id_secao_curso,
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
                    setSecoes([]);
                })
                .finally(() => setCarregando(false));
        } else {
            setSecoes([]);
        }
    }, [idCursoSelecionado]);

    // 🚀 Adicionar uma nova seção (apenas no estado local)
    const adicionarSecao = (tipo) => {
        const novaSecao = { 
            tipo, 
            ordem: secoes.length + 1, 
            conteudos: [{
                texto: "",
                ...(tipo === 'area_atuacao' ? { titulo: "", descricao: "" } : {}),
                ...(tipo === 'lista' ? { item: "" } : {}),
                ...(tipo === 'passo_a_passo' ? { numero: secoes.length + 1, instrucao: "", imagem: "" } : {})
            }],
            editando: true,
            id_secao_curso: null
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
        if (!idCursoSelecionado) {
            setErro("Selecione um curso primeiro!");
            return;
        }

        try {
            setCarregando(true);
            setErro(null);

            for (const secao of secoes.filter(s => s.editando)) {
                try {
                    if (secao.id_secao_curso) {
                        // Seção existente - atualizar conteúdo
                        for (const conteudo of secao.conteudos) {
                            const response = await fetch(`http://localhost:3000/cursos/conteudo/${secao.tipo}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id_secao_curso: secao.id_secao_curso,
                                    ...conteudo
                                })
                            });

                            if (!response.ok) {
                                throw new Error(`Erro ao salvar conteúdo: ${response.status}`);
                            }
                        }
                    } else {
                        // Nova seção - criar primeiro a seção
                        const secaoResponse = await fetch(`http://localhost:3000/cursos/${idCursoSelecionado}/sections`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                tipo: secao.tipo,
                                ordem: secao.ordem,
                                ...(secao.tipo === 'titulo' && secao.conteudos[0]?.texto ? { titulo: secao.conteudos[0].texto } : {})
                            })
                        });
                        
                        if (!secaoResponse.ok) {
                            throw new Error(`Erro ao criar seção: ${secaoResponse.status}`);
                        }

                        const novaSecao = await secaoResponse.json();
                        
                        // Depois criar os conteúdos (exceto título que já foi criado)
                        if (secao.tipo !== 'titulo') {
                            for (const conteudo of secao.conteudos) {
                                const contentResponse = await fetch(`http://localhost:3000/cursos/conteudo/${secao.tipo}`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        id_secao_curso: novaSecao.id_secao_curso,
                                        ...conteudo
                                    })
                                });

                                if (!contentResponse.ok) {
                                    throw new Error(`Erro ao salvar conteúdo: ${contentResponse.status}`);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Erro ao processar seção:`, error);
                    throw error;
                }
            }

            // Recarrega as seções após salvar
            const response = await fetch(`http://localhost:3000/cursos/${idCursoSelecionado}/content`);
            if (!response.ok) {
                throw new Error(`Erro ao recarregar conteúdo: ${response.status}`);
            }

            const data = await response.json();
            setSecoes((Array.isArray(data) ? data : []).map(s => ({ ...s, editando: false })));
            
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
                case "passo_a_passo":
                    return (
                        <div key={indexConteudo} className="mb-3">
                            <h4>Passo {conteudo.numero || indexConteudo + 1}:</h4>
                            <div className="mb-2">
                                <label className="form-label">Número do Passo</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={conteudo.numero || indexConteudo + 1}
                                    onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'numero', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Instrução</label>
                                <textarea
                                    className="form-control"
                                    value={conteudo.instrucao || ""}
                                    onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'instrucao', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="form-label">URL da Imagem (opcional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={conteudo.imagem || ""}
                                    onChange={(e) => atualizarConteudo(indexSecao, indexConteudo, 'imagem', e.target.value)}
                                />
                            </div>
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
                            <Link to="/cursos" className="btn btn-link">CURSOS</Link>
                            <Link to="/categorias" className="btn btn-link">CATEGORIAS</Link>
                            <button className="btn btn-link">CONTATO</button>
                        </nav>
                        <button className="btn btn-primary">Fazer Login</button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container flex-grow-1 py-4">
                <h2 className="mb-4">Gerenciamento de Conteúdo do Curso</h2>
                
                {/* Mensagens de Erro */}
                {erro && (
                    <div className="alert alert-danger">
                        {erro}
                    </div>
                )}

                {/* Seleção do Curso */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Selecione o Curso</h5>
                        <select 
                            className="form-select"
                            value={idCursoSelecionado} 
                            onChange={(e) => setIdCursoSelecionado(e.target.value)}
                            disabled={carregando}
                        >
                            <option value="">Selecione um curso</option>
                            {cursos.map((curso) => (
                                <option key={curso.id_cursos} value={curso.id_cursos}>
                                    {curso.nome_curso}
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
                                disabled={!idCursoSelecionado || carregando}
                            >
                                Adicionar Título
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => adicionarSecao("paragrafo")}
                                disabled={!idCursoSelecionado || carregando}
                            >
                                Adicionar Parágrafo
                            </button>
                            <button 
                                className="btn btn-warning"
                                onClick={() => adicionarSecao("lista")}
                                disabled={!idCursoSelecionado || carregando}
                            >
                                Adicionar Lista
                            </button>
                            <button 
                                className="btn btn-info"
                                onClick={() => adicionarSecao("area_atuacao")}
                                disabled={!idCursoSelecionado || carregando}
                            >
                                Adicionar Área
                            </button>
                            <button 
                                className="btn btn-success"
                                onClick={() => adicionarSecao("passo_a_passo")}
                                disabled={!idCursoSelecionado || carregando}
                            >
                                Adicionar Passo a Passo
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
                                {idCursoSelecionado 
                                    ? "Nenhuma seção encontrada. Adicione uma seção."
                                    : "Selecione um curso para visualizar ou adicionar seções."}
                            </div>
                        ) : (
                            <div className="list-group">
                                {secoes.map((secao, index) => (
                                    <div 
                                        key={`${secao.id_secao_curso || 'new'}-${index}`}
                                        className={`list-group-item ${secao.editando ? 'border-primary' : ''}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0 text-capitalize">
                                                {secao.tipo} - Ordem: {secao.ordem}
                                                {secao.id_secao_curso && <small className="text-muted ms-2">(ID: {secao.id_secao_curso})</small>}
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
                        disabled={!idCursoSelecionado || carregando || !secoes.some(s => s.editando)}
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

export default GerenciarConteudoCurso;