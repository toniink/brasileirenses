import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const faqSections = [
  {
    title: "Sobre os Cursos",
    items: [
      {
        question: "Os cursos são gratuitos?",
        answer:
          "Sim, todos os cursos oferecidos são totalmente gratuitos para qualquer usuário cadastrado.",
      },
      {
        question: "Preciso fazer matrícula para começar?",
        answer:
          "Não. Basta criar sua conta na plataforma e escolher o curso desejado para começar imediatamente.",
      },
      {
        question: "Existe limite de idade para participar?",
        answer: "Não há limite de idade. Os cursos são abertos a todos que desejam aprender.",
      },
      {
        question: "Os cursos oferecem certificado?",
        answer:
          "Sim. Após completar todas as atividades obrigatórias, o certificado digital será disponibilizado para download.",
      },
    ],
  },
  {
    title: "Certificação",
    items: [
      {
        question: "Como faço para obter o certificado?",
        answer:
          "Acesse o curso concluído e clique em 'Emitir Certificado' na tela final. O certificado será gerado automaticamente.",
      },
      {
        question: "O certificado tem validade legal?",
        answer:
          "Embora não seja reconhecido pelo MEC, é válido como curso livre e pode ser usado como atividade complementar.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div>
      {/* Header */}
      <header className="bg-light py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Navegação no Header */}
            <nav className="d-flex gap-3">
              <Link to="/" className="btn btn-link">
                HOME
              </Link>
              <Link to="/cursos" className="btn btn-link">
                CURSOS
              </Link>
              <Link to="/softwares" className="btn btn-link">
                PROGRAMAS
              </Link>
              <button className="btn btn-link">CATEGORIAS</button>
              <button className="btn btn-link">CONTATO</button>
            </nav>
            {/* Botão de Login */}
            <button className="btn btn-primary">
              <Link to="/login" className="text-white text-decoration-none">
                Fazer Login
              </Link>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo FAQ */}
      <main className="container my-5">
        <h1 className="mb-4 text-primary fw-bold border-bottom pb-2">
          Perguntas Frequentes
        </h1>

        <div className="accordion" id="faqAccordion">
          {faqSections.map((section, secIndex) => (
            <div key={secIndex} className="mb-4">
              {/* Categoria */}
              <h3 className="text-secondary fw-semibold mb-3">{section.title}</h3>

              {/* Perguntas como accordion */}
              {section.items.map((item, index) => {
                const id = `section${secIndex}-item${index}`;
                return (
                  <div className="accordion-item" key={id}>
                    <h2 className="accordion-header" id={`heading-${id}`}>
                      <button
                        className="accordion-button collapsed d-flex align-items-center gap-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${id}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${id}`}
                      >
                        <i className="bi bi-question-circle text-primary fs-5"></i>
                        {item.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${id}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading-${id}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-secondary">{item.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-light py-4">
        <div className="container-fluid">
          <div className="row">
            {/* Coluna Contato */}
            <div className="col-md-3 text-center">
              <h5>Ajuda</h5>
              <p>
                Precisa falar com a gente?
                <br />
                Entre em contato usando nosso formulário!
                <br />
                <button className="btn btn-link text-light text-decoration-underline">
                  Clique aqui
                </button>
              </p>
            </div>

            {/* Coluna Redes Sociais */}
            <div className="col-md-3 text-center">
              <h5>Redes Sociais</h5>
              <div className="d-flex justify-content-center gap-2">
                <div
                  className="bg-secondary rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
                <div
                  className="bg-secondary rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
                <div
                  className="bg-secondary rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <p className="mt-2">Siga-nos nas redes sociais!</p>
            </div>

            {/* Coluna Opinião */}
            <div className="col-md-3 text-center">
              <h5>Dê sua Opinião</h5>
              <p>
                Queremos ouvir você!
                <br />
                Compartilhe sua opinião preenchendo nosso formulário.
                <br />
                <button className="btn btn-link text-light text-decoration-underline">
                  Envie aqui
                </button>
              </p>
            </div>

            {/* Coluna Menu Rápido */}
            <div className="col-md-3 text-center">
              <h5>Menu Rápido</h5>
              <ul className="list-unstyled">
                <li>
                  <button className="btn btn-link text-light text-decoration-underline">
                    Página Principal
                  </button>
                </li>
                <li>
                  <button className="btn btn-link text-light text-decoration-underline">
                    Cursos
                  </button>
                </li>
                <li>
                  <button className="btn btn-link text-light text-decoration-underline">
                    Software
                  </button>
                </li>
                <li>
                  <button className="btn btn-link text-light text-decoration-underline">
                    Categorias
                  </button>
                </li>
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

export default FAQ;
