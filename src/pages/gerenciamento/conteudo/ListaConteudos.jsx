import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ListaConteudos = ({ tipo }) => {
    const [itens, setItens] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    // Mapeamento dos campos específicos para cada tipo
    const configPorTipo = {
        cursos: {
            idField: 'id_cursos',
            nomeField: 'nome_curso',
            endpoint: 'cursos'
        },
        softwares: {
            idField: 'id_softwares',
            nomeField: 'nome',
            endpoint: 'softwares'
        },
        tutoriais: {
            idField: 'id_tutorial',
            nomeField: 'titulo',
            endpoint: 'tutoriais'
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setCarregando(true);
            try {
                const config = configPorTipo[tipo];
                const response = await fetch(`http://localhost:3000/${config.endpoint}`);
                if (!response.ok) throw new Error("Erro ao buscar dados");
                const data = await response.json();
                setItens(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(`Erro ao buscar ${tipo}:`, error);
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        };
        fetchData();
    }, [tipo]);

    const handleExcluir = async (id) => {
        if (window.confirm("Confirmar exclusão?")) {
            try {
                const config = configPorTipo[tipo];
                await fetch(`http://localhost:3000/${config.endpoint}/${id}`, {
                    method: "DELETE"
                });
                setItens(itens.filter(item => item[config.idField] !== id));
            } catch (error) {
                console.error("Erro ao excluir:", error);
                setErro("Falha ao excluir item");
            }
        }
    };

    return (
        <div className="container-fluid px-4 py-4">
            {/* Cabeçalho */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    {tipo === 'cursos' && 'Gerenciar Cursos'}
                    {tipo === 'softwares' && 'Gerenciar Softwares'}
                    {tipo === 'tutoriais' && 'Gerenciar Tutoriais'}
                </h2>
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
                    {erro}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setErro(null)}
                    ></button>
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
                                        itens.map(item => {
                                            const config = configPorTipo[tipo];
                                            const itemId = item[config.idField];
                                            const itemNome = item[config.nomeField];
                                            
                                            return (
                                                <tr key={itemId}>
                                                    <td className="align-middle">{itemId}</td>
                                                    <td className="align-middle">
                                                        {itemNome}
                                                    </td>
                                                    <td className="text-center">
                                                        <Link 
                                                            to={`/gerenciamento/conteudo/${tipo}/editar-conteudo/${itemId}`}
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            title="Editar"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleExcluir(itemId)}
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Excluir"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-muted">
                                                Nenhum item encontrado
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

export default ListaConteudos;