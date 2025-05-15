/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom'; // Adicionar hook para navegação

const CursoPagina = () => {
    const [cursos, setCursos] = useState([]); // Estado para armazenar os cursos
    const navigate = useNavigate(); // Hook para navegação entre páginas

    useEffect(() => {
        // Consumir a API para buscar os cursos
        fetch('http://localhost:3000/cursos') // URL do endpoint de cursos
            .then(response => response.json())
            .then(data => setCursos(data)) // Atualiza o estado com os cursos
            .catch(error => console.error('Erro ao buscar cursos:', error));
    }, []); // Executa apenas na primeira renderização

    const handleCursoClick = (id) => {
        // Navegar para a página do curso específico com base no ID
        navigate(`/cursos/${id}`); // Exemplo de rota dinâmica
    };

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

            {/* Layout Principal */}
            <div className="row mt-4">
                {/* Coluna Lateral: Filtro */}
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>Filtro</h5>
                        <p>(Placeholder para filtros)</p>
                    </div>
                </div>

                {/* Conteúdo Principal: Cursos */}
                <div className="col-md-9">
                    <h2 className="mb-4">Cursos</h2>
                    <div className="row">
                        {/* Renderizar os cursos dinamicamente */}
                        {cursos.map(curso => (
                            <div
                                className="col-md-4 mb-4"
                                key={curso.id_cursos}
                                style={{ cursor: 'pointer' }} // Adiciona estilo para indicar clique
                                onClick={() => handleCursoClick(curso.id_cursos)}>
                                <div className="card h-100">
                                    <div className="bg-secondary" style={{ height: '150px' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{curso.nome_curso}</h5> {/* Nome do curso */}
                                        <p className="card-text">{curso.descricao}</p> {/* Descrição */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary">Ver mais cursos</button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-primary text-light py-4 mt-4">
                <div className="container">
                    <div className="row">
                        {/* Coluna Contato */}
                        <div className="col-md-3 text-center">
                            <h5>Ajuda</h5>
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

export default CursoPagina;
