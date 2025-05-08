import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SoftwareDetalhes = () => {
    const { id } = useParams(); // Captura o ID do software na URL
    const [software, setSoftware] = useState(null);
    const [tutorialId, setTutorialId] = useState(null);
    const navigate = useNavigate();

    // 🚀 Buscar detalhes do software
    useEffect(() => {
        fetch(`http://localhost:3000/softwares/${id}`)
            .then(res => res.json())
            .then(data => {
                if (!data) throw new Error(`Software não encontrado para ID ${id}`);
                setSoftware(data);
            })
            .catch(error => console.error(error.message));
    }, [id]);

    // 🚀 Buscar o ID do tutorial vinculado ao software
    useEffect(() => {
        fetch(`http://localhost:3000/tutoriais/software/${id}`) // 🔹 Confirme se esse endpoint existe no backend
            .then(res => res.json())
            .then(data => {
                if (data && data.id_tutorial) {
                    console.log(`Tutorial encontrado: ${data.id_tutorial}`); // 🚀 Log para depuração
                    setTutorialId(data.id_tutorial);
                } else {
                    console.error(`Nenhum tutorial encontrado para software ID ${id}`);
                    setTutorialId(null); // Define como null caso não encontre
                }
            })
            .catch(error => console.error("Erro ao buscar tutorial:", error));
    }, [id]);

    const handleRedirect = () => {
        if (tutorialId) {
            console.log(`Redirecionando para /tutorial/${tutorialId}`); // 🚀 Log antes de redirecionar
            navigate(`/tutorial/${tutorialId}`); // 🔹 Certifique-se de que corresponde ao `App.jsx`
        } else {
            alert("Nenhum tutorial associado a este software!");
        }
    };

    if (!software) {
        return (
            <div className="container text-center mt-5">
                <h1>Carregando dados...</h1>
                <p>Aguarde enquanto recuperamos os detalhes do software.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <header className="bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <nav className="d-flex gap-3">
                        <button className="btn btn-link">HOME</button>
                        <button className="btn btn-link">SOFTWARES</button>
                        <button className="btn btn-link">PROGRAMAS</button>
                        <button className="btn btn-link">CATEGORIAS</button>
                        <button className="btn btn-link">CONTATO</button>
                    </nav>
                    <button className="btn btn-primary">Fazer Login</button>
                </div>
            </header>

            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="bg-secondary text-white p-3 rounded">
                        <h5>{software.nome || 'Software não encontrado'}</h5>
                        <p>Desenvolvedor: {software.desenvolvedor || 'N/A'}</p>
                        <button className="btn btn-primary w-100 mt-3" onClick={() => window.open(software.site || '#', '_blank')}>
                            Ir para Download
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
                    <h4>Descrição do Software</h4>
                    <p>{software.descricao || 'Descrição não disponível.'}</p>
                    <hr className="border-secondary" />

                    <div className="mt-4">
                        <button 
                            className={`btn me-2 ${tutorialId ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={handleRedirect}
                            disabled={!tutorialId} // 🚀 Desabilita o botão se não houver tutorial
                        >
                            Ir para Tutorial de Instalação
                        </button>

                        <button className="btn btn-secondary" onClick={() => window.open(software.site || '#', '_blank')}>
                            Ir para Download
                        </button>
                    </div>
                </div>
            </div>

            <footer className="bg-primary text-light py-4 mt-4 text-center">
                <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
            </footer>
        </div>
    );
};

export default SoftwareDetalhes;
