import React from "react";

const FAQ = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4">Perguntas Frequentes (FAQ)</h1>

      <div className="mb-5">
        <h2>1. Sobre os Cursos</h2>
        <ul>
          <li>Os cursos são gratuitos?</li>
          <li>Preciso fazer matrícula para começar?</li>
          <li>Existe limite de idade para participar?</li>
          <li>Posso fazer mais de um curso ao mesmo tempo?</li>
          <li>Os cursos oferecem certificado?</li>
        </ul>
      </div>

      <div className="mb-5">
        <h2>2. Certificação</h2>
        <ul>
          <li>Como faço para obter o certificado?</li>
          <li>Os certificados são reconhecidos pelo MEC?</li>
          <li>O certificado tem validade?</li>
          <li>Posso imprimir o certificado?</li>
        </ul>
      </div>

      <div className="mb-5">
        <h2>3. Acesso e Conta</h2>
        <ul>
          <li>Esqueci minha senha. O que devo fazer?</li>
          <li>Como alterar meu e-mail de cadastro?</li>
          <li>Como atualizar meus dados pessoais?</li>
          <li>Não consigo acessar minha conta. Como resolver?</li>
        </ul>
      </div>

      <div className="mb-5">
        <h2>4. Dúvidas Técnicas</h2>
        <ul>
          <li>Qual navegador devo usar?</li>
          <li>Posso acessar os cursos pelo celular?</li>
          <li>O vídeo não está carregando. O que fazer?</li>
          <li>Como melhorar o desempenho da plataforma?</li>
        </ul>
      </div>

      <div className="mb-5">
        <h2>5. Outros Assuntos</h2>
        <ul>
          <li>Como entrar em contato com o suporte?</li>
          <li>Posso indicar os cursos para outras pessoas?</li>
          <li>Há novos cursos disponíveis regularmente?</li>
        </ul>
      </div>
    </div>
  );
};

export default FAQ;
