/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CursoDetalhes = () => {
    const [curso, setCurso] = useState({});

    useEffect(() => {
        // Substitua pelo ID real do curso
        fetch('http://localhost:3000/cursos/1') // Exemplo de endpoint para um curso específico
            .then(response => response.json())
            .then(data => setCurso(data)) // Dados do curso
            .catch(error => console.error('Erro ao buscar dados do curso:', error));
    }, []);

    return (
        <div className="container-fluid">
            {/* Cabeçalho */}
            <header className="bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <nav className="d-flex gap-3">
                        <button className="btn btn-link">HOME</button>
                        <button className="btn btn-link">CURSOS</button>
                        <button className="btn btn-link">PROGRAMAS</button>
                        <button className="btn btn-link">CATEGORIAS</button>
                        <button className="btn btn-link">CONTATO</button>
                    </nav>
                    <button className="btn btn-primary">Fazer Login</button>
                </div>
            </header>

            {/* Layout Principal */}
            <div className="row mt-4">
                {/* Seção Lateral */}
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>{curso.nome_curso || 'Curso Exemplo'}</h5> {/* Nome do curso */}
                        <p>Duração: {curso.duracao || 'N/A'}</p> {/* Duração */}
                        <p>Tipo: {curso.tipo || 'N/A'}</p> {/* Tipo */}
                        <div className="bg-dark" style={{ height: '150px', marginTop: '15px' }} /> {/* Placeholder imagem */}
                    </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="col-md-9">
                    {/* Visão Geral */}
                    <h4>Visão Geral</h4>
                    <p>{curso.visao_geral || 'Texto de visão geral sobre o curso.'}</p>
                    <hr className="border-secondary" />

                    {/* Área Abrangida */}
                    <h4>Área que o Curso Abrange</h4>
                    <p>{curso.area_abrangida || 'Descrição sobre a área que o curso abrange.'}</p>
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
                        <div className="col-md-6">
                            <h5>Área 3</h5>
                            <p>Descrição da terceira área de atuação.</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Área 4</h5>
                            <p>Descrição da quarta área de atuação.</p>
                        </div>
                    </div>
                    <hr className="border-secondary" />

                    {/* Descrição das Áreas */}
                    <h5>Descrição das Áreas de Atuação</h5>
                    <p>{curso.descricao_areas || 'Texto explicativo sobre as áreas de atuação abordadas pelo curso.'}</p>

                    {/* Botão para Tutorial */}
                    <button className="btn btn-primary mt-4">Ir para Tutorial de Instalação</button>
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

export default CursoDetalhes;
