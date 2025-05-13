import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Card, Alert, Spinner, Form } from "react-bootstrap";

const EditarConteudoSoftware = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [secoes, setSecoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [software, setSoftware] = useState(null);
    const [conteudoEditando, setConteudoEditando] = useState(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setCarregando(true);
                setErro(null);
                
                // 1. Buscar dados do software
                const resSoftware = await fetch(`http://localhost:3000/softwares/${id}`);
                if (!resSoftware.ok) throw new Error("Software não encontrado");
                const dadosSoftware = await resSoftware.json();
                setSoftware(dadosSoftware);
                
                // 2. Buscar seções e conteúdos
                const resConteudo = await fetch(`http://localhost:3000/softwares/${id}/content`);
                if (!resConteudo.ok) throw new Error("Erro ao buscar conteúdo");
                
                const dadosConteudo = await resConteudo.json();
                
                console.log("Dados recebidos do backend:", dadosConteudo); // Log para depuração
                
                // Verifica se há dados e formata corretamente
                if (dadosConteudo && dadosConteudo.length > 0) {
                    const secoesFormatadas = dadosConteudo.map(secao => ({
                        ...secao,
                        conteudos: secao.conteudos ? secao.conteudos.map(conteudo => {
                            // Converte 'item' para 'texto' para listas
                            if (secao.tipo === 'lista') {
                                return { ...conteudo, texto: conteudo.item };
                            }
                            return conteudo;
                        }) : []
                    }));
                    setSecoes(secoesFormatadas);
                } else {
                    setSecoes([]);
                }
                
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [id]);

    const handleEditarConteudo = (secao, conteudo) => {
        setConteudoEditando({ secao, conteudo });
    };

    const handleSalvarConteudo = async () => {
        try {
            setCarregando(true);
            
            const { secao, conteudo } = conteudoEditando;
            const dadosAtualizados = { ...conteudo };
            
            // Converte de volta para o formato do backend se for lista
            if (secao.tipo === 'lista') {
                dadosAtualizados.item = dadosAtualizados.texto;
                delete dadosAtualizados.texto;
            }
            
            const response = await fetch(`http://localhost:3000/softwares/conteudo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_secao: secao.id_secao,
                    tipo: secao.tipo,
                    ...dadosAtualizados
                })
            });

            if (!response.ok) throw new Error("Erro ao salvar conteúdo");

            // Atualiza o estado local
            setSecoes(secoes.map(s => {
                if (s.id_secao === secao.id_secao) {
                    return {
                        ...s,
                        conteudos: s.conteudos.map(c => {
                            if (c.id === conteudo.id) {
                                return secao.tipo === 'lista' 
                                    ? { ...conteudo, item: conteudo.texto }
                                    : conteudo;
                            }
                            return c;
                        })
                    };
                }
                return s;
            }));

            setConteudoEditando(null);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setErro("Erro ao salvar alterações: " + error.message);
        } finally {
            setCarregando(false);
        }
    };

    const renderizarConteudo = (secao, conteudo) => {
        switch (secao.tipo) {
            case "titulo":
            case "paragrafo":
                return <p>{conteudo.texto}</p>;
            case "lista":
                return <li>{conteudo.item || conteudo.texto}</li>;
            case "area_atuacao":
                return (
                    <div>
                        <h5>{conteudo.titulo}</h5>
                        <p>{conteudo.descricao}</p>
                    </div>
                );
            default:
                return <p>Conteúdo não reconhecido</p>;
        }
    };

    if (carregando && !software) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-3">Carregando conteúdo do software...</p>
            </Container>
        );
    }

    if (erro) {
        return (
            <Container className="text-center py-5">
                <Alert variant="danger">
                    <h4>Erro ao carregar conteúdo</h4>
                    <p>{erro}</p>
                </Alert>
                <Button onClick={() => navigate(-1)}>Voltar</Button>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Editando: {software?.nome}</h2>
                <Button variant="outline-secondary" onClick={() => navigate(`/softwares/${id}`)}>
                    Ver Página Pública
                </Button>
            </div>
            
            {erro && <Alert variant="danger">{erro}</Alert>}

            {secoes.length === 0 ? (
                <Alert variant="info">Nenhuma seção encontrada para este software.</Alert>
            ) : (
                secoes.map((secao, indexSecao) => (
                    <Card key={secao.id_secao} className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-capitalize">
                                {secao.tipo} - Ordem: {secao.ordem}
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {secao.conteudos && secao.conteudos.length > 0 ? (
                                secao.conteudos.map((conteudo, indexConteudo) => (
                                    <div key={conteudo.id || indexConteudo} className="mb-3">
                                        {conteudoEditando?.conteudo?.id === conteudo.id ? (
                                            <Form>
                                                {secao.tipo === "titulo" || secao.tipo === "paragrafo" ? (
                                                    <Form.Group>
                                                        <Form.Control
                                                            as={secao.tipo === "paragrafo" ? "textarea" : "input"}
                                                            rows={3}
                                                            value={conteudo.texto || ""}
                                                            onChange={(e) => setConteudoEditando({
                                                                ...conteudoEditando,
                                                                conteudo: {
                                                                    ...conteudoEditando.conteudo,
                                                                    texto: e.target.value
                                                                }
                                                            })}
                                                        />
                                                    </Form.Group>
                                                ) : secao.tipo === "lista" ? (
                                                    <Form.Group>
                                                        <Form.Control
                                                            type="text"
                                                            value={conteudo.texto || ""}
                                                            onChange={(e) => setConteudoEditando({
                                                                ...conteudoEditando,
                                                                conteudo: {
                                                                    ...conteudoEditando.conteudo,
                                                                    texto: e.target.value
                                                                }
                                                            })}
                                                        />
                                                    </Form.Group>
                                                ) : secao.tipo === "area_atuacao" ? (
                                                    <>
                                                        <Form.Group className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                value={conteudo.titulo || ""}
                                                                onChange={(e) => setConteudoEditando({
                                                                    ...conteudoEditando,
                                                                    conteudo: {
                                                                        ...conteudoEditando.conteudo,
                                                                        titulo: e.target.value
                                                                    }
                                                                })}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
                                                                value={conteudo.descricao || ""}
                                                                onChange={(e) => setConteudoEditando({
                                                                    ...conteudoEditando,
                                                                    conteudo: {
                                                                        ...conteudoEditando.conteudo,
                                                                        descricao: e.target.value
                                                                    }
                                                                })}
                                                            />
                                                        </Form.Group>
                                                    </>
                                                ) : null}
                                                
                                                <div className="d-flex justify-content-end mt-3">
                                                    <Button 
                                                        variant="secondary" 
                                                        className="me-2"
                                                        onClick={() => setConteudoEditando(null)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button 
                                                        variant="primary"
                                                        onClick={handleSalvarConteudo}
                                                        disabled={carregando}
                                                    >
                                                        Salvar
                                                    </Button>
                                                </div>
                                            </Form>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center">
                                                {renderizarConteudo(secao, conteudo)}
                                                <Button 
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleEditarConteudo(secao, conteudo)}
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <Alert variant="warning">Nenhum conteúdo nesta seção.</Alert>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default EditarConteudoSoftware;