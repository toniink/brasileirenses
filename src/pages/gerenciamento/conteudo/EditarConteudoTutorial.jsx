import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Button, 
  Card, 
  Form, 
  Alert, 
  Spinner, 
  Badge,
  Row,
  Col,
  Modal
} from 'react-bootstrap';
import { ArrowLeft, Save, X, Pencil } from 'react-bootstrap-icons';

const EditarConteudoTutorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [secoes, setSecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modificacoes, setModificacoes] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Carregar dados do tutorial
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do tutorial
        const tutorialRes = await fetch(`http://localhost:3000/tutoriais/${id}`);
        if (!tutorialRes.ok) throw new Error("Tutorial não encontrado");
        const tutorialData = await tutorialRes.json();
        setTutorial(tutorialData);
        
        // Buscar conteúdo completo
        const conteudoRes = await fetch(`http://localhost:3000/tutoriais/${id}/conteudo`);
        if (!conteudoRes.ok) throw new Error("Erro ao buscar conteúdo");
        
        const conteudoData = await conteudoRes.json();
        setSecoes(conteudoData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [id]);

  // Atualizar conteúdo localmente
  const atualizarConteudo = (id_secao, id_conteudo, campo, valor) => {
    setSecoes(prevSecoes => 
      prevSecoes.map(secao => {
        if (secao.id_secao === id_secao) {
          return {
            ...secao,
            conteudos: secao.conteudos.map(conteudo => {
              if (conteudo.id === id_conteudo) {
                return { ...conteudo, [campo]: valor };
              }
              return conteudo;
            })
          };
        }
        return secao;
      })
    );
    setModificacoes(true);
  };

  // Salvar todas as alterações no banco de dados
  const salvarAlteracoes = async () => {
    try {
      setLoading(true);
      
      // Para cada seção e cada conteúdo, enviar atualizações
      for (const secao of secoes) {
        for (const conteudo of secao.conteudos) {
          await fetch(
            `http://localhost:3000/tutoriais/${id}/secoes/${secao.id_secao}/conteudo/${secao.tipo}/${conteudo.id}`, 
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(conteudo)
            }
          );
        }
      }
      
      setShowConfirmModal(false);
      setModificacoes(false);
      alert('Alterações salvas com sucesso!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar campo de edição baseado no tipo de conteúdo
  const renderCampoEdicao = (secao, conteudo) => {
    switch(secao.tipo) {
      case 'titulo':
      case 'paragrafo':
        return (
          <Form.Control
            as={secao.tipo === 'paragrafo' ? 'textarea' : 'input'}
            rows={secao.tipo === 'paragrafo' ? 3 : undefined}
            value={conteudo.texto || ''}
            onChange={(e) => atualizarConteudo(secao.id_secao, conteudo.id, 'texto', e.target.value)}
          />
        );
        
      case 'imagem':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>URL da Imagem</Form.Label>
              <Form.Control
                type="text"
                value={conteudo.url || ''}
                onChange={(e) => atualizarConteudo(secao.id_secao, conteudo.id, 'url', e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                value={conteudo.descricao || ''}
                onChange={(e) => atualizarConteudo(secao.id_secao, conteudo.id, 'descricao', e.target.value)}
              />
            </Form.Group>
          </>
        );
        
      case 'lista':
        return (
          <Form.Control
            type="text"
            value={conteudo.texto || conteudo.item || ''}
            onChange={(e) => {
              atualizarConteudo(secao.id_secao, conteudo.id, 'texto', e.target.value);
              atualizarConteudo(secao.id_secao, conteudo.id, 'item', e.target.value);
            }}
          />
        );
        
      case 'passo':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Número do Passo</Form.Label>
              <Form.Control
                type="number"
                value={conteudo.numero || ''}
                onChange={(e) => atualizarConteudo(secao.id_secao, conteudo.id, 'numero', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instrução</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={conteudo.instrucao || ''}
                onChange={(e) => atualizarConteudo(secao.id_secao, conteudo.id, 'instrucao', e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>URL da Imagem (opcional)</Form.Label>
              <Form.Control
                type="text"
                value={conteudo.imagem || ''}
                onChange={(e) => atualizarConteudo(secao.id_secao, conteudo.id, 'imagem', e.target.value)}
              />
            </Form.Group>
          </>
        );
        
      default:
        return null;
    }
  };

  if (loading && !tutorial) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Carregando conteúdo do tutorial...</p>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2" /> Voltar
        </Button>
        <h2>Editando Tutorial: {tutorial?.titulo}</h2>
        <div></div> {/* Espaçador */}
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {secoes.map(secao => (
        <Card key={secao.id_secao} className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="secondary" className="me-2">{secao.ordem}</Badge>
              <span className="text-capitalize fw-bold">{secao.tipo}</span>
            </div>
          </Card.Header>
          
          <Card.Body>
            {secao.conteudos?.length === 0 ? (
              <Alert variant="info">Nenhum conteúdo nesta seção</Alert>
            ) : (
              secao.conteudos?.map(conteudo => (
                <div key={conteudo.id} className="mb-4 p-3 border rounded">
                  <Form>
                    {renderCampoEdicao(secao, conteudo)}
                  </Form>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      ))}
      
      {/* Rodapé com botões de ação */}
      <Row className="mt-4">
        <Col className="d-flex justify-content-between">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
            size="lg"
          >
            <X className="me-2" /> Cancelar
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => setShowConfirmModal(true)}
            disabled={!modificacoes || loading}
            size="lg"
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
        </Col>
      </Row>
      
      {/* Modal de confirmação */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Alterações</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja salvar todas as alterações realizadas?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={salvarAlteracoes}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditarConteudoTutorial;