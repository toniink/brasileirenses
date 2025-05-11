import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditarSoftware = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [software, setSoftware] = useState({
        nome: "",
        url: "",
        desenvolvedor: "",
        id_categoria: "",
        id_site: ""
    });
    const [categorias, setCategorias] = useState([]);
    const [sites, setSites] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // 🚀 Buscar dados do software e opções
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCarregando(true);
                setErro(null);
                
                // Buscar categorias e sites primeiro
                const [categoriasRes, sitesRes] = await Promise.all([
                    fetch("http://localhost:3000/categorias"),
                    fetch("http://localhost:3000/sites")
                ]);
                
                if (!categoriasRes.ok) throw new Error("Erro ao buscar categorias");
                if (!sitesRes.ok) throw new Error("Erro ao buscar sites");
                
                const [categoriasData, sitesData] = await Promise.all([
                    categoriasRes.json(),
                    sitesRes.json()
                ]);
                
                setCategorias(categoriasData);
                setSites(sitesData);
                
                // Buscar dados do software específico
                const softwareRes = await fetch(`http://localhost:3000/softwares/${id}`);
                if (!softwareRes.ok) throw new Error("Software não encontrado");
                
                const softwareData = await softwareRes.json();
                setSoftware({
                    nome: softwareData.nome || "",
                    url: softwareData.url || "",
                    desenvolvedor: softwareData.desenvolvedor || "",
                    id_categoria: softwareData.id_categoria || "",
                    id_site: softwareData.id_site || ""
                });
                
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        };
        
        fetchData();
    }, [id]);

    // 🚀 Atualizar estado do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSoftware(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🚀 Enviar atualização
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setCarregando(true);
            setErro(null);
            
            const response = await fetch(`http://localhost:3000/softwares/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(software)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar software");
            }
            
            alert("Software atualizado com sucesso!");
            navigate(`/softwares/${id}`);
            
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    // 🚀 Renderização condicional
    if (carregando && !software.nome) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Carregando dados do software...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">
                    <h4>Erro ao carregar software</h4>
                    <p>{erro}</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Editar Software</h2>
                        </div>
                        
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Campo Nome */}
                                <div className="mb-3">
                                    <label htmlFor="nome" className="form-label">
                                        Nome do Software *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        name="nome"
                                        value={software.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                {/* Campo URL */}
                                <div className="mb-3">
                                    <label htmlFor="url" className="form-label">
                                        URL Oficial
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="url"
                                        name="url"
                                        value={software.url}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                {/* Campo Desenvolvedor */}
                                <div className="mb-3">
                                    <label htmlFor="desenvolvedor" className="form-label">
                                        Desenvolvedor
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="desenvolvedor"
                                        name="desenvolvedor"
                                        value={software.desenvolvedor}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                {/* Campo Categoria */}
                                <div className="mb-3">
                                    <label htmlFor="id_categoria" className="form-label">
                                        Categoria
                                    </label>
                                    <select
                                        className="form-select"
                                        id="id_categoria"
                                        name="id_categoria"
                                        value={software.id_categoria || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria.id_categorias} value={categoria.id_categorias}>
                                                {categoria.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Campo Site */}
                                <div className="mb-3">
                                    <label htmlFor="id_site" className="form-label">
                                        Site Relacionado
                                    </label>
                                    <select
                                        className="form-select"
                                        id="id_site"
                                        name="id_site"
                                        value={software.id_site || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione um site</option>
                                        {sites.map(site => (
                                            <option key={site.id_site} value={site.id_site}>
                                                {site.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Botões de Ação */}
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate(-1)}
                                        disabled={carregando}
                                    >
                                        Cancelar
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={carregando}
                                    >
                                        {carregando ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Salvando...
                                            </>
                                        ) : (
                                            "Salvar Alterações"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarSoftware;