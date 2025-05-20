import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

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
      <Header />

      {/* Conteúdo FAQ */}
      <main className="container my-5">
        <Link to="/" className="btn btn-light me-3">
          <i className="bi bi-arrow-left"></i> Voltar para página principal

        </Link>
        
        <h1 className="mb-4 text-primary fw-bold border-bottom pb-2 mt-4">
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
      <Footer />
    </div>
  );
};

export default FAQ;
