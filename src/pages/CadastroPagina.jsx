import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

const CadastroPagina = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (response.ok) {
        navigate('/login'); // Redireciona para o Login após cadastro
      } else {
        setErro('Erro ao cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErro('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div>
      {/* Cabeçalho igual ao da Home */}
     <Header />

      {/* Formulário de Cadastro */}
      <main className="container mt-5 my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Crie sua Conta</h2>
                {erro && <div className="alert alert-danger">{erro}</div>}
                <form onSubmit={handleCadastro}>
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
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
                  <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                </form>
                <div className="text-center mt-3">
                  <Link to="/login" className="text-primary">Já tem conta? Faça Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer igual ao da Home */}
      <Footer/>
    </div>
  );
};

export default CadastroPagina;