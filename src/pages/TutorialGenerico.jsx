import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from './components/ui/Header';
import { 
  Container, 
  Spinner, 
  Alert, 
  Card, 
  ListGroup, 
  Image,
  Badge,
  Button
} from "react-bootstrap";
import { 
  ArrowLeft, 
  Link45deg,
  Download 
} from "react-bootstrap-icons";

const TutorialGenerico = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutorial, setTutorial] = useState(null);
    const [secoes, setSecoes] = useState([]);
    const [software, setSoftware] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutorialData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 1. Busca dados básicos do tutorial
                const tutorialRes = await fetch(`http://localhost:3000/tutoriais/${id}`);
                if (!tutorialRes.ok) throw new Error("Tutorial não encontrado");
                const tutorialData = await tutorialRes.json();
                setTutorial(tutorialData);

                // 2. Busca conteúdo completo
                const conteudoRes = await fetch(`http://localhost:3000/tutoriais/${id}/conteudo`);
                if (!conteudoRes.ok) throw new Error("Conteúdo não encontrado");
                let conteudoData = await conteudoRes.json();
                
                // Ordena seções e seus conteúdos
                conteudoData = conteudoData
                    .sort((a, b) => a.ordem - b.ordem)
                    .map(secao => ({
                        ...secao,
                        conteudos: secao.tipo === 'passo' 
                            ? secao.conteudos.sort((a, b) => a.numero - b.numero)
                            : secao.conteudos
                    }));
                
                setSecoes(conteudoData);

                // 3. Busca software associado se existir
                if (tutorialData.id_software) {
                    const softwareRes = await fetch(`http://localhost:3000/softwares/${tutorialData.id_software}`);
                    if (softwareRes.ok) {
                        setSoftware(await softwareRes.json());
                    }
                }

            } catch (err) {
                console.error("Erro ao carregar tutorial:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTutorialData();
    }, [id]);

    const renderConteudo = (secao) => {
        if (!secao.conteudos || secao.conteudos.length === 0) {
            return <Alert variant="warning">Seção vazia</Alert>;
        }

        switch(secao.tipo) {
            case 'titulo':
                return <h3 className="mb-4 border-bottom pb-2">{secao.conteudos[0].texto}</h3>;

            case 'paragrafo':
                return secao.conteudos.map((c, i) => (
                    <p key={`p-${i}`} className="mb-3">{c.texto}</p>
                ));

            case 'lista':
                return (
                    <ListGroup variant="flush" className="mb-3">
                        {secao.conteudos.map((item, i) => (
                            <ListGroup.Item key={`item-${i}`}>{item.item || item.texto}</ListGroup.Item>
                        ))}
                    </ListGroup>
                );

            case 'imagem':
                return (
                    <div className="text-center my-4">
                        <Image 
                            src={secao.conteudos[0].url} 
                            alt={secao.conteudos[0].descricao || "Imagem do tutorial"} 
                            fluid 
                            rounded 
                            className="shadow"
                            style={{ maxHeight: '400px' }}
                        />
                        {secao.conteudos[0].descricao && (
                            <p className="text-muted mt-2">{secao.conteudos[0].descricao}</p>
                        )}
                    </div>
                );

            case 'passo':
                return (
                    <div className="mt-4">
                        <h5 className="mb-3">
                            <Badge bg="primary" className="me-2">Passo a Passo</Badge>
                        </h5>
                        <ListGroup as="ol" numbered className="mb-4">
                            {secao.conteudos.map((passo, i) => (
                                <ListGroup.Item 
                                    as="li" 
                                    key={`passo-${i}`}
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Passo {passo.numero}</div>
                                        {passo.instrucao}
                                    </div>
                                    {passo.imagem && (
                                        <Image 
                                            src={passo.imagem} 
                                            alt={`Passo ${passo.numero}`}
                                            thumbnail
                                            style={{ maxWidth: '150px' }}
                                        />
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                );

            case 'codigo':
                return (
                    <Card className="mb-3 bg-dark text-white">
                        <Card.Header>
                            {secao.conteudos[0].linguagem || 'Código'}
                        </Card.Header>
                        <Card.Body>
                            <pre className="mb-0">
                                <code>{secao.conteudos[0].conteudo}</code>
                            </pre>
                        </Card.Body>
                    </Card>
                );

            default:
                return <Alert variant="warning">Tipo de conteúdo desconhecido</Alert>;
        }
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Carregando tutorial...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Erro ao carregar tutorial</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => navigate(-1)}>
                        <ArrowLeft className="me-2" />
                        Voltar
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!tutorial) {
        return (
            <Container className="py-5">
                <Alert variant="warning">
                    <Alert.Heading>Tutorial não encontrado</Alert.Heading>
                    <p>O tutorial solicitado não existe ou foi removido.</p>
                    <Button variant="outline-warning" onClick={() => navigate(-1)}>
                        <ArrowLeft className="me-2" />
                        Voltar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="px-0">
            <Header />
            {/* Cabeçalho */}
            <div className="bg-primary text-white py-4 shadow">
                <Container>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Button 
                                variant="outline-light" 
                                onClick={() => navigate(-1)}
                                className="me-3"
                            >
                                <ArrowLeft />
                            </Button>
                            <h1 className="d-inline-block mb-0">{tutorial.titulo}</h1>
                        </div>
                        {software && (
                            <Badge bg="light" text="dark" className="fs-6">
                                {software.nome}
                            </Badge>
                        )}
                    </div>
                </Container>
            </div>

            {/* Conteúdo Principal */}
            <Container className="py-4">
                {tutorial.descricao && (
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <p className="lead mb-0">{tutorial.descricao}</p>
                        </Card.Body>
                    </Card>
                )}

                {/* Seções de Conteúdo */}
                {secoes.length > 0 ? (
                    secoes.map((secao) => (
                        <Card key={secao.id_secao} className="mb-4 border-0 shadow-sm">
                            <Card.Body>
                                {renderConteudo(secao)}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <Alert variant="info" className="text-center">
                        Este tutorial ainda não possui conteúdo
                    </Alert>
                )}

                {/* Rodapé */}
                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft className="me-2" />
                        Voltar
                    </Button>
                    
                    <div>
                        {software && (
                            <Button 
                                variant="primary" 
                                className="me-2"
                                onClick={() => navigate(`/softwares/${software.id_softwares}`)}
                            >
                                <Download className="me-2" />
                                Ver Software
                            </Button>
                        )}
                        {tutorial.url && (
                            <Button 
                                variant="outline-primary" 
                                href={tutorial.url} 
                                target="_blank"
                            >
                                <Link45deg className="me-2" />
                                Site Oficial
                            </Button>
                        )}
                    </div>
                </div>
            </Container>
        </Container>
    );
};

export default TutorialGenerico;