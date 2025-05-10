import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const DashboardGerenciamento = () => {
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Painel de Gerenciamento</h1>
      
      <Row className="g-4">
        {/* Card Gerenciamento de Objetos */}
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Body className="text-center">
              <Card.Title>
                <i className="bi bi-box-seam fs-1 text-primary"></i>
              </Card.Title>
              <Card.Title>Gerenciamento de Objetos</Card.Title>
              <Card.Text>
                Cadastro de entidades principais (cursos, softwares, etc)
              </Card.Text>
              <Link to="/gerenciamento/objetos" className="btn btn-primary">
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Gerenciamento de Conteúdo */}
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Body className="text-center">
              <Card.Title>
                <i className="bi bi-file-earmark-text fs-1 text-success"></i>
              </Card.Title>
              <Card.Title>Gerenciamento de Conteúdo</Card.Title>
              <Card.Text>
                Edição dos conteúdos associados aos objetos
              </Card.Text>
              <Link to="/gerenciamento/conteudo" className="btn btn-success">
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardGerenciamento;