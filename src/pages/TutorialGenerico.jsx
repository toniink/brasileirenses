import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import tutorials from '../data/tutoriais.json'; // Importa o JSON de tutoriais

const TutorialGenerico = () => {
    const { id } = useParams(); // Captura o ID do software na URL
    const [tutorialData, setTutorialData] = useState(null);

    useEffect(() => {
        if (!id || isNaN(id)) {
            console.error("Erro crítico: ID do software não foi passado corretamente.");
            return;
        }

        console.log(`Buscando tutorial no JSON para software ID: ${id}`);

        // 🚀 Busca diretamente o tutorial correto pelo ID
        const tutorial = tutorials.softwares.find(t => t.id === Number(id));

        if (!tutorial) {
            console.error(`Erro: Nenhum tutorial encontrado para software ID ${id}`);
        }

        setTutorialData(tutorial || null);
    }, [id]);

    if (!tutorialData) {
        return (
            <div className="container text-center mt-5">
                <h1>Erro: Tutorial não encontrado</h1>
                <p>O tutorial que você está tentando acessar não existe ou foi removido.</p>
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
                    {tutorialData.descricao.map((texto, index) => (
                        <p key={index}>{texto}</p>
                    ))}
                </div>
            </div>

            {tutorialData.passos && (
                <div className="container">
                    <h3>Passos para Instalação</h3>
                    {tutorialData.passos.map((passo, index) => (
                        <div key={index}>
                            <h4>{passo.titulo}</h4>
                            {passo.texto.map((linha, subIndex) => (
                                <p key={subIndex}>{linha}</p>
                            ))}
                        </div>
                    ))}
                </div>
            )}

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
