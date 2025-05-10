import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarTutorial = () => {
    const [softwares, setSoftwares] = useState([]);
    const [tutoriais, setTutoriais] = useState([]);
    const [tituloTutorial, setTituloTutorial] = useState("");
    const [descricaoTutorial] = useState("");
    const [idSoftwareSelecionado, setIdSoftwareSelecionado] = useState("");
    const [idTutorialSelecionado, setIdTutorialSelecionado] = useState("");

    const [conteudo, setConteudo] = useState([]);

    // 🚀 Buscar softwares disponíveis
    useEffect(() => {
        fetch("http://localhost:3000/softwares")
            .then((res) => res.json())
            .then((data) => setSoftwares(data))
            .catch((error) => console.error("Erro ao buscar softwares:", error));
    }, []);

    // 🚀 Buscar tutoriais disponíveis
    useEffect(() => {
        fetch("http://localhost:3000/tutoriais")
            .then((res) => res.json())
            .then((data) => setTutoriais(data))
            .catch((error) => console.error("Erro ao buscar tutoriais:", error));
    }, []);

    // 🚀 Adicionar uma seção ao tutorial
    const adicionarSecao = (tipo) => {
        const novaSecao = { tipo, ordem: conteudo.length + 1, texto: "", itens: tipo === "lista" ? [] : null };
        setConteudo([...conteudo, novaSecao]);
    };

    // 🚀 Atualizar o conteúdo das seções
    const atualizarConteudo = (index, novoTexto) => {
        const copiaConteudo = [...conteudo];
        copiaConteudo[index].texto = novoTexto;
        setConteudo(copiaConteudo);
    };

    // 🚀 Enviar tutorial e associar ao software
    const salvarTutorial = async () => {
        if (!tituloTutorial.trim() || !idSoftwareSelecionado) {
            console.error("Erro: Todos os campos devem ser preenchidos!");
            return;
        }
        
        console.log("ID do Software Selecionado:", idSoftwareSelecionado); // 🚀 Debug para verificar se está correto
        

        // 🔹 Criar tutorial no banco
        const tutorialResponse = await fetch("http://localhost:3000/tutoriais", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_software: Number(idSoftwareSelecionado), // 🚀 Agora sempre enviamos um número válido!
                titulo: tituloTutorial,
                descricao: descricaoTutorial,
                imagem_url: "",
            }),
        });
        

        const tutorialData = await tutorialResponse.json();
        if (!tutorialData.id_tutorial) {
            console.error("Erro ao criar tutorial!");
            return;
        }

        const tutorialId = tutorialData.id_tutorial;

        // 🔹 Vincular tutorial ao software
        const vinculoResponse = await fetch("http://localhost:3000/tutoriais/associar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_software: Number(idSoftwareSelecionado),
                id_tutorial: tutorialId,
            }),
        });

        if (!vinculoResponse.ok) {
            console.error("Erro ao vincular tutorial ao software!");
            return;
        }

        console.log("Tutorial vinculado ao software com sucesso!");

        // 🔹 Salvar as seções vinculadas ao tutorial
        for (const secao of conteudo) {
            const secaoResponse = await fetch("http://localhost:3000/secoesTutorial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_tutorial: tutorialId,
                    tipo: secao.tipo,
                    ordem: secao.ordem,
                }),
            });

            const secaoData = await secaoResponse.json();
            if (!secaoData.id_secao) {
                console.error("Erro ao criar seção!");
                continue;
            }

            const secaoId = secaoData.id_secao;

            // 🔹 Salvar conteúdos vinculados à seção
            await fetch("http://localhost:3000/conteudo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_secao: secaoId,
                    tipo: secao.tipo,
                    texto: secao.texto,
                    url: secao.tipo === "imagem" ? secao.texto : "",
                    descricao: secao.tipo === "imagem" ? "Imagem do tutorial" : "",
                }),
            });
        }

        console.log("Tutorial, seções e conteúdos salvos com sucesso!");
    };

    return (
        <div>
            {/* Cabeçalho */}
            <header className="bg-light py-3">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <nav className="d-flex gap-3">
                            <Link to="/" className="btn btn-link">HOME</Link>
                            <Link to="/cursos" className="btn btn-link">CURSOS</Link>
                            <Link to="/softwares" className="btn btn-link">PROGRAMAS</Link>
                            <button className="btn btn-link">CATEGORIAS</button>
                            <button className="btn btn-link">CONTATO</button>
                        </nav>
                        <button className="btn btn-primary">Fazer Login</button>
                    </div>
                </div>
            </header>

            {/* Conteúdo */}
            <main className="container mt-4">
                <h2>Gerenciamento de Tutoriais</h2>

                {/* Seleção do Software */}
                <div className="mb-3">
                    <label>Selecione o Software:</label>
                    <select className="form-control" value={idSoftwareSelecionado} onChange={(e) => setIdSoftwareSelecionado(e.target.value)}>
                        <option value="">Selecione</option>
                        {softwares.map((software) => (
                            <option key={software.id_softwares} value={software.id_softwares}>
                                {software.nome}
                            </option>
                        ))}
                    </select>
                </div>
                    {/* Seleção do Tutorial */}
<div className="mb-3">
    <label>Selecione o Tutorial:</label>
    <select className="form-control" value={idTutorialSelecionado} onChange={(e) => setIdTutorialSelecionado(e.target.value)}>
        <option value="">Selecione</option>
        {tutoriais.length > 0 ? (
            tutoriais.map((tutorial) => (
                <option key={tutorial.id_tutorial} value={tutorial.id_tutorial}>
                    {tutorial.titulo}
                </option>
            ))
        ) : (
            <option disabled>Nenhum tutorial encontrado</option>
        )}
    </select>
</div>



                
                {/* Campo de Título do Tutorial */}
                <div className="mb-3">
                    <label>Título do Tutorial:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={tituloTutorial} 
                        onChange={(e) => setTituloTutorial(e.target.value)} 
                        placeholder="Digite o título do tutorial"
                    />
                </div>

                {/* Botões de Adicionar Seções */}
                <div className="mb-3">
                    <button className="btn btn-primary me-2" onClick={() => adicionarSecao("paragrafo")}>Adicionar Parágrafo</button>
                    <button className="btn btn-secondary me-2" onClick={() => adicionarSecao("titulo")}>Adicionar Título</button>
                    <button className="btn btn-warning me-2" onClick={() => adicionarSecao("lista")}>Adicionar Lista</button>
                    <button className="btn btn-info" onClick={() => adicionarSecao("imagem")}>Adicionar Imagem</button>
                </div>
{/* Inputs Dinâmicos para Conteúdo */}
{conteudo.map((secao, index) => (
    <div key={index} className="mb-3">
        {secao.tipo === "lista" ? (
            <>
                <h4>Lista:</h4>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Adicione itens separados por vírgula"
                    onChange={(e) => atualizarConteudo(index, e.target.value)} // 🚀 Agora chama `atualizarConteudo`
                />
            </>
        ) : (
            <>
                <h4>{secao.tipo === "paragrafo" ? "Parágrafo:" : secao.tipo === "titulo" ? "Título:" : "Imagem URL:"}</h4>
                <input
                    type="text"
                    className="form-control"
                    value={secao.texto}
                    onChange={(e) => atualizarConteudo(index, e.target.value)} // 🚀 Agora chama `atualizarConteudo`
                />
            </>
        )}
    </div>
))}
                {/* Botão de Salvar Tutorial */}
                <button className="btn btn-success mt-3" onClick={salvarTutorial}>Salvar Tutorial</button>
            </main>

            {/* Footer */}
            <footer className="bg-primary text-light py-4 text-center">
                <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
            </footer>
        </div>
    );
};

export default GerenciarTutorial;
