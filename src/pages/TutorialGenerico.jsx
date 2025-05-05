import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import tutorials from '../data/tutoriais.json';

const TutorialGenerico = () => {
    const { id } = useParams(); // ID do software vindo do banco

    const [tutorialId, setTutorialId] = useState(null);
    const [tutorialData, setTutorialData] = useState(null);

    // Busca a identificação do tutorial no banco de dados
    useEffect(() => {
        fetch(`http://localhost:3000/tutoriais/${id}`)
            .then(response => response.json())
            .then(data => setTutorialId(data.id_tutorial)) // Obtém ID do tutorial
            .catch(error => console.error('Erro ao buscar tutorial no banco:', error));
    }, [id]);

    // Após obter a identificação, busca o conteúdo do tutorial no JSON
    useEffect(() => {
        if (tutorialId) {
            const tutorial = tutorials.softwares.find(t => t.id === tutorialId);
            setTutorialData(tutorial || null);
        }
    }, [tutorialId]);

    if (!tutorialData) {
        return (
            <div className="container text-center mt-5">
                <h1>Erro: Tutorial não encontrado</h1>
                <p>O tutorial que você está tentando acessar não existe.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <header className="bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <h2>{tutorialData.titulo}</h2>
                </div>
            </header>

            <div className="bg-light py-4">
                <div className="container">
                    {tutorialData.descricao.map(texto => (
                        <p key={texto.substring(0, 10)}>{texto}</p>
                    ))}
                </div>
            </div>

            {tutorialData.site && (
                <div className="container text-center mt-3">
                    <a href={tutorialData.site} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Ir para o site do software
                    </a>
                </div>
            )}
        </div>
    );
};

export default TutorialGenerico;
