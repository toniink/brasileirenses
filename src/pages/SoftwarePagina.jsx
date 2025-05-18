import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Header from './components/ui/Header';

const SoftwarePagina = () => {
    const [softwares, setSoftwares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSoftwares = async () => {
            try {
                const response = await fetch('http://localhost:3000/softwares');
                
                if (!response.ok) {
                    throw new Error('Erro ao carregar dados');
                }

                const data = await response.json();
                
                // Garante que sempre será um array
                setSoftwares(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao buscar softwares:', err);
                setError(err.message);
                setSoftwares([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSoftwares();
    }, []);

    const handleSoftwareClick = (id) => {
        navigate(`/softwares/${id}`);
    };

    if (loading) {
        return (
            <div className="container text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Carregando softwares...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center my-5">
                <div className="alert alert-danger">
                    <h4>Erro ao carregar softwares</h4>
                    <p>{error}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Cabeçalho */}
            <Header />

            {/* Layout Principal */}
            <div className="row mt-4">
                {/* Coluna Lateral: Filtro */}
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>Filtro</h5>
                        <p>(Placeholder para filtros)</p>
                    </div>
                </div>

                {/* Conteúdo Principal: Softwares */}
                <div className="col-md-9">
                    <h2 className="mb-4">Softwares</h2>
                    
                    {softwares.length === 0 ? (
                        <div className="alert alert-info">
                            Nenhum software encontrado
                        </div>
                    ) : (
                        <div className="row">
                            {softwares.map(software => (
                                <div
                                    className="col-md-4 mb-4"
                                    key={software.id_softwares}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSoftwareClick(software.id_softwares)}>
                                    <div className="card h-100">
                                        <div className="bg-secondary" style={{ height: '150px' }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{software.nome || 'Nome não disponível'}</h5>
                                            <p className="card-text">{software.desenvolvedor || 'Desenvolvedor não informado'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <button className="btn btn-primary">Ver mais softwares</button>
                </div>
            </div>

            {/* Footer (mantido igual) */}
            <footer className="bg-primary text-light py-4 mt-4">
                {/* ... conteúdo do footer ... */}
            </footer>
        </div>
    );
};

export default SoftwarePagina;