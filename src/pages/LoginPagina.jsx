import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPagina = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    
    // Validação simples
    if (!email || !senha) {
      setErro('Preencha e-mail e senha!');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }), // Envia os dados em texto plano
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Salva o usuário no localStorage (opcional)
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Redireciona para a página inicial
      navigate('/');

    } catch (error) {
      setErro(error.message || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      {/* Cabeçalho (igual ao da Home) */}
      <header className="bg-light py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <nav className="d-flex gap-3">
              <Link to="/" className="btn btn-link">HOME</Link>
              <Link to="/cursos" className="btn btn-link">CURSOS</Link>
            </nav>
            <Link to="/cadastro" className="btn btn-outline-primary">Criar Conta</Link>
          </div>
        </div>
      </header>

      {/* Formulário de Login */}
      <main className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Faça seu Login</h2>
                
                {erro && <div className="alert alert-danger">{erro}</div>}
                
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={carregando}
                  >
                    {carregando ? 'Carregando...' : 'Entrar'}
                  </button>
                </form>
                
                <div className="text-center mt-3">
                  <Link to="/cadastro" className="text-primary">
                    Não tem conta? Cadastre-se
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (igual ao da Home) */}
      <footer className="bg-primary text-light py-4 mt-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center">
              <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPagina;