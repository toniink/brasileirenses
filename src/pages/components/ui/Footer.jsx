import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles.css';

const Footer = () => {
    return (
        <footer className="bg-primary text-light py-4 mt-4">
            <div className="container-fluid">
                <div className="row">
                    {/* Coluna Contato */}
                    <div className="col-md-3 text-center">
                        <h5>Ajuda</h5>
                        <p>
                            Precisa falar com a gente?<br />
                            Entre em contato usando nosso formulário!<br />
                            <Link to="/feedback" className="btn footer-link  text-decoration-underline">Clique aqui</Link>

                        </p>
                    </div>

                    {/* Coluna Repositório - GitHub */}
                    <div className="col-md-3 text-center">
                        <h5 className="mb-3">GitHub</h5>

                        {/* Ícone do GitHub */}
                        <div className="d-flex justify-content-center mb-3">
                            <a href="https://github.com/toniink/brasileirenses"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Link para o repositório no GitHub">
                                <i className="bi bi-github text-white" style={{ fontSize: '2.5rem' }}></i>
                            </a>
                        </div>

                        {/* Texto descritivo */}
                        <p className="mb-3">Acesse o repositório para saber mais sobre o projeto!</p>

                        {/* Link de acesso */}
                        <a href="https://github.com/toniink/brasileirenses"
                            className="btn btn-outline-light btn-sm"
                            target="_blank"
                            rel="noopener noreferrer">
                            Ver repositório
                        </a>
                    </div>

                    {/* Coluna Opinião */}
                    <div className="col-md-3 text-center">
                        <h5>Dê sua Opinião</h5>
                        <p>
                            Queremos ouvir você!<br />
                            Compartilhe sua opinião preenchendo nosso formulário.<br />
                            <Link to="/feedback" className="btn footer-link  text-decoration-underline">Envie aqui</Link>

                        </p>
                    </div>

                    {/* Coluna Menu Rápido */}
                    <div className="col-md-3 text-center">
                        <h5>Menu Rápido</h5>
                        <ul className="list-unstyled">

                            <li>
                                <Link to="/" className="btn footer-link text-decoration-underline">Página Inicial</Link>
                            </li>

                            <li>
                                <Link to="/cursos" className="btn footer-link  text-decoration-underline">Cursos</Link>
                            </li>
                            <li>
                                <Link to="/softwares" className="btn footer-link  text-decoration-underline">Softwares</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="btn t text-decoration-underline footer-link">Ajuda</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
                </div>
            </div>
        </footer>
    )
};

export default Footer;