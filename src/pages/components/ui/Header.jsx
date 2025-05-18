import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../../api/auth';
import LogoutButton from './LogoutButton';

const Header = () => {
  const user = getCurrentUser();

  return (
    <header className="bg-light py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Navegação no Header */}
          <nav className="d-flex gap-3">
            <Link to="/" className="btn btn-link">HOME</Link>
            <Link to="/cursos" className="btn btn-link">CURSOS</Link>
            <Link to="/softwares" className="btn btn-link">PROGRAMAS</Link>
            <Link to="/faq" className="btn btn-link">AJUDA</Link>
          </nav>
          
          {/* Botão condicional Login/Logout */}
          {user ? (
            <div className="d-flex align-items-center">
              <span className="me-2">Olá, {user.nome}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-white text-decoration-none">
              Fazer Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;