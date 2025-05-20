import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles.css';

const Footer = () => {
    return (
        <footer className="bg-primary text-light py-4 mt-auto"> {/* mt-auto para sticky footer */}
            <div className="container">
                <div className="row g-3 g-md-4">
                    {/* Coluna Contato */}
                    <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0 text-center text-md-start">
                        <h5 className="mb-3 position-relative">
                            Ajuda
                            <div className="d-none d-md-block position-absolute bottom-0 start-0 w-25 border-top border-light opacity-25" style={{ bottom: '-10px' }}></div>
                        </h5>
                        <div className="d-md-none mb-3 w-25 mx-auto border-top border-light opacity-25"></div>
                        <p className="mb-3">
                            Precisa falar com a gente?<br />
                            Entre em contato usando nosso formulário!
                        </p>
                        <Link to="/feedback" className="btn footer-link p-0 text-decoration-underline">Clique aqui</Link>
                    </div>

                    {/* Coluna Repositório - GitHub */}
                    <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0 text-center">
                        <h5 className="mb-3 position-relative">
                            GitHub
                            <div className="d-none d-md-block position-absolute bottom-0 start-50 translate-middle-x w-25 border-top border-light opacity-25" style={{ bottom: '-10px' }}></div>
                        </h5>
                        <div className="d-md-none mb-3 w-25 mx-auto border-top border-light opacity-25"></div>
                        <div className="d-flex justify-content-center mb-3">
                            <a href="https://github.com/toniink/brasileirenses"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Link para o repositório no GitHub"
                                className="d-inline-block">
                                <i className="bi bi-github text-white" style={{ fontSize: '2rem' }}></i>
                            </a>
                        </div>
                        <p className="mb-3">Acesse o repositório para saber mais sobre o projeto!</p>
                        <a href="https://github.com/toniink/brasileirenses"
                            className="btn btn-outline-light btn-sm"
                            target="_blank"
                            rel="noopener noreferrer">
                            Ver repositório
                        </a>
                    </div>

                    {/* Coluna Opinião */}
                    <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0 text-center text-md-start">
                        <h5 className="mb-3 position-relative">
                            Dê sua Opinião
                            <div className="d-none d-md-block position-absolute bottom-0 start-0 w-25 border-top border-light opacity-25" style={{ bottom: '-10px' }}></div>
                        </h5>
                        <div className="d-md-none mb-3 w-25 mx-auto border-top border-light opacity-25"></div>
                        <p className="mb-3">
                            Queremos ouvir você!<br />
                            Compartilhe sua opinião preenchendo nosso formulário.
                        </p>
                        <Link to="/feedback" className="btn footer-link p-0 text-decoration-underline">Envie aqui</Link>
                    </div>

                    {/* Coluna Menu Rápido */}
                    <div className="col-12 col-sm-6 col-md-3 text-center text-md-start">
                        <h5 className="mb-3 position-relative">
                            Menu Rápido
                            <div className="d-none d-md-block position-absolute bottom-0 start-0 w-25 border-top border-light opacity-25" style={{ bottom: '-10px' }}></div>
                        </h5>
                        <div className="d-md-none mb-3 w-25 mx-auto border-top border-light opacity-25"></div>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="footer-link text-decoration-underline">Página Inicial</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/cursos" className="footer-link text-decoration-underline">Cursos</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/softwares" className="footer-link text-decoration-underline">Softwares</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="footer-link text-decoration-underline">Ajuda</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-4 pt-3 border-top border-light">
                    <p className="mb-0">&copy; 2025 - Desenvolvido por Brasilierenses</p>
                </div>
            </div>
        </footer>
    )
};

export default Footer;