import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import tutorialsData from '../data/tutoriaisTeste.json';

const GerenciarTutorial = () => {
    const [tituloTutorial, setTituloTutorial] = useState("");
    const [idSoftware, setIdSoftware] = useState("");
    const [conteudo, setConteudo] = useState(tutorialsData.tutoriais || []);

    const adicionarSecao = (tipo) => {
        const novaSecao = { tipo, texto: "" };
        if (tipo === "lista") {
            novaSecao.itens = [];
        }
        setConteudo([...conteudo, novaSecao]);
    };

    const atualizarTextoSecao = (index, novoTexto) => {
        const copiaConteudo = [...conteudo];
        copiaConteudo[index].texto = novoTexto;
        setConteudo(copiaConteudo);
    };

    const salvarTutorial = () => {
        const novoTutorial = {
            id: Math.floor(Math.random() * 1000),
            id_software: Number(idSoftware),
            titulo: tituloTutorial,
            conteudo
        };

        // Adiciona o novo tutorial ao JSON
        tutorialsData.tutoriais.push(novoTutorial);

        // Atualiza o arquivo JSON localmente
        const jsonString = JSON.stringify(tutorialsData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tutoriaisTeste.json";
        a.click();

        console.log("Tutorial salvo!", novoTutorial);
    };

    return (
        <div className="container mt-5">
            <h2>Gerenciar Tutorial</h2>

            <div className="mb-3">
                <label>ID do Software:</label>
                <input 
                    type="number" 
                    className="form-control" 
                    value={idSoftware} 
                    onChange={(e) => setIdSoftware(e.target.value)} 
                />
            </div>

            <div className="mb-3">
                <label>Título do Tutorial:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={tituloTutorial} 
                    onChange={(e) => setTituloTutorial(e.target.value)} 
                />
            </div>

            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={() => adicionarSecao("paragrafo")}>Adicionar Parágrafo</button>
                <button className="btn btn-secondary me-2" onClick={() => adicionarSecao("subtitulo")}>Adicionar Subtítulo</button>
                <button className="btn btn-warning" onClick={() => adicionarSecao("lista")}>Adicionar Lista</button>
            </div>

            {conteudo.map((secao, index) => (
                <div key={index} className="mb-3">
                    {secao.tipo === "lista" ? (
                        <>
                            <h4>Lista:</h4>
                            <input 
                                type="text" 
                                className="form-control mb-2" 
                                placeholder="Adicione itens separados por vírgula"
                                onChange={(e) => {
                                    const itens = e.target.value.split(",");
                                    const copiaConteudo = [...conteudo];
                                    copiaConteudo[index].itens = itens;
                                    setConteudo(copiaConteudo);
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <h4>{secao.tipo === "paragrafo" ? "Parágrafo:" : "Subtítulo:"}</h4>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={secao.texto} 
                                onChange={(e) => atualizarTextoSecao(index, e.target.value)}
                            />
                        </>
                    )}
                </div>
            ))}

            <button className="btn btn-success mt-3" onClick={salvarTutorial}>Salvar Tutorial</button>
        </div>
    );
};

export default GerenciarTutorial;
