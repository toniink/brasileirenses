import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAuthHeader, getCurrentUser } from '../../../api/auth';

const ComentariosCurso = () => {
  const { id } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [nota, setNota] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
    fetchComentarios();
  }, [id]);

  const fetchComentarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/avaliacoesComentarios?id_curso=${id}`,
        { headers: getAuthHeader() }
      );
      
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários');
      }
      
      const data = await response.json();
      
      // Verifica se é um array (resposta direta) ou objeto com propriedade data
      const comentariosData = Array.isArray(data) ? data : (data.data || []);
      setComentarios(comentariosData);
      
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      const response = await fetch(`${API_URL}/avaliacoesComentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          id_usuario: user.idUsuarios,
          id_curso: id, // Garantindo que o comentário está associado ao curso atual
          comentario: novoComentario,
          nota: nota
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }

      setNovoComentario('');
      await fetchComentarios(); // Recarrega os comentários após enviar
      
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      setError(err.message);
    }
  };

  return (
    <div className="mt-4 p-3 border rounded">
      <h4>Avaliações</h4>
      
      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={fetchComentarios}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
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
              <div className="alert alert-info">
                Nenhuma avaliação ainda para este curso
              </div>
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
        </>
      )}
    </div>
  );
};

export default ComentariosCurso;