import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Container, Form, Card, ListGroup, Modal, Alert, Spinner } from "react-bootstrap";

const EditarConteudoTutorial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutorial, setTutorial] = useState(null);
    const [secoes, setSecoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [newSection, setNewSection] = useState({
        tipo: 'titulo',
        ordem: 1,
        titulo: ''
    });
    const [showAddContentModal, setShowAddContentModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [newContent, setNewContent] = useState({});

    // 🚀 Carregar conteúdo existente
    useEffect(() => {
    const fetchData = async () => {
        try {
            setCarregando(true);
            setErro(null);
            
            // Buscar tutorial
            const tutorialRes = await fetch(`http://localhost:3000/tutoriais/${id}`);
            if (!tutorialRes.ok) throw new Error("Tutorial não encontrado");
            const tutorialData = await tutorialRes.json();
            setTutorial(tutorialData);
            
            // Buscar seções e normalizar dados
            const contentRes = await fetch(`http://localhost:3000/tutoriais/${id}/secoes`);
            if (!contentRes.ok) throw new Error("Erro ao buscar seções");
            
            const contentData = await contentRes.json();
            
            // Normaliza os dados para o formato esperado pelo frontend
            const secoesNormalizadas = contentData.map(secao => ({
                ...secao,
                conteudos: (secao.conteudos || []).map(conteudo => {
                    // Para listas, onde o service retorna 'item' mas o front espera 'texto'
                    if (secao.tipo === 'lista') {
                        return { ...conteudo, texto: conteudo.item };
                    }
                    return conteudo;
                })
            }));
            
            setSecoes(secoesNormalizadas);
            
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };
    
    fetchData();
}, [id]);

    // 🚀 Adicionar nova seção
    const handleAddSection = async () => {
        try {
            setCarregando(true);
            const response = await fetch(`http://localhost:3000/tutoriais/${id}/secoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSection)
            });
            
            if (!response.ok) throw new Error("Erro ao adicionar seção");
            
            const data = await response.json();
            setSecoes([...secoes, data]);
            setShowAddSectionModal(false);
            setNewSection({ tipo: 'titulo', ordem: 1, titulo: '' });
        } catch (err) {
            console.error("Erro ao adicionar seção:", err);
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Remover seção
    const handleRemoveSection = async (id_secao) => {
        try {
            setCarregando(true);
            const response = await fetch(`http://localhost:3000/tutoriais/${id}/secoes/${id_secao}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error("Erro ao remover seção");
            
            setSecoes(secoes.filter(sec => sec.id_secao !== id_secao));
        } catch (err) {
            console.error("Erro ao remover seção:", err);
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Adicionar conteúdo a uma seção
    // No modal de adicionar conteúdo
const handleAddContent = async (id_secao, tipo) => {
    try {
        setCarregando(true);
        
        // Prepara os dados no formato esperado pelo service
        const conteudoParaEnviar = tipo === 'lista' 
            ? { item: newContent.texto } 
            : newContent;
        
        const response = await fetch(`http://localhost:3000/tutoriais/${id}/secoes/${id_secao}/conteudo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo, ...conteudoParaEnviar })
        });
        
        if (!response.ok) throw new Error("Erro ao adicionar conteúdo");
        
        const data = await response.json();
        
        // Normaliza a resposta para o formato do frontend
        const conteudoNormalizado = tipo === 'lista' 
            ? { ...data, texto: data.item }
            : data;
        
        setSecoes(secoes.map(sec => {
            if (sec.id_secao === id_secao) {
                return {
                    ...sec,
                    conteudos: [...(sec.conteudos || []), conteudoNormalizado]
                };
            }
            return sec;
        }));
        
        setShowAddContentModal(false);
        setNewContent({});
    } catch (err) {
        console.error("Erro ao adicionar conteúdo:", err);
        setErro(err.message);
    } finally {
        setCarregando(false);
    }
};

    // 🚀 Remover conteúdo de uma seção
    const handleRemoveContent = async (id_secao, tipo, id_conteudo) => {
        try {
            setCarregando(true);
            const response = await fetch(
                `http://localhost:3000/tutoriais/${id}/secoes/${id_secao}/conteudo/${tipo}/${id_conteudo}`, 
                { method: 'DELETE' }
            );
            
            if (!response.ok) throw new Error("Erro ao remover conteúdo");
            
            setSecoes(secoes.map(sec => {
                if (sec.id_secao === id_secao) {
                    return {
                        ...sec,
                        conteudos: sec.conteudos.filter(c => c.id !== id_conteudo)
                    };
                }
                return sec;
            }));
        } catch (err) {
            console.error("Erro ao remover conteúdo:", err);
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Renderizar conteúdo de acordo com o tipo
    const renderContent = (conteudo, tipo) => {
    if (!conteudo) return null;
    
    switch (tipo) {
        case 'titulo':
        case 'paragrafo':
            return <p>{conteudo.texto || conteudo.item || 'Sem conteúdo'}</p>;
        case 'imagem':
            return (
                <div>
                    <img src={conteudo.url || ''} alt={conteudo.descricao || ''} className="img-fluid" />
                    <p>{conteudo.descricao || 'Sem descrição'}</p>
                </div>
            );
        case 'lista':
            return <li>{conteudo.item || conteudo.texto || 'Item sem texto'}</li>;
        case 'passo':
            return (
                <div>
                    <h5>Passo {conteudo.numero || '0'}</h5>
                    <p>{conteudo.instrucao || 'Sem instruções'}</p>
                    {conteudo.imagem && <img src={conteudo.imagem} className="img-fluid" alt="Passo" />}
                </div>
            );
        default:
            return null;
    }
};

    // 🚀 Renderização condicional
    if (carregando && !tutorial) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
                <p className="mt-3">Carregando conteúdo do tutorial...</p>
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
                <Button 
                    variant="primary"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Editando Tutorial: {tutorial?.titulo}</h2>
                <Button 
                    variant="outline-secondary"
                    onClick={() => navigate(`/tutoriais/${id}`)}
                >
                    Ver Página Pública
                </Button>
            </div>
            
            {erro && <Alert variant="danger">{erro}</Alert>}
            
            <Button 
                variant="primary" 
                onClick={() => setShowAddSectionModal(true)}
                className="mb-3"
                disabled={carregando}
            >
                {carregando ? 'Carregando...' : 'Adicionar Seção'}
            </Button>
            
            {secoes.length === 0 && <p>Nenhuma seção cadastrada ainda.</p>}
            
            {secoes.map((secao) => (
                <Card key={secao.id_secao} className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{secao.tipo.toUpperCase()}</strong> - Ordem: {secao.ordem}
                        </div>
                        <div>
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => {
                                    setCurrentSection(secao);
                                    setNewContent({});
                                    setShowAddContentModal(true);
                                }}
                                disabled={carregando}
                            >
                                Adicionar Conteúdo
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveSection(secao.id_secao)}
                                disabled={carregando}
                            >
                                Remover
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {secao.conteudos?.length === 0 && (
                            <p className="text-muted">Nenhum conteúdo nesta seção.</p>
                        )}
                        
                        {secao.tipo === 'lista' ? (
                            <ListGroup>
                                {secao.conteudos?.map((conteudo) => (
                                    <ListGroup.Item key={conteudo.id} className="d-flex justify-content-between">
                                        {renderContent(conteudo, secao.tipo)}
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleRemoveContent(secao.id_secao, secao.tipo, conteudo.id)}
                                            disabled={carregando}
                                        >
                                            Remover
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            secao.conteudos?.map((conteudo) => (
                                <div key={conteudo.id} className="mb-3 p-2 border rounded d-flex justify-content-between">
                                    {renderContent(conteudo, secao.tipo)}
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleRemoveContent(secao.id_secao, secao.tipo, conteudo.id)}
                                        disabled={carregando}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))
                        )}
                    </Card.Body>
                </Card>
            ))}
            
            {/* Modal para adicionar nova seção */}
            <Modal show={showAddSectionModal} onHide={() => setShowAddSectionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Nova Seção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Seção</Form.Label>
                            <Form.Select 
                                value={newSection.tipo}
                                onChange={(e) => setNewSection({...newSection, tipo: e.target.value})}
                            >
                                <option value="titulo">Título</option>
                                <option value="paragrafo">Parágrafo</option>
                                <option value="imagem">Imagem</option>
                                <option value="lista">Lista</option>
                                <option value="passo">Passo a Passo</option>
                            </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Ordem</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={newSection.ordem}
                                onChange={(e) => setNewSection({...newSection, ordem: parseInt(e.target.value)})}
                            />
                        </Form.Group>
                        
                        {newSection.tipo === 'titulo' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Título</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={newSection.titulo}
                                    onChange={(e) => setNewSection({...newSection, titulo: e.target.value})}
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddSectionModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddSection} disabled={carregando}>
                        {carregando ? 'Salvando...' : 'Adicionar Seção'}
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Modal para adicionar novo conteúdo */}
            <Modal show={showAddContentModal} onHide={() => setShowAddContentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Conteúdo à Seção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentSection && (
                        <Form>
                            {currentSection.tipo === 'titulo' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Texto do Título</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={newContent.texto || ''}
                                        onChange={(e) => setNewContent({...newContent, texto: e.target.value})}
                                    />
                                </Form.Group>
                            )}
                            
                            {currentSection.tipo === 'paragrafo' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Texto do Parágrafo</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        value={newContent.texto || ''}
                                        onChange={(e) => setNewContent({...newContent, texto: e.target.value})}
                                    />
                                </Form.Group>
                            )}
                            
                            {currentSection.tipo === 'imagem' && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>URL da Imagem</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={newContent.url || ''}
                                            onChange={(e) => setNewContent({...newContent, url: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={newContent.descricao || ''}
                                            onChange={(e) => setNewContent({...newContent, descricao: e.target.value})}
                                        />
                                    </Form.Group>
                                </>
                            )}
                            
                            {currentSection.tipo === 'lista' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Item da Lista</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={newContent.item || ''}
                                        onChange={(e) => setNewContent({...newContent, item: e.target.value})}
                                    />
                                </Form.Group>
                            )}
                            
                            {currentSection.tipo === 'passo' && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número do Passo</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            value={newContent.numero || ''}
                                            onChange={(e) => setNewContent({...newContent, numero: parseInt(e.target.value)})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Instrução</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3}
                                            value={newContent.instrucao || ''}
                                            onChange={(e) => setNewContent({...newContent, instrucao: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>URL da Imagem (opcional)</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={newContent.imagem || ''}
                                            onChange={(e) => setNewContent({...newContent, imagem: e.target.value})}
                                        />
                                    </Form.Group>
                                </>
                            )}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddContentModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => handleAddContent(currentSection.id_secao, currentSection.tipo)}
                        disabled={carregando}
                    >
                        {carregando ? 'Salvando...' : 'Adicionar Conteúdo'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EditarConteudoTutorial;