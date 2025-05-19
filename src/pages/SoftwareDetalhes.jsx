import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

const SoftwareDetalhes = () => {
    const { id } = useParams();
    const [software, setSoftware] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Busca dados do software e seções de conteúdo
                const [softwareRes, sectionsRes] = await Promise.all([
                    fetch(`http://localhost:3000/softwares/${id}`),
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Função para renderizar o conteúdo dinâmico
    const renderContent = () => {
        // Garante que sections seja um array antes de mapear
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
            // Garante que conteudos seja um array
            const conteudos = Array.isArray(section.conteudos) ? section.conteudos : [];

            switch (section.tipo) {
                case 'titulo':
                    return (
                        <h4 key={`${section.id_secao}-${index}`} className="mt-4">
                            {conteudos[0]?.texto || 'Título não disponível'}
                        </h4>
                    );
                case 'paragrafo':
                    return (
                        <p key={`${section.id_secao}-${index}`}>
                            {conteudos[0]?.texto || 'Conteúdo não disponível'}
                        </p>
                    );
                case 'lista':
                    return (
                        <ul key={`${section.id_secao}-${index}`} className="list-group">
                            {conteudos.map((item, i) => (
                                <li key={`${item.id}-${i}`} className="list-group-item">
                                    {item.texto || 'Item sem texto'}
                                </li>
                            ))}
                        </ul>
                    );
                case 'area_atuacao':
                    return (
                        <div key={`${section.id_secao}-${index}`} className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">{conteudos[0]?.titulo || 'Área de atuação'}</h5>
                                <p className="card-text">{conteudos[0]?.descricao || 'Descrição não disponível'}</p>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
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
                    <Link to="/softwares" className="btn btn-primary">
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

            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>{software.nome || 'Software não encontrado'}</h5>
                        <p>Desenvolvedor: {software.desenvolvedor || 'N/A'}</p>
                        <p>Categoria: {software.nome_categoria || 'N/A'}</p>
                        <div className="bg-dark" style={{ height: '150px', marginTop: '15px' }} />
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={() => window.open(software.url, '_blank')}
                            disabled={!software.url}
                        >
                            {software.url ? 'Ir para Download' : 'Link não disponível'}
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
                    <Link to="/softwares" className="btn btn-light me-3">
                        <i className="bi bi-arrow-left"></i> Voltar para lista de Softwares

                    </Link>
                    {/* Conteúdo dinâmico do banco de dados */}
                    {renderContent()}

                    <hr className="border-secondary" />

                    <div className="d-flex gap-2 mt-4">
                        <Link to="/softwares" className="btn btn-secondary">
                            Voltar para lista
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.open(software.url, '_blank')}
                            disabled={!software.url}
                        >
                            Visitar site oficial
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default SoftwareDetalhes;