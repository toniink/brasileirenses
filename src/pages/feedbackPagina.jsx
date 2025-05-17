import React, { useEffect, useState } from 'react';
import './FeedbackPagina.css'; // (separar o CSS)

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
    <div className="container mt-4">
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


      <div className="mb-3">
  <label className="form-label">Como você avalia o site?</label>
  <div className="d-flex gap-3">
    <button
      type="button"
      className={`btn ${formData.tipo_feedback === 'otimo' ? 'btn-success' : 'btn-outline-success'}`}
      onClick={() => setFormData({ ...formData, tipo_feedback: 'otimo' })}
    >
      😊 Ótimo
    </button>

    <button
      type="button"
      className={`btn ${formData.tipo_feedback === 'razoavel' ? 'btn-warning' : 'btn-outline-warning'}`}
      onClick={() => setFormData({ ...formData, tipo_feedback: 'razoavel' })}
    >
      😐 Razoável
    </button>

    <button
      type="button"
      className={`btn ${formData.tipo_feedback === 'ruim' ? 'btn-danger' : 'btn-outline-danger'}`}
      onClick={() => setFormData({ ...formData, tipo_feedback: 'ruim' })}
    >
      🙁 Ruim
    </button>
  </div>
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


      <h4 className="mb-3">Feedbacks Recebidos</h4>

      {feedbacks.length === 0 ? (
        <p>Nenhum feedback ainda. Seja o primeiro!</p>
      ) : (
        <div className="row">
          {feedbacks.map((fb) => (
            <div className="col-md-6 mb-3" key={fb.id_feedback}>
              <div className={`card border-${getBadgeColor(fb.tipo_feedback)}`}>
                <div className="card-body">
                  <h5 className="card-title">
                    <span className={`badge bg-${getBadgeColor(fb.tipo_feedback)} me-2`}>
                      {fb.tipo_feedback.toUpperCase()}
                    </span>
                    {fb.email}
                  </h5>
                  <p className="card-text">{fb.mensagem || '(Sem mensagem)'}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    {new Date(fb.data_feedback).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackPagina;
