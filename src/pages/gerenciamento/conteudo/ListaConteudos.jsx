import React, { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";

// Estado inicial e reducer para gerenciamento de estado
const initialState = {
  itens: [],
  carregando: false,
  erro: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, carregando: true, erro: null };
    case 'FETCH_SUCCESS':
      return { ...state, carregando: false, itens: action.payload };
    case 'FETCH_ERROR':
      return { ...state, carregando: false, erro: action.payload };
    case 'DELETE_ITEM':
      return { 
        ...state, 
        itens: state.itens.filter(item => item[action.config.idField] !== action.id) 
      };
    default:
      return state;
  }
}

// Configurações por tipo
const configPorTipo = {
  cursos: {
    idField: 'id_cursos',
    nomeField: 'nome_curso',
    endpoint: 'cursos',
    titulo: 'Gerenciar Cursos'
  },
  softwares: {
    idField: 'id_softwares',
    nomeField: 'nome',
    endpoint: 'softwares',
    titulo: 'Gerenciar Softwares'
  },
  tutoriais: {
    idField: 'id_tutorial',
    nomeField: 'titulo',
    endpoint: 'tutoriais',
    titulo: 'Gerenciar Tutoriais'
  }
};

const ListaConteudos = ({ tipo }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { itens, carregando, erro } = state;
  const config = configPorTipo[tipo];

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
  dispatch({ type: 'FETCH_START' });
  
  try {
    console.log(`Buscando dados de ${config.endpoint}/com-conteudo`);
    const response = await fetch(`http://localhost:3000/${config.endpoint}/com-conteudo`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta do servidor:', errorText);
      throw new Error(`Erro ${response.status}: ${response.statusText || 'Resposta inválida do servidor'}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data);
    
    if (!Array.isArray(data)) {
      throw new Error('Formato de dados inválido recebido do servidor');
    }
    
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (error) {
    console.error(`Erro ao buscar ${tipo}:`, error);
    dispatch({ 
      type: 'FETCH_ERROR', 
      payload: error.message || "Erro ao conectar com o servidor"
    });
  }
};
    
    fetchData();
  }, [tipo, config.endpoint]);

  // Excluir item
  const handleExcluir = async (id) => {
    if (!window.confirm(`Confirmar exclusão do ${tipo} com ID ${id}?`)) return;

    try {
      const response = await fetch(`http://localhost:3000/${config.endpoint}/${id}/conteudo`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao excluir item');
      }

      dispatch({ type: 'DELETE_ITEM', id, config });
    } catch (error) {
      console.error("Erro ao excluir:", error);
      dispatch({ type: 'FETCH_ERROR', payload: error.message || "Falha ao excluir item" });
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{config.titulo}</h2>
        <Link 
          to={`/gerenciamento/conteudo/${tipo}/novo`} 
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Adicionar Novo
        </Link>
      </div>

      {/* Mensagem de Erro */}
      {erro && (
        <div className="alert alert-danger alert-dismissible fade show">
          <strong>Erro:</strong> {erro}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => dispatch({ type: 'FETCH_ERROR', payload: null })}
            aria-label="Fechar"
          ></button>
          <div className="mt-2 small">
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Container da Tabela */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {carregando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando dados...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th width="80">ID</th>
                    <th>Nome</th>
                    <th width="150" className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.length > 0 ? (
                    itens.map(item => (
                      <tr key={item[config.idField]}>
                        <td className="align-middle">{item[config.idField]}</td>
                        <td className="align-middle">{item[config.nomeField]}</td>
                        <td className="text-center">
                          <Link 
                            to={`/gerenciamento/conteudo/${tipo}/editar-conteudo/${item[config.idField]}`}
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleExcluir(item[config.idField])}
                            className="btn btn-sm btn-outline-danger"
                            title="Excluir"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        {erro ? "Erro ao carregar dados" : "Nenhum item encontrado"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé da Página */}
      <div className="mt-4 pt-3 border-top text-muted small">
        <div className="d-flex justify-content-between">
          <div>
            Total: <strong>{itens.length}</strong> itens
          </div>
          <div>
            Última atualização: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Validação de propriedades
ListaConteudos.propTypes = {
  tipo: PropTypes.oneOf(['cursos', 'softwares', 'tutoriais']).isRequired
};

export default ListaConteudos;