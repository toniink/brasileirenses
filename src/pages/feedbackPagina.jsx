import React, { useEffect, useState } from 'react';

function FeedbackPagina() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    tipo_feedback: '',
    mensagem: '',
    email: ''
  });

  // Buscar feedbacks ao carregar a página
  useEffect(() => {
    fetch('http://localhost:3000/feedback') // Ajuste para o endpoint correto
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error('Erro ao carregar feedbacks:', err));
  }, []);

  // Lidar com mudanças no formulário
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enviar novo feedback
  const handleSubmit = e => {
    e.preventDefault();
    
    // Validação básica
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

  return (
    <div className="container mt-4">
      <h2>Feedbacks</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Tipo de Feedback</label>
          <select
            name="tipo_feedback"
            className="form-control"
            value={formData.tipo_feedback}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="elogio">Elogio</option>
            <option value="sugestao">Sugestão</option>
            <option value="reclamacao">Reclamação</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Mensagem</label>
          <textarea
            name="mensagem"
            className="form-control"
            value={formData.mensagem}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-primary">Enviar Feedback</button>
      </form>

      <h4>Lista de Feedbacks</h4>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Email</th>
            <th>Mensagem</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.id_feedback}>
              <td>{fb.id_feedback}</td>
              <td>{fb.tipo_feedback}</td>
              <td>{fb.email}</td>
              <td>{fb.mensagem || '-'}</td>
              <td>{new Date(fb.data_feedback).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackPagina;