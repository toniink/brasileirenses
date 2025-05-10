import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const ConteudoGerenciamento = () => {
  return (
    <Container className="mt-5">
      <div className="d-flex align-items-center mb-4">
        <Link to="/gerenciamento" className="btn btn-light me-3">
          <i className="bi bi-arrow-left"></i> Voltar
        </Link>
        <h1>Gerenciamento de Conteúdo</h1>
      </div>

      <Row className="g-4">
        {/* Card Cursos */}
        <Col md={4}>
          <Card className="h-100 shadow-sm border-primary">
            <Card.Body className="text-center">
              <i className="bi bi-book fs-1 text-primary mb-3"></i>
              <Card.Title>Conteúdo de Cursos</Card.Title>
              <Card.Text>
                Gerencie os materiais, módulos e lições dos cursos
              </Card.Text>
              <Link 
                to="/gerenciamento/conteudo/cursos" 
                className="btn btn-outline-primary"
              >
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Softwares */}
        <Col md={4}>
          <Card className="h-100 shadow-sm border-success">
            <Card.Body className="text-center">
              <i className="bi bi-code-square fs-1 text-success mb-3"></i>
              <Card.Title>Conteúdo de Softwares</Card.Title>
              <Card.Text>
                Gerencie tutoriais e guias de uso dos softwares
              </Card.Text>
              <Link 
                to="/gerenciamento/conteudo/softwares" 
                className="btn btn-outline-success"
              >
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Tutoriais */}
        <Col md={4}>
          <Card className="h-100 shadow-sm border-warning">
            <Card.Body className="text-center">
              <i className="bi bi-gear fs-1 text-warning mb-3"></i>
              <Card.Title>Conteúdo de Tutoriais</Card.Title>
              <Card.Text>
                Gerencie os passos e materiais dos tutoriais
              </Card.Text>
              <Link 
                to="/gerenciamento/conteudo/tutoriais" 
                className="btn btn-outline-warning"
              >
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConteudoGerenciamento;