import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SoftwareDetalhes = () => {
    const { id } = useParams();
    const [software, setSoftware] = useState(null);
    const [conteudo, setConteudo] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca dados do software e conteúdo
                const [softwareRes, conteudoRes] = await Promise.all([
                    fetch(`http://localhost:3000/softwares/${id}`),
                    fetch(`http://localhost:3000/softwares/${id}/conteudoCompleto`)
                ]);

                if (!softwareRes.ok || !conteudoRes.ok) {
                    throw new Error('Erro ao carregar dados');
                }

                const softwareData = await softwareRes.json();
                const conteudoData = await conteudoRes.json();

                setSoftware(softwareData);
                setConteudo(conteudoData);
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setCarregando(false);
            }
        };

        fetchData();
    }, [id]);

    // Função para renderizar o conteúdo dinâmico
    const renderConteudo = () => {
        return conteudo.map((secao, index) => {
            switch (secao.tipo) {
                case 'titulo':
                    return <h4 key={index} className="mt-4">{secao.conteudos[0]?.texto}</h4>;
                case 'paragrafo':
                    return <p key={index}>{secao.conteudos[0]?.texto}</p>;
                case 'lista':
                    return (
                        <ul key={index} className="list-group">
                            {secao.conteudos.map((item, i) => (
                                <li key={i} className="list-group-item">{item.texto}</li>
                            ))}
                        </ul>
                    );
                case 'area_atuacao':
                    return (
                        <div key={index} className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">{secao.conteudos[0]?.titulo}</h5>
                                <p className="card-text">{secao.conteudos[0]?.descricao}</p>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    if (carregando) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Carregando detalhes do software...</p>
            </div>
        );
    }

    if (!software) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger">
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
            <header className="bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <nav className="d-flex gap-3">
                        <Link to="/" className="btn btn-link">HOME</Link>
                        <Link to="/cursos" className="btn btn-link">CURSOS</Link>
                        <Link to="/softwares" className="btn btn-link">PROGRAMAS</Link>
                        <button className="btn btn-link">CATEGORIAS</button>
                        <button className="btn btn-link">CONTATO</button>
                    </nav>
                    <button className="btn btn-primary">Fazer Login</button>
                </div>
            </header>

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
                    {/* Conteúdo dinâmico do banco de dados */}
                    {renderConteudo()}

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

            {/* Footer - Mantido igual ao exemplo */}
            <footer className="bg-primary text-light py-4 mt-4">
                <div className="container">
                    <div className="row">
                        {/* Coluna Contato */}
                        <div className="col-md-3 text-center">
                            <h5>Contato</h5>
                            <p>
                                Fale conosco preenchendo nosso formulário!<br />
                                <button className="btn btn-link text-light text-decoration-underline">Clique aqui</button>
                            </p>
                        </div>

                        {/* Coluna Redes Sociais */}
                        <div className="col-md-3 text-center">
                            <h5>Redes Sociais</h5>
                            <div className="d-flex justify-content-center gap-2">
                                <div className="bg-secondary rounded-circle" style={{ width: '40px', height: '40px' }} />
                                <div className="bg-secondary rounded-circle" style={{ width: '40px', height: '40px' }} />
                                <div className="bg-secondary rounded-circle" style={{ width: '40px', height: '40px' }} />
                            </div>
                            <p className="mt-2">Siga-nos nas redes sociais!</p>
                        </div>

                        {/* Coluna Opinião */}
                        <div className="col-md-3 text-center">
                            <h5>Dê sua Opinião</h5>
                            <p>
                                Envie sua opinião para nós preenchendo o formulário!<br />
                                <button className="btn btn-link text-light text-decoration-underline">Clique aqui</button>
                            </p>
                        </div>

                        {/* Coluna Menu Rápido */}
                        <div className="col-md-3 text-center">
                            <h5>Menu Rápido</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/" className="btn btn-link text-light text-decoration-underline">Página Principal</Link></li>
                                <li><Link to="/cursos" className="btn btn-link text-light text-decoration-underline">Cursos</Link></li>
                                <li><Link to="/softwares" className="btn btn-link text-light text-decoration-underline">Software</Link></li>
                                <li><button className="btn btn-link text-light text-decoration-underline">Categorias</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center mt-3">
                        <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SoftwareDetalhes;