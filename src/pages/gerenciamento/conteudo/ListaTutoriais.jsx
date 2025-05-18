import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Spinner, 
  Alert, 
  Button,
  Badge
} from 'react-bootstrap'
import { 
  Pencil, 
  Trash, 
  PlusCircle,
  ArrowClockwise
} from 'react-bootstrap-icons'

const TutoriaisLista = () => {
  const [tutoriais, setTutoriais] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Buscar tutoriais com conteúdo
  const fetchTutoriais = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch("http://localhost:3000/tutoriais/com-conteudo")
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro ao carregar tutoriais")
      }
      
      const data = await response.json()
      setTutoriais(data)
    } catch (err) {
      console.error("Erro ao buscar tutoriais:", err)
      setError(err.message || "Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  // Deletar tutorial de forma segura
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este tutorial?\nO software associado não será afetado.")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/tutoriais/safe/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao excluir tutorial")
      }

      fetchTutoriais() // Atualiza a lista
    } catch (error) {
      console.error("Erro ao excluir tutorial:", error)
     
    }
  }

  useEffect(() => {
    fetchTutoriais()
  }, [])

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando tutoriais...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          <Alert.Heading>Erro ao carregar tutoriais</Alert.Heading>
          <p>{error}</p>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={fetchTutoriais}
          >
            <ArrowClockwise className="me-2" />
            Tentar novamente
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="px-md-4 py-4">
      {/* Cabeçalho */}
      <Row className="align-items-center mb-4 g-3">
        <Col xs={12} md>
          <h2 className="mb-0">Gerenciar Tutoriais</h2>
        </Col>
        <Col xs={12} md="auto">
          <Button 
            as={Link} 
            to="/gerenciamento/conteudo/tutoriais/novo"
            variant="primary"
          >
            <PlusCircle className="me-2" />
            Adicionar Tutorial
          </Button>
        </Col>
      </Row>

      {/* Tabela de Tutoriais */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th style={{ width: '150px' }} className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tutoriais.length > 0 ? (
                  tutoriais.map((tutorial) => (
                    <tr key={tutorial.id_tutorial}>
                      <td>
                        <Badge bg="secondary">
                          #{tutorial.id_tutorial}
                        </Badge>
                      </td>
                      <td>
                        <strong>{tutorial.titulo}</strong>
                      </td>
                      <td>
                        {tutorial.descricao?.substring(0, 60)}
                        {tutorial.descricao?.length > 60 && '...'}
                      </td>
                      <td className="text-center">
                        <Button
                          as={Link}
                          to={`/gerenciamento/conteudo/tutoriais/editar/${tutorial.id_tutorial}`}
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(tutorial.id_tutorial)}
                          variant="outline-danger"
                          size="sm"
                          title="Excluir"
                        >
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Nenhum tutorial com conteúdo encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Rodapé */}
      <Row className="mt-4 pt-3 border-top text-muted small">
        <Col>
          Total: <strong>{tutoriais.length}</strong> tutoriais com conteúdo
        </Col>
        <Col className="text-end">
          Última atualização: {new Date().toLocaleString()}
        </Col>
      </Row>
    </Container>
  )
}

export default TutoriaisLista