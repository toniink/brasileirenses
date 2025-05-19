import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './FeedbackPagina.css'; // (separar o CSS)
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

function FeedbackPagina() {


  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    tipo_feedback: '',
    mensagem: '',
    email: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error('Erro ao carregar feedbacks:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.tipo_feedback || !formData.email) {
      alert('Tipo de feedback e email são obrigatórios!');
      return;
    }

    fetch('http://localhost:3000/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(newFeedback => {
        setFeedbacks(prev => [newFeedback, ...prev]);
        setFormData({ tipo_feedback: '', mensagem: '', email: '' });
      })
      .catch(err => console.error('Erro ao enviar feedback:', err));
  };

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'elogio': return 'success';
      case 'sugestao': return 'warning';
      case 'reclamacao': return 'danger';
      default: return 'secondary';
    }
  };


  return (
    <div>
      <Header />
    
      <div className="container mt-4">

      <Link to="/" className="btn btn-light me-3">
          <i className="bi bi-arrow-left"></i> Voltar para página principal

        </Link>

        <h2 className="text-center mb-4">Deixe seu Feedback</h2>

        <div className="card p-4 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Seu Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo</label>
              <select
                name="tipo_feedback"
                className="form-select"
                value={formData.tipo_feedback}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="elogio">💚 Elogio</option>
                <option value="sugestao">💡 Sugestão</option>
                <option value="reclamacao">⚠ Reclamação</option>
              </select>
            </div>





            <div className="mb-3 mt-4">
              <label className="form-label">Comentário</label>
              <textarea
                className="form-control"
                rows="4"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Deixe aqui sua sugestão ou observação"
              ></textarea>
            </div>

            <div className="text-center">
              <button className="btn btn-primary" type="submit">Enviar</button>
            </div>
          </form>
        </div>

      </div>

      <Footer/>

    </div>
  );
}

export default FeedbackPagina;
