import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link do React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa os estilos do Bootstrap

const HomePage = () => (
    <div>
        {/* Cabeçalho */}
        <header className="bg-light py-3">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Navegação no Header */}
                    <nav className="d-flex gap-3">
                        <Link to="/" className="btn btn-link">HOME</Link>
                        <Link to="/cursos" className="btn btn-link">CURSOS</Link>
                        <Link to="/softwares" className="btn btn-link">PROGRAMAS</Link>
                        <button className="btn btn-link">CATEGORIAS</button>
                        <button className="btn btn-link">CONTATO</button>
                    </nav>
                    {/* Botão de Login */}
                    <button className="btn btn-primary">Fazer Login</button>
                </div>
            </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="container mt-4">
            {/* Seção Boas-vindas */}
            <section className="row align-items-center mb-5">
                <div className="col-md-6 text-start">
                    <h1>Seja bem-vindo ao seu espaço digital de aprendizado!</h1>
                    <p>
                        Aqui, transformamos conhecimento em algo acessível e intuitivo, ajudando você a trilhar seu caminho com confiança.
                        Descubra como simplificar o complexo e abraçar as tecnologias de forma descomplicada e prática.
                    </p>
                    {/* Botão com redirecionamento usando Link */}
                    <Link to="/cursos" className="btn btn-primary mb-3">IR AOS CURSOS</Link>

                    <br />
                    <button className="btn btn-link text-primary">Tem dúvidas? Veja nosso suporte</button>
                </div>
                <div className="col-md-6 text-end">
                    {/* Placeholder cinza para a imagem */}
                    <div className="bg-secondary rounded" style={{ width: '150px', height: '150px' }} />
                    <img
                        src="https://example.com/minha-imagem.jpg"
                        alt="Descrição da imagem"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                </div>
            </section>

            {/* Seção Acessível e Seguro */}
            <section className="row align-items-center bg-light p-4 rounded">
                <div className="col-md-6 text-start">
                    <h2>Acessível e Seguro</h2>
                    <p>
                        Garantimos tutoriais simples para instalação de softwares diretamente dos sites oficiais, evitando riscos com vírus ou fontes não confiáveis.
                        Nossa missão é oferecer acesso fácil e seguro ao conhecimento digital, mesmo para iniciantes.
                    </p>
                </div>
                <div className="col-md-6 text-end">
                    <div style={{ width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/010/145/488/large_2x/download-icon-sign-symbol-design-free-png.png"
                            alt="Ícone de segurança"
                            style={{ width: '60%', height: '60%' }}
                        />
                    </div>
                </div>
            </section>

            {/* Seção Conheça Alguns Cursos */}
            <section className="container mt-5">
                <h2 className="text-center mb-4">Conheça Alguns Cursos</h2>
                <div className="row">
                    {/* Curso Python */}
                    <div className="col-md-4 text-center mb-4">
                        {/* Imagem adicionada */}
                        <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
                                alt="Logo do Python"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <h3>Python</h3>
                        <p>
                            Aprenda o básico de lógica de programação com uma das linguagens mais venenosas atualmente.
                        </p>
                    </div>
                    {/* Curso Finanças */}
                    <div className="col-md-4 text-center mb-4">
                        {/* Imagem adicionada */}
                        <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                            <img
                                src="https://images.icon-icons.com/1149/PNG/512/1486504348-business-coins-finance-banking-bank-marketing_81341.png"
                                alt="Imagem representando finanças"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                            />
                        </div>
                        <h3>Finanças</h3>
                        <p>
                            Estude sobre economia de forma a aprender a gerenciar seu dinheiro de forma eficiente.
                        </p>
                    </div>

                    {/* Curso JavaScript */}
                    <div className="col-md-4 text-center mb-4">
                        {/* Adicionando uma imagem */}
                        <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
                                alt="Logo do JavaScript"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <h3>JavaScript</h3>
                        <p>
                            Veja como construir um site utilizando uma das linguagens mais versáteis para web.
                        </p>
                    </div>

                </div>
            </section>

            {/* Seção Crie Sua Conta */}
            <section className="container mt-5 bg-light p-4 rounded">
                <div className="row align-items-center">
                    <div className="col-md-6 text-start">
                        <h2>Crie Sua Conta</h2>
                        <p>
                            Registre-se gratuitamente para avaliar cursos, deixar comentários e criar playlists personalizadas.
                            Organize seu aprendizado com facilidade e planeje trilhas de conhecimento exclusivas!
                        </p>
                    </div>
                    <div className="col-md-6 text-end">
                        {/* Placeholder circular para a imagem */}
                        <div className="bg-secondary rounded-circle" style={{ width: '150px', height: '150px' }} />
                    </div>
                </div>
            </section>

            {/* Seção Descubra Algo Novo */}
            <section className="container mt-5 text-center">
                <p>
                    Descubra algo novo para aprender em um acervo com várias áreas, de informática básica até programação.
                </p>
                <button className="btn btn-primary my-4">Veja mais cursos</button>
            </section>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-light py-4">
            <div className="container-fluid">
                <div className="row">
                    {/* Coluna Contato */}
                    <div className="col-md-3 text-center">
                        <h5>Contato</h5>
                        <p>
                            Precisa falar com a gente?<br />
                            Entre em contato usando nosso formulário!<br />
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
                            Queremos ouvir você!<br />
                            Compartilhe sua opinião preenchendo nosso formulário.<br />
                            <button className="btn btn-link text-light text-decoration-underline">Envie aqui</button>
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

export default HomePage;
