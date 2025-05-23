import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import '../styles.css';


const SoftwareDetalhes = () => {
    const { id } = useParams();
    const [software, setSoftware] = useState(null);
    const [sections, setSections] = useState([]);
    const [tutorial, setTutorial] = useState(null);
    const [site, setSite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Busca dados do software, tutorial, site e seções de conteúdo em paralelo
                const [softwareRes, tutorialRes, siteRes, sectionsRes] = await Promise.all([
                    fetch(`http://localhost:3000/softwares/${id}`),
                    fetch(`http://localhost:3000/tutoriais/software/${id}`),
                    fetch(`http://localhost:3000/softwares/${id}/site`),
                    fetch(`http://localhost:3000/softwares/${id}/content`)
                ]);

                // Verifica se o software existe
                if (!softwareRes.ok) {
                    throw new Error(softwareRes.status === 404
                        ? 'Software não encontrado'
                        : 'Erro ao carregar dados do software');
                }

                const softwareData = await softwareRes.json();
                setSoftware(softwareData);

                // Verifica se há tutorial vinculado
                if (tutorialRes.ok) {
                    setTutorial(await tutorialRes.json());
                } else {
                    setTutorial(null);
                }

                // Verifica se há site vinculado
                if (siteRes.ok) {
                    setSite(await siteRes.json());
                } else {
                    setSite(null);
                }

                // Verifica se há conteúdo
                if (!sectionsRes.ok) {
                    console.warn('Nenhum conteúdo encontrado para este software');
                    setSections([]);
                } else {
                    const sectionsData = await sectionsRes.json();
                    // Garante que sectionsData seja um array
                    setSections(Array.isArray(sectionsData) ? sectionsData : []);
                }

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(err.message);
                setSoftware(null);
                setSections([]);
                setTutorial(null);
                setSite(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Função para renderizar o conteúdo dinâmico
    const renderContent = () => {
        if (!Array.isArray(sections)) {
            return (
                <div className="alert alert-warning">
                    Nenhum conteúdo disponível para este software.
                </div>
            );
        }

        if (sections.length === 0) {
            return (
                <div className="alert alert-info">
                    Este software ainda não possui conteúdo cadastrado.
                </div>
            );
        }

        return sections.map((section, index) => {
            const conteudos = Array.isArray(section.conteudos) ? section.conteudos : [];
            let content;

            switch (section.tipo) {
                case 'titulo':
                    content = (
                        <h4 key={`${section.id_secao}-${index}`} className="pt-4">
                            {conteudos[0]?.texto || 'Título não disponível'}
                        </h4>
                    );
                    break;
                case 'paragrafo':
                    content = (
                        <p key={`${section.id_secao}-${index}`}>
                            {conteudos[0]?.texto || 'Conteúdo não disponível'}
                        </p>
                    );
                    break;
                case 'lista':
                    content = (
                        <ul key={`${section.id_secao}-${index}`} className="list-group mb-2">
                            {conteudos.map((item, i) => (
                                <li key={`${item.id}-${i}`} className="list-group-item">
                                    {item.texto || 'Item sem texto'}
                                </li>
                            ))}
                        </ul>
                    );
                    break;
                case 'area_atuacao':
                    content = (
                        <div key={`${section.id_secao}-${index}`} className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">{conteudos[0]?.titulo || 'Área de atuação'}</h5>
                                <p className="card-text">{conteudos[0]?.descricao || 'Descrição não disponível'}</p>
                            </div>
                        </div>
                    );
                    break;
                default:
                    content = null;
            }

            return (
                <React.Fragment key={`${section.id_secao}-${index}`}>
                    <div className="content-section">
                        {content}
                    </div>
                    {section.tipo === 'titulo' && index < sections.length - 1 && <hr className="section-divider my-4" />}

                </React.Fragment>
            );
        });
    };

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Carregando detalhes do software...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger">
                    <h4>Erro ao carregar dados</h4>
                    <p>{error}</p>
                    <Link to="/softwares" className="btn btn-primary ">
                        Voltar para lista de softwares
                    </Link>
                </div>
            </div>
        );
    }

    if (!software) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-warning">
                    <h4>Software não encontrado</h4>
                    <p>O software solicitado não está disponível.</p>
                    <Link to="/softwares" className="btn btn-primary">
                        Voltar para lista de softwares
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Cabeçalho */}
            <Header />
            <div className="container mx-auto px-4">

                <Link to="/softwares" className="btn btn-light me-3 mt-5 shadow-sm">
                    <i className="bi bi-arrow-left"></i> Voltar para lista de Softwares
                </Link>

                <div className="row mt-4">
                    <div className="col-lg-3 col-md-4 my-4">
                        <div className="bg-custom text-white p-3 rounded">
                            <h5>{software.nome || 'Software não encontrado'}</h5>
                            <p><i className="bi bi-person-gear me-2"></i>Desenvolvedor: {software.desenvolvedor || 'N/A'}</p>
                            <p><i className="bi bi-grid-3x3-gap-fill me-2"></i>Categoria: {software.nome_categoria || 'N/A'}</p>
                            <button
                                className="btn btn-contrast w-100 mt-3 "
                                onClick={() => window.open(software.url, '_blank')}
                                disabled={!software.url}
                            >
                                {software.url ? 'Ir para Download' : 'Link não disponível'}
                            </button>
                        </div>
                    </div>


                    <div className="col-lg-8 col-md-7 mx-auto my-4">
                        {/* Conteúdo dinâmico do banco de dados */}
                        <div className="software-content">
                            {renderContent()}
                        </div>

                        <hr className="border-secondary" />

                        <div className="d-flex gap-2 mt-4">
                            {/* Botões permanecem iguais */}
                            {tutorial && (
                                <Link
                                    to={`/tutorial/${tutorial.id_tutorial}`}
                                    className="btn btn-secondary shadow"
                                >
                                    Acessar Tutorial do Software ({tutorial.titulo})
                                </Link>
                            )}
                            <button
                                className="btn btn-primary shadow"
                                onClick={() => window.open(site?.url, '_blank')}
                                disabled={!site?.url}
                            >
                                Visitar site oficial
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default SoftwareDetalhes;