/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import ComentariosCurso from '../pages/components/ui/ComentariosCurso';
import '../styles.css';

const CursoDetalhes = () => {
    const { id } = useParams();
    const [curso, setCurso] = useState(null);
    const [conteudos, setConteudos] = useState([]);
    const [softwares, setSoftwares] = useState([]);
    const [site, setSite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Busca todos os dados em paralelo
                const [cursoResponse, softwaresResponse, conteudosResponse, siteResponse] = await Promise.all([
                    fetch(`http://localhost:3000/cursos/${id}`),
                    fetch(`http://localhost:3000/cursos/${id}/softwares`),
                    fetch(`http://localhost:3000/cursos/${id}/content`),
                    fetch(`http://localhost:3000/cursos/${id}/site`)
                ]);

                if (!cursoResponse.ok) throw new Error(`Erro ao buscar curso ID ${id}`);
                const cursoData = await cursoResponse.json();

                if (!softwaresResponse.ok) throw new Error(`Erro ao buscar softwares`);
                const softwaresData = await softwaresResponse.json();

                if (!conteudosResponse.ok) throw new Error(`Erro ao buscar conteúdos`);
                const conteudosData = await conteudosResponse.json();

                // Verifica se há site vinculado
                let siteData = null;
                if (siteResponse.ok) {
                    siteData = await siteResponse.json();
                }

                setCurso(cursoData);
                setSoftwares(Array.isArray(softwaresData) ? softwaresData : []);
                setConteudos(conteudosData);
                setSite(siteData);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setError(error.message);
                setCurso(null);
                setConteudos([]);
                setSoftwares([]);
                setSite(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Função para renderizar o conteúdo dinamicamente
    const renderContent = (secao) => {
        const content = (() => {
            switch (secao.tipo) {
                case 'titulo':
                    return (
                        <h4 className="mt-4">
                            {secao.conteudos[0]?.texto || 'Título da Seção'}
                        </h4>
                    );
                case 'paragrafo':
                    return (
                        <p className="mt-3">
                            {secao.conteudos[0]?.texto || 'Texto do parágrafo...'}
                        </p>
                    );
                case 'lista':
                    return (
                        <ul className="mt-3">
                            {secao.conteudos.map((item, index) => (
                                <li key={index}>{item.texto || `Item ${index + 1}`}</li>
                            ))}
                        </ul>
                    );
                case 'area_atuacao':
                    return (
                        <div className="row mt-3">
                            {secao.conteudos.map((area, index) => (
                                <div key={index} className="col-md-6 mb-3">
                                    <h5>{area.titulo || `Área ${index + 1}`}</h5>
                                    <p>{area.descricao || 'Descrição da área de atuação...'}</p>
                                </div>
                            ))}
                        </div>
                    );
                case 'passo_a_passo':
                    return (
                        <div className="mt-3">
                            {secao.conteudos.map((passo, index) => (
                                <div key={index} className="mb-3">
                                    <h6>Passo {passo.numero || index + 1}</h6>
                                    <p>{passo.instrucao || 'Instrução do passo...'}</p>
                                    {passo.imagem && (
                                        <img
                                            src={passo.imagem}
                                            alt={`Passo ${passo.numero}`}
                                            className="img-fluid mb-2"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                default:
                    return null;
            }
        })();

        return (
            <div className="content-block">
                {content}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <h1 className="mt-3">Carregando curso...</h1>
                <p>Aguarde enquanto recuperamos os detalhes.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger">
                    <h1>Erro ao carregar o curso</h1>
                    <p>{error}</p>
                    <Link to="/cursos" className="btn btn-primary">
                        Voltar para lista de cursos
                    </Link>
                </div>
            </div>
        );
    }

    if (!curso) {
        return (
            <div className="container text-center mt-5">
                <h1>Curso não encontrado</h1>
                <p>O curso solicitado não foi encontrado em nosso sistema.</p>
                <Link to="/cursos" className="btn btn-primary">
                    Voltar para lista de cursos
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Cabeçalho */}
            <Header />
            <div className="container mx-auto px-4">

                <div className="row mt-4">
                    <div className="col-lg-3 col-md-4 m-4">
                        <div className="bg-custom text-white p-3 rounded">
                            <h5>{curso.nome_curso || 'Curso não encontrado'}</h5>
                            <p><i className="bi bi-clock me-2"></i> Duração: {curso.duracao || 'N/A'}</p>
                            <p><i className="bi bi-book me-2"></i>Nível: {curso.nivel_dificuldade || 'N/A'}</p>
                            <p> <i className="bi bi-display me-2"></i>Formato: {curso.formato || 'N/A'}</p>
                            <button
                                className="btn btn-contrast w-100 mt-3"
                                onClick={() => window.open(site?.url, '_blank')}
                                disabled={!site?.url}
                            >
                                {site?.url ? 'Acessar site do Curso' : 'Link não disponível'}
                            </button>
                        </div>
                    </div>


                    <div className="col-lg-8 col-md-7 mx-auto">
                        <Link to="/cursos" className="btn btn-light me-3">
                            <i className="bi bi-arrow-left"></i> Voltar para lista de Cursos
                        </Link>
                        {/* Visão Geral - Primeira seção */}
                        <section>
                            <h4>Visão Geral</h4>
                            <p>{curso.descricao || 'Texto de visão geral sobre o curso.'}</p>
                            <hr className="border-secondary" />
                        </section>
                        {/* Conteúdo dinâmico das seções */}
                        <div className="content-sections ">
                            {conteudos.map((secao, index) => (
                                <React.Fragment key={index}>
                                    {renderContent(secao)}
                                    {/* Mostra o hr apenas após blocos de conteúdo importantes */}
                                    {['titulo', 'area_atuacao', 'passo_a_passo'].includes(secao.tipo) &&
                                        index < conteudos.length - 1 && (
                                            <hr className="section-divider" />
                                        )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Botão de software associado */}
                        <div className="d-flex gap-2 mt-4">
                            {softwares.length > 0 ? (
                                <Link
                                    to={`/softwares/${softwares[0]?.id_softwares}`}
                                    className="btn btn-secondary"
                                >
                                    Acessar Software Associado ({softwares[0]?.nome})
                                </Link>
                            ) : (
                                <button className="btn btn-secondary" disabled>
                                    Nenhum software associado
                                </button>
                            )}
                            {site?.url && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.open(curso.url, '_blank')}
                                >
                                    Acessar site oficial
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <ComentariosCurso />
                    </div>
                </div>

            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CursoDetalhes;