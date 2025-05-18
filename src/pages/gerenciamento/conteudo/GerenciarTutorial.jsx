import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Container, 
  Button, 
  Form, 
  Card, 
  Alert, 
  Spinner, 
  ListGroup,
  Badge,
  InputGroup
} from "react-bootstrap";
import { 
  ArrowLeft, 
  Save, 
  PlusCircle, 
  Trash,
  Plus,
  Dash
} from "react-bootstrap-icons";

const GerenciarTutorial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const editMode = !!id;
    
    // Estados
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        id_software: ""
    });
    const [secoes, setSecoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [softwares, setSoftwares] = useState([]);

    // Busca dados iniciais
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca softwares
                const softwaresRes = await fetch("http://localhost:3000/softwares");
                if (!softwaresRes.ok) throw new Error("Erro ao carregar softwares");
                setSoftwares(await softwaresRes.json());

                // Se for edição, busca dados do tutorial
                if (editMode) {
                    const [tutorialRes, conteudoRes] = await Promise.all([
                        fetch(`http://localhost:3000/tutoriais/${id}`),
                        fetch(`http://localhost:3000/tutoriais/${id}/conteudo`)
                    ]);

                    if (!tutorialRes.ok) throw new Error("Erro ao carregar tutorial");
                    const tutorialData = await tutorialRes.json();
                    
                    setFormData({
                        titulo: tutorialData.titulo,
                        descricao: tutorialData.descricao,
                        id_software: tutorialData.id_software?.toString() || ""
                    });

                    // Processa conteúdo se existir
                    if (conteudoRes.ok) {
                        const conteudoData = await conteudoRes.json();
                        setSecoes(conteudoData.map(secao => ({
                            ...secao,
                            conteudo: secao.tipo === 'lista' 
                                ? secao.conteudos 
                                : secao.conteudos[0] || {}
                        })));
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, editMode]);

    // Manipuladores de formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Adicionar seção
    const adicionarSecao = (tipo) => {
        const novaSecao = {
            tipo,
            ordem: secoes.length + 1,
            conteudo: tipo === 'lista' ? [] : 
                     tipo === 'imagem' ? { url: "", descricao: "" } : 
                     tipo === 'passo' ? { numero: 1, instrucao: "", imagem: "" } : 
                     { texto: "" }
        };
        
        // Para listas, adiciona um item vazio inicial
        if (tipo === 'lista') {
            novaSecao.conteudo.push({ item: "" });
        }
        
        setSecoes([...secoes, novaSecao]);
    };

    // Atualizar conteúdo
    const atualizarConteudo = (secaoIndex, campo, valor, itemIndex = 0) => {
        const novasSecoes = [...secoes];
        
        if (secoes[secaoIndex].tipo === 'lista') {
            novasSecoes[secaoIndex].conteudo[itemIndex][campo] = valor;
        } else {
            novasSecoes[secaoIndex].conteudo[campo] = valor;
        }
        
        setSecoes(novasSecoes);
    };

    // Manipuladores de lista
    const adicionarItemLista = (secaoIndex) => {
        const novasSecoes = [...secoes];
        novasSecoes[secaoIndex].conteudo.push({ item: "" });
        setSecoes(novasSecoes);
    };

    const removerItemLista = (secaoIndex, itemIndex) => {
        const novasSecoes = [...secoes];
        novasSecoes[secaoIndex].conteudo.splice(itemIndex, 1);
        setSecoes(novasSecoes);
    };

    // Remover seção
    const removerSecao = (index) => {
        setSecoes(secoes.filter((_, i) => i !== index));
    };

    // Salvar tutorial
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.titulo || !formData.id_software) {
            setError("Título e software são obrigatórios");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 1. Salvar tutorial básico
            const tutorialRes = await fetch(
                editMode ? `http://localhost:3000/tutoriais/${id}` : 'http://localhost:3000/tutoriais',
                {
                    method: editMode ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );

            if (!tutorialRes.ok) {
                const errorData = await tutorialRes.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro ao salvar tutorial");
            }

            const tutorialData = await tutorialRes.json();
            const tutorialId = tutorialData.id_tutorial || id;

            // 2. Limpar seções existentes (em edição)
            if (editMode) {
                await fetch(`http://localhost:3000/tutoriais/${tutorialId}/conteudo`, {
                    method: 'DELETE'
                });
            }

            // 3. Salvar novas seções
            for (const secao of secoes) {
                // Salva a seção
                const secaoRes = await fetch(
                    `http://localhost:3000/tutoriais/${tutorialId}/secoes`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tipo: secao.tipo,
                            ordem: secao.ordem
                        })
                    }
                );

                const secaoData = await secaoRes.json();

                // Tratamento especial para listas
                if (secao.tipo === 'lista') {
                    await fetch(
                        `http://localhost:3000/tutoriais/${tutorialId}/secoes/${secaoData.id_secao}/lista`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                itens: secao.conteudo
                            })
                        }
                    );
                } else {
                    // Outros tipos de conteúdo
                    await fetch(
                        `http://localhost:3000/tutoriais/${tutorialId}/secoes/${secaoData.id_secao}/conteudo`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                tipo: secao.tipo,
                                ...secao.conteudo
                            })
                        }
                    );
                }
            }

            navigate(`/tutorial/${tutorialId}`);
        } catch (err) {
            console.error("Erro ao salvar tutorial:", err);
            setError(err.message || "Erro ao salvar tutorial");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !secoes.length && !formData.titulo) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Carregando...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)} 
                className="mb-3"
            >
                <ArrowLeft className="me-2" /> Voltar
            </Button>

            <h2 className="mb-4">{editMode ? "Editar Tutorial" : "Novo Tutorial"}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Software Relacionado*</Form.Label>
                            <Form.Select
                                name="id_software"
                                value={formData.id_software}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="">Selecione um software</option>
                                {softwares.map(sw => (
                                    <option key={sw.id_softwares} value={sw.id_softwares}>
                                        {sw.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Título do Tutorial*</Form.Label>
                            <Form.Control
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="mb-4 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Conteúdo do Tutorial</h5>
                        <div>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => adicionarSecao('titulo')} 
                                className="me-2"
                                disabled={loading}
                            >
                                <PlusCircle size={14} className="me-1" /> Título
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => adicionarSecao('paragrafo')} 
                                className="me-2"
                                disabled={loading}
                            >
                                <PlusCircle size={14} className="me-1" /> Parágrafo
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => adicionarSecao('lista')}
                                className="me-2"
                                disabled={loading}
                            >
                                <PlusCircle size={14} className="me-1" /> Lista
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => adicionarSecao('passo')}
                                disabled={loading}
                            >
                                <PlusCircle size={14} className="me-1" /> Passo
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {secoes.length === 0 ? (
                            <Alert variant="info" className="text-center">
                                Nenhuma seção adicionada ainda
                            </Alert>
                        ) : (
                            secoes.map((secao, secaoIndex) => (
                                <Card key={`secao-${secaoIndex}`} className="mb-3 border-0 shadow-sm">
                                    <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                                        <div>
                                            <Badge bg="secondary" className="me-2">
                                                {secao.ordem}
                                            </Badge>
                                            <span className="text-capitalize">{secao.tipo}</span>
                                        </div>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            onClick={() => removerSecao(secaoIndex)}
                                            disabled={loading}
                                        >
                                            <Trash size={14} />
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {secao.tipo === 'titulo' && (
                                            <Form.Control
                                                type="text"
                                                value={secao.conteudo.texto || ''}
                                                onChange={(e) => atualizarConteudo(secaoIndex, 'texto', e.target.value)}
                                                placeholder="Digite o título"
                                                disabled={loading}
                                            />
                                        )}

                                        {secao.tipo === 'paragrafo' && (
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={secao.conteudo.texto || ''}
                                                onChange={(e) => atualizarConteudo(secaoIndex, 'texto', e.target.value)}
                                                placeholder="Digite o parágrafo"
                                                disabled={loading}
                                            />
                                        )}

                                        {secao.tipo === 'lista' && (
                                            <div>
                                                <ListGroup variant="flush">
                                                    {secao.conteudo.map((item, itemIndex) => (
                                                        <ListGroup.Item key={`item-${itemIndex}`}>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={item.item || ''}
                                                                    onChange={(e) => atualizarConteudo(
                                                                        secaoIndex, 
                                                                        'item', 
                                                                        e.target.value,
                                                                        itemIndex
                                                                    )}
                                                                    placeholder="Digite um item da lista"
                                                                    disabled={loading}
                                                                />
                                                                <Button 
                                                                    variant="outline-danger"
                                                                    onClick={() => removerItemLista(secaoIndex, itemIndex)}
                                                                    disabled={loading}
                                                                >
                                                                    <Dash />
                                                                </Button>
                                                            </InputGroup>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="mt-2"
                                                    onClick={() => adicionarItemLista(secaoIndex)}
                                                    disabled={loading}
                                                >
                                                    <Plus size={14} className="me-1" /> Adicionar Item
                                                </Button>
                                            </div>
                                        )}

                                        {secao.tipo === 'passo' && (
                                            <div>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Número do Passo</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={secao.conteudo.numero || 1}
                                                        onChange={(e) => atualizarConteudo(secaoIndex, 'numero', e.target.value)}
                                                        disabled={loading}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Instrução</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={secao.conteudo.instrucao || ''}
                                                        onChange={(e) => atualizarConteudo(secaoIndex, 'instrucao', e.target.value)}
                                                        placeholder="Descreva este passo"
                                                        disabled={loading}
                                                    />
                                                </Form.Group>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-end">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading || !formData.titulo || !formData.id_software}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="me-2" />
                                {editMode ? "Atualizar Tutorial" : "Salvar Tutorial"}
                            </>
                        )}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default GerenciarTutorial;