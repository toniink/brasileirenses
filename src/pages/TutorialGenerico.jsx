import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import { 
  Container, 
  Spinner, 
  Alert, 
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
                
                const tutorialRes = await fetch(`http://localhost:3000/tutoriais/${id}`);
                if (!tutorialRes.ok) throw new Error("Tutorial não encontrado");
                const tutorialData = await tutorialRes.json();
                setTutorial(tutorialData);

                const conteudoRes = await fetch(`http://localhost:3000/tutoriais/${id}/conteudo`);
                if (!conteudoRes.ok) throw new Error("Conteúdo não encontrado");
                let conteudoData = await conteudoRes.json();
                
                conteudoData = conteudoData
                    .sort((a, b) => a.ordem - b.ordem)
                    .map(secao => ({
                        ...secao,
                        conteudos: secao.tipo === 'passo' 
                            ? secao.conteudos.sort((a, b) => a.numero - b.numero)
                            : secao.conteudos
                    }));
                
                setSecoes(conteudoData);

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

    const renderConteudo = (secao, index) => {
        if (!secao.conteudos || secao.conteudos.length === 0) {
            return <Alert variant="warning">Seção vazia</Alert>;
        }

        const conteudo = (() => {
            switch(secao.tipo) {
                case 'titulo':
                    return <h4 className="mt-4 pt-3">{secao.conteudos[0].texto}</h4>;

                case 'paragrafo':
                    return secao.conteudos.map((c, i) => (
                        <p key={`p-${i}`} className="mb-3">{c.texto}</p>
                    ));

                case 'lista':
                    return (
                        <ul className="mb-3 ps-3">
                            {secao.conteudos.map((item, i) => (
                                <li key={`item-${i}`} className="mb-2">{item.item || item.texto}</li>
                            ))}
                        </ul>
                    );

                case 'imagem':
                    return (
                        <div className="text-center my-3">
                            <Image 
                                src={secao.conteudos[0].url} 
                                alt={secao.conteudos[0].descricao || "Imagem do tutorial"} 
                                fluid 
                                className="rounded"
                                style={{ maxHeight: '400px' }}
                            />
                            {secao.conteudos[0].descricao && (
                                <p className="text-muted mt-2">{secao.conteudos[0].descricao}</p>
                            )}
                        </div>
                    );

                case 'passo':
                    return (
                        <div className="mt-3">
                            <h5 className="mb-3">Passo a Passo</h5>
                            <ol className="mb-3 ps-3">
                                {secao.conteudos.map((passo, i) => (
                                    <li key={`passo-${i}`} className="mb-3">
                                        <div className="fw-semibold">Passo {passo.numero}</div>
                                        <p>{passo.instrucao}</p>
                                        {passo.imagem && (
                                            <Image 
                                                src={passo.imagem} 
                                                alt={`Passo ${passo.numero}`}
                                                fluid
                                                className="mt-2 rounded"
                                            />
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    );

                case 'codigo':
                    return (
                        <div className="mb-3 p-3 bg-dark text-white rounded">
                            <div className="mb-2 small">
                                {secao.conteudos[0].linguagem || 'Código'}
                            </div>
                            <pre className="mb-0">
                                <code>{secao.conteudos[0].conteudo}</code>
                            </pre>
                        </div>
                    );

                default:
                    return <Alert variant="warning">Tipo de conteúdo desconhecido</Alert>;
            }
        })();

        return (
            <div key={secao.id_secao}>
                {conteudo}
                {secao.tipo === 'titulo' && index < secoes.length - 1 && (
                    <hr className="my-3" />
                )}
            </div>
        );
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
                    <Button variant="outline-secondary shadow" onClick={() => navigate(-1)}>
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
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft className="me-2" />
                        Voltar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <div className="container-fluid">
            <Header />
            
            <div className="container mx-auto px-4 mt-4">
                <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(-1)}
                    className="mb-4 shadow"
                >
                    <ArrowLeft className="me-2" />
                    Voltar
                </Button>

                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="mb-4">
                            <h1>{tutorial.titulo}</h1>
                            {tutorial.descricao && (
                                <p className="lead text-muted">{tutorial.descricao}</p>
                            )}
                            {software && (
                                <Badge bg="secondary" className="mt-2">
                                    {software.nome}
                                </Badge>
                            )}
                            <hr className="border border-primary border-2 opacity-100"/>
                        </div>

                        {secoes.length > 0 ? (
                            secoes.map((secao, index) => renderConteudo(secao, index))
                        ) : (
                            <Alert variant="info" className="text-center">
                                Este tutorial ainda não possui conteúdo
                            </Alert>
                        )}

                        <div className="d-flex justify-content-between mt-5 pt-3 border-top my-4">
                            <Button variant="outline-secondary shadow" onClick={() => navigate(-1)}>
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
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TutorialGenerico;