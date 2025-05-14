import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const MenuEntidade = () => {
  return (
    <Container className="mt-5">
      <div className="d-flex align-items-center mb-4">
        <Link to="/gerenciamento/" className="btn btn-light me-3">
          <i className="bi bi-arrow-left"></i> Voltar
        </Link>
        <h1>Gerenciamento de Conteúdo</h1>
      </div>

      <Row className="g-4">
        {/* Card Categorias */}
        <Col md={3}>
          <Card className="h-100 shadow-sm border-primary">
            <Card.Body className="text-center">
              <i className="bi bi-tags fs-1 text-primary mb-3"></i>
              <Card.Title>Gerenciar Categorias</Card.Title>
              <Card.Text>
                Crie e organize categorias para classificar seus conteúdos
              </Card.Text>
              <Link 
                to="/gerenciamento/entidades/categorias" 
                className="btn btn-outline-primary"
              >
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Sites */}
        <Col md={3}>
          <Card className="h-100 shadow-sm border-success">
            <Card.Body className="text-center">
              <i className="bi bi-globe fs-1 text-success mb-3"></i>
              <Card.Title>Gerenciar Sites</Card.Title>
              <Card.Text>
                Adicione e organize sites recomendados para os usuários
              </Card.Text>
              <Link 
                to="/gerenciamento/entidades/sites" 
                className="btn btn-outline-success"
              >
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Cursos */}
        <Col md={3}>
          <Card className="h-100 shadow-sm border-warning">
            <Card.Body className="text-center">
              <i className="bi bi-book fs-1 text-warning mb-3"></i>
              <Card.Title>Gerenciar Cursos</Card.Title>
              <Card.Text>
                Administre os cursos disponíveis e seus conteúdos
              </Card.Text>
              <Link 
                to="/gerenciamento/entidades/cursos" 
                className="btn btn-outline-warning"
              >
                Acessar
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Softwares */}
        <Col md={3}>
          <Card className="h-100 shadow-sm border-info">
            <Card.Body className="text-center">
              <i className="bi bi-code-square fs-1 text-info mb-3"></i>
              <Card.Title>Gerenciar Softwares</Card.Title>
              <Card.Text>
                Controle os softwares recomendados e seus tutoriais
              </Card.Text>
              <Link 
                to="/gerenciamento/entidades/softwares" 
                className="btn btn-outline-info"
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

export default MenuEntidade;