import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciarSoftware = () => {
    const [softwares, setSoftwares] = useState([]);
    const [idSoftwareSelecionado, setIdSoftwareSelecionado] = useState("");
    const [conteudo, setConteudo] = useState([]);

    // 🚀 Buscar softwares disponíveis
    useEffect(() => {
        fetch("http://localhost:3000/softwares")
            .then((res) => res.json())
            .then((data) => setSoftwares(data))
            .catch((error) => console.error("Erro ao buscar softwares:", error));
    }, []);

    // 🚀 Adicionar uma seção ao software
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

    // 🚀 Enviar seções e conteúdos para o banco
    const salvarSoftware = async () => {
        if (!idSoftwareSelecionado) {
            console.error("Erro: Selecione um software!");
            return;
        }

        console.log("ID do Software Selecionado:", idSoftwareSelecionado); // 🚀 Debug para verificar se está correto

        // 🔹 Salvar as seções vinculadas ao software
        for (const secao of conteudo) {
            const secaoResponse = await fetch("http://localhost:3000/softwares/secoesSoftware", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_software: Number(idSoftwareSelecionado),
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
                    titulo: secao.tipo === "titulo" ? secao.texto : "",
                    descricao: secao.tipo === "area_atuacao" ? secao.texto : "",
                    item: secao.tipo === "lista" ? secao.texto : "",
                }),
            });
        }

        console.log("Software, seções e conteúdos salvos com sucesso!");
    };

    return (
        <div>
            {/* Cabeçalho */}
            <header className="bg-light py-3">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <nav className="d-flex gap-3">
                            <Link to="/" className="btn btn-link">HOME</Link>
                            <Link to="/softwares" className="btn btn-link">SOFTWARES</Link>
                            <Link to="/categorias" className="btn btn-link">CATEGORIAS</Link>
                            <button className="btn btn-link">CONTATO</button>
                        </nav>
                        <button className="btn btn-primary">Fazer Login</button>
                    </div>
                </div>
            </header>

            {/* Conteúdo */}
            <main className="container mt-4">
                <h2>Gerenciamento de Softwares</h2>

                {/* Seleção do Software */}
                <div className="mb-3">
                    <label>Selecione o Software:</label>
                    <select className="form-control" value={idSoftwareSelecionado} onChange={(e) => setIdSoftwareSelecionado(e.target.value)}>
                        <option value="">Selecione</option>
                        {softwares.map((software) => (
                            <option key={software.id_softwares} value={software.id_softwares}> {/* ✅ Adicionando a propriedade key */}
                                {software.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botões de Adicionar Seções */}
                <div className="mb-3">
                    <button className="btn btn-primary me-2" onClick={() => adicionarSecao("paragrafo")}>Adicionar Parágrafo</button>
                    <button className="btn btn-secondary me-2" onClick={() => adicionarSecao("titulo")}>Adicionar Título</button>
                    <button className="btn btn-warning me-2" onClick={() => adicionarSecao("lista")}>Adicionar Lista</button>
                    <button className="btn btn-info" onClick={() => adicionarSecao("area_atuacao")}>Adicionar Área de Atuação</button>
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
                                    onChange={(e) => atualizarConteudo(index, e.target.value)}
                                />
                            </>
                        ) : secao.tipo === "area_atuacao" ? (
                            <>
                                <h4>Área de Atuação:</h4>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Título da área"
                                    onChange={(e) => atualizarConteudo(index, e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="Descrição da área"
                                    onChange={(e) => atualizarConteudo(index, e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <h4>{secao.tipo === "paragrafo" ? "Parágrafo:" : "Título:"}</h4>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={secao.texto}
                                    onChange={(e) => atualizarConteudo(index, e.target.value)}
                                />
                            </>
                        )}
                    </div>
                ))}

                {/* Botão de Salvar Software */}
                <button className="btn btn-success mt-3" onClick={salvarSoftware}>Salvar Software</button>
            </main>

            {/* Footer */}
            <footer className="bg-primary text-light py-4 text-center">
                <p>&copy; 2025 - Desenvolvido por Brasilierenses</p>
            </footer>
        </div>
    );
};

export default GerenciarSoftware;