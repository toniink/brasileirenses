import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link do React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa os estilos do Bootstrap
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import '../styles.css';

const HomePage = () => (
  <div className="container-fluid">
    {/* Cabeçalho */}
    <Header />

    {/* Conteúdo Principal */}
    <main className="container mt-4">
      {/* Seção Boas-vindas */}
      <section className="row align-items-center mb-5">
        <div className="col-md-6 col-sm-12 text-start">
          <h1>Seja bem-vindo ao seu espaço digital de aprendizado!</h1>
          <p>
            Aqui, transformamos conhecimento em algo acessível e intuitivo, ajudando você a trilhar seu caminho com confiança.
            Descubra como simplificar o complexo e abraçar as tecnologias de forma descomplicada e prática.
          </p>
          <Link to="/cursos" className="btn btn-primary mb-3 shadow">IR AOS CURSOS</Link>
          <br />
          <Link to="/faq" className="btn btn-link text-primary ps-0">Tem dúvidas? Veja nosso suporte</Link>

        </div>
        <div className="col-md-6 col-sm-12 text-end">
          <img
            src="https://icemexico.online/wp-content/uploads/2020/09/6461-2048x1280.jpg"
            alt="imagem principal"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
          />
        </div>
      </section>

      <hr className="divisor" />


      {/* Seção Acessível e Seguro */}
      <section className="row align-items-center bg-light p-4 rounded">
        <div className="col-md-6 text-start">
          <h2>Acessível e Seguro</h2>
          <p>
            Garantimos tutoriais simples para instalação de softwares diretamente dos sites oficiais, evitando riscos com vírus ou fontes não confiáveis.
            Nossa missão é oferecer acesso fácil e seguro ao conhecimento digital, mesmo para iniciantes.
          </p>
        </div>
        <div className="col-md-6 text-end d-flex justify-content-center">
          <div style={{ width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="https://static.vecteezy.com/system/resources/previews/010/145/488/large_2x/download-icon-sign-symbol-design-free-png.png"
              alt="Ícone de segurança"
              style={{ width: '60%', height: '60%' }}
            />
          </div>
        </div>
      </section>

      <hr className="divisor" />

      {/* Seção Conheça Alguns Cursos */}
      {/* Seção Conheça Alguns Cursos */}
      <section className="container mt-5">
        <h2 className="text-center mb-4">Conheça Alguns Cursos</h2>
        <div className="row">
          {/* Curso Python */}
          <Link to="/cursos" className="col-md-4 text-center mb-4 text-decoration-none shadow-sm">
            <div className="h-100 p-3 hover-effect" style={{ cursor: 'pointer' }}>
              <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
                  alt="Logo do Python"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-dark mt-3">Python</h3>
              <p className="text-muted">
                Aprenda o básico de lógica de programação com uma das linguagens mais populares atualmente.
              </p>
            </div>
          </Link>

          {/* Curso Finanças */}
          <Link to="/cursos" className="col-md-4 text-center mb-4 text-decoration-none shadow-sm">
            <div className="h-100 p-3 hover-effect" style={{ cursor: 'pointer' }}>
              <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                <img
                  src="https://images.icon-icons.com/1149/PNG/512/1486504348-business-coins-finance-banking-bank-marketing_81341.png"
                  alt="Imagem representando finanças"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                />
              </div>
              <h3 className="text-dark mt-3">Finanças</h3>
              <p className="text-muted">
                Estude sobre economia de forma a aprender a gerenciar seu dinheiro de forma eficiente.
              </p>
            </div>
          </Link>

          {/* Curso JavaScript */}
          <Link to="/cursos" className="col-md-4 text-center mb-4 text-decoration-none shadow-sm ">
            <div className="h-100 p-3 hover-effect" style={{ cursor: 'pointer' }}>
              <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
                  alt="Logo do JavaScript"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-dark mt-3">JavaScript</h3>
              <p className="text-muted">
                Veja como construir um site utilizando uma das linguagens mais versáteis para web.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <hr className="divisor" />
      {/* Seção Crie Sua Conta */}
      <section className="container mt-5 bg-light p-4 rounded">
        <div className="row align-items-center">
          <div className="col-md-6 text-start">
            <h2>Crie Sua Conta</h2>
            <p>
              Registre-se gratuitamente para avaliar cursos e deixar comentários. Ajudando outras pessoas a descobrirem se o curso é o que buscam com opniões reais.
            </p>
            <Link to="/cadastro" className="btn btn-primary my-4 shadow">Clique aqui para se cadastrar</Link>
          </div>
          <div className="col-md-6 d-flex justify-content-center">

            <div className="img-HomeCrieConta">
              <img
                src="https://static.vecteezy.com/system/resources/previews/005/163/906/non_2x/create-new-account-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                alt="Imagem circular"
                className="img-HomeCrieContaresponsive"
              />
            </div>
          </div>
        </div>
      </section>
      <hr className="divisor" />
      {/* Seção Descubra Algo Novo */}
      <section className="container mt-5 text-center">
        <p>
          Descubra algo novo para aprender em um acervo com várias áreas, de informática básica até programação.
        </p>

        <Link to="/cursos" className="btn btn-primary my-4 shadow">Veja mais cursos</Link>
      </section>
    </main>

    {/* Footer */}
    <Footer />
  </div>
);

export default HomePage;
