import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/ui/Header';

const LoginPagina = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, senha);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      
      let mensagemErro = 'Erro no login';
      if (error.message.includes('404')) {
        mensagemErro = 'Servidor não encontrado - verifique a URL da API';
      } else if (error.message.includes('Credenciais inválidas')) {
        mensagemErro = 'E-mail ou senha incorretos';
      } else if (error.message) {
        mensagemErro = error.message;
      }
      
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <Header/>

      {/* Formulário de Login */}
      <main className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Faça seu Login</h2>
                
                {erro && (
                  <div className="alert alert-danger">
                    {erro}
                  </div>
                )}
                
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
                      disabled={carregando}
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
                      disabled={carregando}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2"
                    disabled={carregando}
                  >
                    {carregando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Carregando...
                      </>
                    ) : 'Entrar'}
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

      {/* Rodapé */}
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