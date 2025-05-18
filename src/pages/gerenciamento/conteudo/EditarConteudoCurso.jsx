import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Button, 
  Card, 
  Form, 
  Alert, 
  Spinner,
  ListGroup,
  Badge
} from 'react-bootstrap';
import { ArrowLeft, Save } from 'react-bootstrap-icons';

const EditarConteudoCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [secoes, setSecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modificacoes, setModificacoes] = useState(false);

  // Carregar dados do curso
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar dados do curso
        const [cursoRes, conteudoRes] = await Promise.all([
          fetch(`http://localhost:3000/cursos/${id}`),
          fetch(`http://localhost:3000/cursos/${id}/content`)
        ]);

        if (!cursoRes.ok) throw new Error("Curso não encontrado");
        if (!conteudoRes.ok) throw new Error("Erro ao buscar conteúdo");

        const cursoData = await cursoRes.json();
        const conteudoData = await conteudoRes.json();

        setCurso(cursoData);
        setSecoes(conteudoData);
        
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [id]);

  // Atualizar conteúdo
  const atualizarConteudo = (secaoIndex, conteudoIndex, campo, valor) => {
    const novasSecoes = [...secoes];
    novasSecoes[secaoIndex].conteudos[conteudoIndex][campo] = valor;
    setSecoes(novasSecoes);
    setModificacoes(true);
  };

  // Salvar alterações
  const salvarAlteracoes = async () => {
    try {
        setLoading(true);
        
        const response = await fetch(`http://localhost:3000/cursos/${id}/content`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secoes })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao salvar alterações');
        }

        const result = await response.json();
        setModificacoes(false);
        alert(result.message || 'Alterações salvas com sucesso!');
        
    } catch (err) {
        console.error("Erro ao salvar:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  // Renderizar conteúdo baseado no tipo
  const renderConteudo = (secao, secaoIndex) => {
    return secao.conteudos.map((conteudo, conteudoIndex) => {
      switch(secao.tipo) {
        case 'titulo':
        case 'paragrafo':
          return (
            <Form.Control
              key={conteudo.id}
              as={secao.tipo === 'paragrafo' ? 'textarea' : 'input'}
              rows={secao.tipo === 'paragrafo' ? 3 : undefined}
              value={conteudo.texto || ''}
              onChange={(e) => atualizarConteudo(secaoIndex, conteudoIndex, 'texto', e.target.value)}
              className="mb-3"
            />
          );
        
        case 'area_atuacao':
          return (
            <div key={conteudo.id} className="mb-3">
              <Form.Control
                type="text"
                value={conteudo.titulo || ''}
                onChange={(e) => atualizarConteudo(secaoIndex, conteudoIndex, 'titulo', e.target.value)}
                className="mb-2"
              />
              <Form.Control
                as="textarea"
                rows={3}
                value={conteudo.descricao || ''}
                onChange={(e) => atualizarConteudo(secaoIndex, conteudoIndex, 'descricao', e.target.value)}
              />
            </div>
          );
        
        case 'lista':
          return (
            <ListGroup.Item key={conteudo.id} className="d-flex align-items-center">
              <Form.Control
                type="text"
                value={conteudo.texto || ''}
                onChange={(e) => atualizarConteudo(secaoIndex, conteudoIndex, 'texto', e.target.value)}
              />
            </ListGroup.Item>
          );
        
        default:
          return null;
      }
    });
  };

  if (loading && !curso) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p>Carregando conteúdo do curso...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">
          <h4>Erro ao carregar conteúdo</h4>
          <p>{error}</p>
        </Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2" /> Voltar
        </Button>
        <h2>Editando: {curso?.nome_curso}</h2>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {secoes.map((secao, index) => (
        <Card key={secao.id_secao_curso} className="mb-4">
          <Card.Header className="d-flex align-items-center">
            <Badge bg="secondary" className="me-2">{secao.ordem}</Badge>
            <span className="text-capitalize fw-bold">{secao.tipo}</span>
          </Card.Header>
          <Card.Body>
            {secao.tipo === 'lista' ? (
              <ListGroup>
                {renderConteudo(secao, index)}
              </ListGroup>
            ) : (
              renderConteudo(secao, index)
            )}
          </Card.Body>
        </Card>
      ))}
      
      <div className="d-flex justify-content-end mt-4">
        <Button 
          variant="primary" 
          onClick={salvarAlteracoes}
          disabled={!modificacoes || loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="me-2" /> Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </Container>
  );
};

export default EditarConteudoCurso;