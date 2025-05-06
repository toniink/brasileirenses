import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import mapeamentoTutoriais from '../data/mapeamentoTutoriais'; // Importa o mapeamento

const SoftwareDetalhes = () => {
    const { id } = useParams(); // Captura o ID do software na URL
    const [software, setSoftware] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                const response = await fetch(`http://localhost:3000/softwares/${id}`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar software ID ${id}`);
                }
                const data = await response.json();

                if (!data || Object.keys(data).length === 0) {
                    throw new Error(`Software não encontrado para ID ${id}`);
                }

                setSoftware(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchSoftware();
    }, [id]);

    // Obtém o ID correto do tutorial baseado no software
    const tutorialId = mapeamentoTutoriais[id];

    const handleRedirect = () => {
        if (tutorialId) {
            navigate(`/tutorial/${tutorialId}`);
        } else {
            console.error(`Erro: Tutorial não encontrado para o software ID ${id}`);
        }
    };

    if (!software) {
        return (
            <div className="container text-center mt-5">
                <h1>Carregando dados...</h1>
                <p>Aguarde enquanto recuperamos os detalhes do software.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Cabeçalho */}
            <header className="bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <nav className="d-flex gap-3">
                        <button className="btn btn-link">HOME</button>
                        <button className="btn btn-link">SOFTWARES</button>
                        <button className="btn btn-link">PROGRAMAS</button>
                        <button className="btn btn-link">CATEGORIAS</button>
                        <button className="btn btn-link">CONTATO</button>
                    </nav>
                    <button className="btn btn-primary">Fazer Login</button>
                </div>
            </header>

            {/* Layout Principal */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>{software.nome || 'Software não encontrado'}</h5>
                        <p>Desenvolvedor: {software.desenvolvedor || 'N/A'}</p>
                        <p>Plataformas: {software.plataformas || 'N/A'}</p>
                        <button className="btn btn-primary w-100 mt-3" onClick={() => window.open(software.site || '#', '_blank')}>
                            Ir para Download
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
                    <h4>O que o software é capaz</h4>
                    <p>{software.descricao ? software.descricao.join(' ') : 'Descrição não disponível.'}</p>
                    <hr className="border-secondary" />

                      {/* Áreas de Atuação */}
                      <h4>Áreas de Atuação</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Área 1</h5>
                            <p>Descrição da primeira área de atuação.</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Área 2</h5>
                            <p>Descrição da segunda área de atuação.</p>
                        </div>
                    </div>
                    <hr className="border-secondary" />

                    {/* Botões de Ação */}
                    <div className="mt-4">
                        <button className="btn btn-primary me-2" onClick={handleRedirect}>
                            Ir para Tutorial de Instalação
                        </button>

                        <button className="btn btn-secondary" onClick={() => window.open(software.site || '#', '_blank')}>
                            Ir para Download
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
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
                                <li><button className="btn btn-link text-light text-decoration-underline">Página Principal</button></li>
                                <li><button className="btn btn-link text-light text-decoration-underline">Cursos</button></li>
                                <li><button className="btn btn-link text-light text-decoration-underline">Software</button></li>
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
