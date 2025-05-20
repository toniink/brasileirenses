import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../../api/auth';
import LogoutButton from './LogoutButton';
import '../../../styles.css';

const Header = () => {
  const user = getCurrentUser();

  return (
    <header className=" bg-light py-3 shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Navegação no Header */}
          <nav className="d-flex gap-3">
            <Link to="/" className="btn nav-link-custom">Página Inicial</Link>
            <Link to="/cursos" className="btn nav-link-custom">CURSOS</Link>
            <Link to="/softwares" className="btn nav-link-custom">PROGRAMAS</Link>
            <Link to="/faq" className="btn nav-link-custom">AJUDA</Link>
          </nav>
          
          {/* Botão condicional Login/Logout */}
          {user ? (
            <div className="d-flex align-items-center mx-2 ">
              <span className="me-2 ">Olá, {user.nome}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-white text-decoration-none shadow">
              Fazer Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;