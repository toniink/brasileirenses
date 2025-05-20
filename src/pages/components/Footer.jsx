import React from 'react';
import './Footer.css';


function Footer() {
  return (
    <footer className="footer bg-dark text-white mt-auto py-3">
      <div className="container text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Todos os direitos reservados.
        </p>
        <small>Desenvolvido por brasileirenses</small>
      </div>
    </footer>
  );
}

export default Footer;
