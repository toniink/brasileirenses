import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../../api/auth';
import LogoutButton from './LogoutButton';
import '../../../styles.css';

const Header = () => {
  const user = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850); // Breakpoint em 850px

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 850;
      setIsMobile(nowMobile);
      // Fecha o menu se mudar para desktop
      if (!nowMobile) setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-light py-3 shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo/Brand pode ser adicionado aqui */}
          
          {/* Botão Hamburguer - aparece apenas abaixo de 850px */}
          {isMobile ? (
            <button 
              className="navbar-toggler p-2 border-0" 
              type="button" 
              onClick={toggleMenu}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              <span 
                className="navbar-toggler-icon"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
                  width: '1.5em',
                  height: '1.5em',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
          ) : (
            /* Navegação Desktop - aparece acima de 850px */
            <nav className="d-flex gap-3">
              <Link to="/" className="btn nav-link-custom">Página Inicial</Link>
              <Link to="/cursos" className="btn nav-link-custom">CURSOS</Link>
              <Link to="/softwares" className="btn nav-link-custom">PROGRAMAS</Link>
              <Link to="/faq" className="btn nav-link-custom">AJUDA</Link>
            </nav>
          )}
          
          {/* Seção de Login/Logout (sempre alinhado à direita) */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="me-2">Olá, {user.nome}</span>
                <LogoutButton />
              </>
            ) : (
              <Link to="/login" className="btn btn-primary text-white text-decoration-none shadow">
                Fazer Login
              </Link>
            )}
          </div>
        </div>

        {/* Menu Mobile - aparece apenas abaixo de 850px quando aberto */}
        {isMobile && (
          <div className={`${isMenuOpen ? 'd-block' : 'd-none'} mt-3 animate__animated animate__fadeIn`}>
            <nav className="d-flex flex-column gap-2">
              <Link to="/" className="btn nav-link-custom w-100 text-start" onClick={toggleMenu}>Página Inicial</Link>
              <Link to="/cursos" className="btn nav-link-custom w-100 text-start" onClick={toggleMenu}>CURSOS</Link>
              <Link to="/softwares" className="btn nav-link-custom w-100 text-start" onClick={toggleMenu}>PROGRAMAS</Link>
              <Link to="/faq" className="btn nav-link-custom w-100 text-start" onClick={toggleMenu}>AJUDA</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;