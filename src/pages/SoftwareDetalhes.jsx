import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SoftwareDetalhes = () => {
    const { id } = useParams(); // Captura o ID do software na URL
    const [software, setSoftware] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/softwares/${id}`) // Obtém os dados do software pelo banco
            .then(response => response.json())
            .then((data) => {
                if (!data.id_tutorial) {
                    console.error(`Erro: ID do tutorial não encontrado para o software ID ${id}`);
                }
                setSoftware(data);
            })
            .catch(error => console.error('Erro ao buscar dados do software:', error));
    }, [id]);

    // Agora redireciona para o tutorial correto pelo ID do tutorial armazenado no banco
    const handleRedirect = () => {
        if (software.id_tutorial) {
            navigate(`/tutorial/${software.id_tutorial}`);
        } else {
            console.error(`Erro: ID do tutorial não encontrado no software ID ${software.id}`);
        }
    };

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
                        <h5>{software.nome || 'Software Exemplo'}</h5>
                        <p>Desenvolvedor: {software.desenvolvedor || 'N/A'}</p>
                        <p>Plataformas: {software.plataformas || 'N/A'}</p>
                        <button className="btn btn-primary w-100 mt-3" onClick={() => window.open(software.url || '#', '_blank')}>
                            Ir para Download
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
                    <h4>O que o software é capaz</h4>
                    <p>{software.capacidades || 'Descrição sobre o que o software é capaz de fazer.'}</p>
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

                        <button className="btn btn-secondary" onClick={() => window.open(software.url || '#', '_blank')}>
                            Ir para Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftwareDetalhes;
