import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TutorialMolde = () => (
  <div className="container-fluid">
    {/* Cabeçalho: Mantém a identidade visual do site */}
    <header className="bg-light py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <nav className="d-flex gap-3">
          <button className="btn btn-link">HOME</button>
          <button className="btn btn-link">SOFTWARES</button>
          <button className="btn btn-link">PROGRAMAS</button>
          <button className="btn btn-link">CATEGORIAS</button>
          <button className="btn btn-link">CONTATO</button>
        </nav>
        <button className="btn btn-primary">Fazer Login</button>
      </div>
    </header>

    {/* Seção: Sobre o Software */}
    <div className="bg-light py-4">
      <div className="container">
        <h2>Sobre o Software</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur euismod 
          nisl vel vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices 
          posuere cubilia curae.
        </p>
        <p>
          Nulla facilisi. Fusce nec arcu accumsan, aliquet quam id, tempus massa. 
          Morbi tristique lectus ac nisi euismod sollicitudin.
        </p>
      </div>
    </div>

    {/* Seção: Passo a Passo da Instalação */}
    <div className="bg-secondary text-white py-4">
      <div className="container">
        <h2>Como Instalar?</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum facilisis ante.</p>

        {/* Passo 1 */}
        <div className="mb-4">
          <h4>1. Acesse o Site Oficial</h4>
          <p>
            Visite o site oficial do software para baixar a versão correta.
          </p>
          <button className="btn btn-light mt-2">Ir para o site do software</button>
        </div>

        {/* Passo 2 */}
        <div className="mb-4">
          <h4>2. Escolha seu Sistema Operacional</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu turpis vel magna dictum egestas.</p>
        </div>

        {/* Passo 3 */}
        <div className="mb-4">
          <h4>3. Execute o Instalador</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {/* Passo 4 */}
        <div className="mb-4">
          <h4>4. Siga as Instruções</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {/* Passo 5 */}
        <div className="mb-4">
          <h4>5. Conclua a Instalação</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>

    {/* Footer: Mantém a consistência visual */}
    <footer className="bg-primary text-light py-4 mt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3 text-center">
            <h5>Contato</h5>
            <button className="btn btn-link text-light text-decoration-underline">Clique aqui</button>
          </div>
          <div className="col-md-3 text-center">
            <h5>Redes Sociais</h5>
            <p>Siga-nos!</p>
          </div>
          <div className="col-md-3 text-center">
            <h5>Dê sua Opinião</h5>
            <button className="btn btn-link text-light text-decoration-underline">Envie aqui</button>
          </div>
          <div className="col-md-3 text-center">
            <h5>Menu Rápido</h5>
            <ul className="list-unstyled">
              <li><button className="btn btn-link text-light text-decoration-underline">Página Principal</button></li>
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

export default TutorialMolde;
