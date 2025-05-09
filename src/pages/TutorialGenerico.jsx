import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TutorialGenerico = () => {
    const { id } = useParams();
    const [tutorialData, setTutorialData] = useState(null);
    const [secoes, setSecoes] = useState([]);
    const [conteudos, setConteudos] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || isNaN(id)) {
            console.error("Erro crítico: ID do tutorial não foi passado corretamente.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:3000/tutoriais/${id}`)
            .then((res) => res.json())
            .then((data) => setTutorialData(data))
            .catch((error) => console.error("Erro ao buscar tutorial:", error))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!id || tutorialData === null) return;

        fetch(`http://localhost:3000/secoesTutorial/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setSecoes(data);
                buscarConteudosDasSecoes(data);
            })
            .catch((error) => console.error("Erro ao buscar seções do tutorial:", error));
    }, [id, tutorialData]);

    const buscarConteudosDasSecoes = (secoes) => {
        secoes.forEach((secao) => {
            fetch(`http://localhost:3000/conteudo/${secao.id_secao}`)
                .then((res) => res.json())
                .then((data) => {
                    setConteudos((prevState) => ({
                        ...prevState,
                        [secao.id_secao]: data,
                    }));
                })
                .catch((error) => console.error(`Erro ao buscar conteúdo da seção ${secao.id_secao}:`, error));
        });
    };

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <h1 className="text-primary">Carregando...</h1>
                <p className="text-muted">Aguarde enquanto recuperamos os detalhes do tutorial.</p>
            </div>
        );
    }

    if (!tutorialData) {
        return (
            <div className="container text-center mt-5">
                <h1 className="text-danger">Erro: Tutorial não encontrado</h1>
                <p className="text-muted">O tutorial que você está tentando acessar não existe ou foi removido.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <header className="bg-primary text-white py-4 text-center shadow">
                {/* Cabeçalho */}
        <header className="bg-light py-3">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Navegação no Header */}
                    <nav className="d-flex gap-3">
                        <Link to="/" className="btn btn-link">HOME</Link>
                        <Link to="/cursos" className="btn btn-link">CURSOS</Link>
                        <Link to="/softwares" className="btn btn-link">PROGRAMAS</Link>
                        <button className="btn btn-link">CATEGORIAS</button>
                        <button className="btn btn-link">CONTATO</button>
                    </nav>
                    {/* Botão de Login */}
                    <button className="btn btn-primary">Fazer Login</button>
                </div>
            </div>
        </header>
                <h2>{tutorialData.titulo}</h2>
            </header>

            <section className="container bg-light rounded shadow my-4 p-4">
                <p className="lead text-secondary">{tutorialData.descricao}</p>
            </section>

            <div className="container">
                {secoes.length > 0 ? (
                    secoes.map((secao, index) => (
                        <div key={index} className="mb-4 p-4 border rounded shadow">
                            <h3 className="text-primary">{secao.tipo === "titulo" ? "Título" : secao.tipo === "paragrafo" ? "Parágrafo" : secao.tipo === "lista" ? "Lista" : "Imagem"}</h3>

                            {conteudos[secao.id_secao] &&
                                conteudos[secao.id_secao].map((conteudo, i) => (
                                    <div key={i}>
                                        {secao.tipo === "titulo" && <h3 className="text-dark">{conteudo.texto}</h3>}
                                        {secao.tipo === "paragrafo" && <p className="text-secondary">{conteudo.texto}</p>}
                                        {secao.tipo === "lista" && (
                                            <ul className="list-group">
                                                {conteudo.texto.split(",").map((item, i) => (
                                                    <li key={i} className="list-group-item">{item.trim()}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {secao.tipo === "imagem" && (
                                            <div className="text-center my-3">
                                                <img src={conteudo.url} alt={conteudo.descricao} className="img-fluid rounded shadow" style={{ maxWidth: "80%" }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted mt-3">Nenhum conteúdo disponível para este tutorial.</p>
                )}
            </div>

            {tutorialData.imagem_url && (
                <div className="container text-center mt-4">
                    <a href={tutorialData.imagem_url} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary shadow">
                        Ir para o site oficial
                    </a>
                </div>
            )}
        </div>
    );
};

export default TutorialGenerico;
