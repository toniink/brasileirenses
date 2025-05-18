// src/components/ComentariosCurso.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Adicionei Link para redirecionar
import { getAuthHeader, getCurrentUser } from '../../../api/auth';

const ComentariosCurso = () => {
  const { id } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [nota, setNota] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
    fetchComentarios();
  }, [id]);

  const fetchComentarios = async () => {
    try {
      const response = await fetch(
        `${API_URL}/avaliacoesComentarios?id_curso=${id}`,
        { headers: getAuthHeader() }
      );
      const data = await response.json();
      setComentarios(data);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const renderStars = (rating) => {
    return (
      <span>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            style={{
              color: star <= rating ? 'gold' : 'lightgray',
              fontSize: '1.2rem'
            }}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user || !nota) return;

    try {
      await fetch(`${API_URL}/avaliacoesComentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          id_usuario: user.idUsuarios,
          id_curso: id,
          comentario: novoComentario,
          nota: nota
        })
      });
      setNovoComentario('');
      fetchComentarios();
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <div className="mt-4 p-3 border rounded">
      <h4>Avaliações</h4>
      
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded">
          <div className="mb-3">
            <label className="form-label">Sua avaliação (1-5 estrelas)</label>
            <div className="d-flex align-items-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="form-check me-2">
                  <input
                    type="radio"
                    id={`nota-${n}`}
                    className="form-check-input"
                    name="nota"
                    value={n}
                    checked={nota === n}
                    onChange={() => setNota(n)}
                    required
                  />
                  <label htmlFor={`nota-${n}`} className="form-check-label">
                    {n}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Comentário (opcional)"
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar Avaliação
          </button>
        </form>
      ) : (
        <div className="alert alert-info mb-4">
          <Link to="/login" className="btn btn-link p-0 align-baseline">
            Faça login
          </Link> para deixar sua avaliação
        </div>
      )}

      <div className="mt-3">
        {comentarios.length === 0 ? (
          <p>Nenhuma avaliação ainda</p>
        ) : (
          comentarios.map((comentario) => (
            <div key={comentario.id_comentario} className="mb-3 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{comentario.nome_usuario || 'Anônimo'}</strong>
                <small className="text-muted">
                  {new Date(comentario.data_avaliacao).toLocaleDateString()}
                </small>
              </div>
              <div className="mb-2">
                {renderStars(comentario.nota)}
              </div>
              {comentario.comentario && (
                <p className="mb-0">{comentario.comentario}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComentariosCurso;