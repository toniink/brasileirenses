/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import ComentariosCurso from '../pages/components/ui/ComentariosCurso';

const CursoDetalhes = () => {
    const { id } = useParams();
    const [curso, setCurso] = useState(null);
    const [conteudos, setConteudos] = useState([]);
    const [softwares, setSoftwares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca dados do curso
                const cursoResponse = await fetch(`http://localhost:3000/cursos/${id}`);
                if (!cursoResponse.ok) throw new Error(`Erro ao buscar curso ID ${id}`);
                const cursoData = await cursoResponse.json();

                // Busca softwares associados
                const softwaresResponse = await fetch(`http://localhost:3000/cursos/${id}/softwares`);
                if (!softwaresResponse.ok) throw new Error(`Erro ao buscar softwares do curso`);
                const softwaresData = await softwaresResponse.json();

                // Busca conteúdos do curso
                const conteudosResponse = await fetch(`http://localhost:3000/cursos/${id}/content`);
                if (!conteudosResponse.ok) throw new Error(`Erro ao buscar conteúdos`);

                setCurso(cursoData);
                setSoftwares(softwaresData);
                setConteudos(await conteudosResponse.json());
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Função para renderizar o conteúdo dinamicamente
    const renderContent = (secao) => {
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


            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>{curso.nome_curso || 'Curso não encontrado'}</h5>
                        <p>Duração: {curso.duracao || 'N/A'}</p>
                        <p>Nível: {curso.nivel_dificuldade || 'N/A'}</p>
                        <p>Formato: {curso.formato || 'N/A'}</p>
                        <div className="bg-dark" style={{ height: '150px', marginTop: '15px' }} />
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={() => window.open(software.url, '_blank')}
                            disabled={!curso.url}
                        >
                            {curso.url ? 'Acessar site oficial' : 'Link não disponível'}
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
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
                    {conteudos.map((secao, index) => (
                        <section key={index}>
                            {renderContent(secao)}
                            {index < conteudos.length - 1 && <hr className="border-secondary" />}
                        </section>
                    ))}

                    {/* Botão de tutorial (se houver URL) */}
                    {/* Botão de software associado */}
                    <div className="d-flex gap-2 mt-4">
                        {/* Verifica se existem softwares associados */}
                        {softwares.length > 0 ? (
                            // Se houver softwares, pega o primeiro (ou você pode mapear todos)
                            <Link
                                to={`/softwares/${softwares[0].id_softwares}`}
                                className="btn btn-secondary"
                            >
                                Acessar Software Associado ({softwares[0].nome})
                            </Link>
                        ) : (
                            // Se não houver softwares associados
                            <button className="btn btn-secondary" disabled>
                                Nenhum software associado
                            </button>
                        )}

                        {curso.url && (
                            <a
                                href={curso.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                Acessar site oficial
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <ComentariosCurso />
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CursoDetalhes;