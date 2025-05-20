import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer'; // ajuste o caminho conforme a estrutura

const HomePage = () => (
  <div className="d-flex flex-column min-vh-100">
    {/* Cabeçalho */}
    <header className="bg-light py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <nav className="d-flex gap-3">
            <Link to="/" className="btn btn-link">HOME</Link>
            <Link to="/cursos" className="btn btn-link">CURSOS</Link>
            <Link to="/softwares" className="btn btn-link">PROGRAMAS</Link>
            <button className="btn btn-link">CATEGORIAS</button>
            <button className="btn btn-link">CONTATO</button>
          </nav>
          <button className="btn btn-primary">
            <Link to="/login" className='text-white text-decoration-none'>Fazer Login</Link>
          </button>
        </div>
      </div>
    </header>

    {/* Conteúdo Principal */}
    <main className="container mt-4 flex-grow-1">
      {/* Seção de boas-vindas */}
      <section className="row align-items-center mb-5">
        <div className="col-md-6 col-sm-12 text-start">
          <h1>Seja bem-vindo ao seu espaço digital de aprendizado!</h1>
          <p>
            Aqui, transformamos conhecimento em algo acessível e intuitivo, ajudando você a trilhar seu caminho com confiança.
          </p>
          <Link to="/cursos" className="btn btn-primary mb-3">IR AOS CURSOS</Link>
          <br />
          <button className="btn btn-link text-primary">Tem dúvidas? Veja nosso suporte</button>
        </div>
        <div className="col-md-6 col-sm-12 text-end">
          <img
            src="https://icemexico.online/wp-content/uploads/2020/09/6461-2048x1280.jpg"
            alt="imagem principal"
            className="img-fluid rounded"
          />
        </div>
      </section>

      {/* Acessível e Seguro */}
      <section className="row align-items-center bg-light p-4 rounded">
        <div className="col-md-6 text-start">
          <h2>Acessível e Seguro</h2>
          <p>
            Garantimos tutoriais simples para instalação de softwares diretamente dos sites oficiais, evitando riscos com vírus ou fontes não confiáveis.
          </p>
        </div>
        <div className="col-md-6 text-end">
          <img
            src="https://static.vecteezy.com/system/resources/previews/010/145/488/large_2x/download-icon-sign-symbol-design-free-png.png"
            alt="Ícone de segurança"
            style={{ width: '60px' }}
          />
        </div>
      </section>

      {/* Cursos */}
      <section className="container mt-5">
        <h2 className="text-center mb-4">Conheça Alguns Cursos</h2>
        <div className="row">
          {/* Python */}
          <div className="col-md-4 text-center mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" style={{ width: '100px' }} />
            <h3>Python</h3>
            <p>Aprenda lógica de programação com uma linguagem poderosa e versátil.</p>
          </div>
          {/* Finanças */}
          <div className="col-md-4 text-center mb-4">
            <img src="https://images.icon-icons.com/1149/PNG/512/1486504348-business-coins-finance-banking-bank-marketing_81341.png" alt="Finanças" style={{ width: '100px' }} />
            <h3>Finanças</h3>
            <p>Gerencie seu dinheiro com inteligência e segurança.</p>
          </div>
          {/* JavaScript */}
          <div className="col-md-4 text-center mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" style={{ width: '100px' }} />
            <h3>JavaScript</h3>
            <p>Desenvolva para a web com uma das linguagens mais populares do mundo.</p>
          </div>
        </div>
      </section>

      {/* Criação de conta */}
      <section className="container mt-5 bg-light p-4 rounded">
        <div className="row align-items-center">
          <div className="col-md-6 text-start">
            <h2>Crie Sua Conta</h2>
            <p>
              Registre-se para avaliar cursos, deixar comentários e criar playlists.
            </p>
          </div>
          <div className="col-md-6 text-end">
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/163/906/non_2x/create-new-account-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
              alt="Criar conta"
              className="img-fluid rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Descubra algo novo */}
      <section className="container mt-5 text-center">
        <p>
          Descubra algo novo para aprender em um acervo com várias áreas, de informática básica até programação.
        </p>
        <button className="btn btn-primary my-4">Veja mais cursos</button>
      </section>
    </main>

    {/* ✅ Footer Componentizado */}
    <Footer />
  </div>
);

export default HomePage;
