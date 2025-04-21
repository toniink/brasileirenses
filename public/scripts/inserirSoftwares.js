document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("softwareForm");
    const tabela = document.getElementById("softwareLista");
    const categoriaSelect = document.getElementById("categoriaSelect");
    const siteSelect = document.getElementById("siteSelect");
    const softwareID = document.getElementById("softwareID");

    // Carregar categorias (usando a rota correta /categorias/lista-select)
    fetch("/categorias/lista-select")
        .then(res => res.json())
        .then(data => {
            data.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.nome;
                categoriaSelect.appendChild(option);
            });
        });

    // Carregar sites (pode ter uma rota /sites/lista-select também)
    fetch("/sites/lista-select")
        .then(res => res.json())
        .then(data => {
            data.forEach(site => {
                const option = document.createElement("option");
                option.value = site.id;
                option.textContent = site.nome;
                siteSelect.appendChild(option);
            });
        });

    // Listar softwares
    function carregarSoftwares() {
        fetch("/softwares")
            .then(res => res.json())
            .then(data => {
                tabela.innerHTML = "";
                data.forEach(soft => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${soft.id}</td>
                        <td>${soft.nome}</td>
                        <td>${soft.url || ''}</td>
                        <td>${soft.desenvolvedor || ''}</td>
                        <td>${soft.nome_categoria || ''}</td>
                        <td>${soft.nome_site || ''}</td>
                        <td>
                            <button onclick="editarSoftware(${soft.id})">Editar</button>
                            <button onclick="deletarSoftware(${soft.id})">Excluir</button>
                        </td>
                    `;
                    tabela.appendChild(tr);
                });
            });
    }

    carregarSoftwares();

    // Enviar formulário
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const novoSoftware = {
            nome: document.getElementById("nome").value,
            url: document.getElementById("url").value,
            desenvolvedor: document.getElementById("desenvolvedor").value,
            id_categoria: categoriaSelect.value,
            id_site: siteSelect.value
        };

        const id = softwareID.value;

        const url = id ? `/softwares/${id}` : "/softwares";
        const metodo = id ? "PUT" : "POST";

        fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoSoftware)
        }).then(() => {
            form.reset();
            softwareID.value = "";
            carregarSoftwares();
        });
    });

    // Editar software
    window.editarSoftware = function (id) {
        fetch(`/softwares/${id}`)
            .then(res => res.json())
            .then(data => {
                softwareID.value = data.id;
                document.getElementById("nome").value = data.nome;
                document.getElementById("url").value = data.url;
                document.getElementById("desenvolvedor").value = data.desenvolvedor;
                categoriaSelect.value = data.id_categoria;
                siteSelect.value = data.id_site;
            });
    };

    // Deletar software
    window.deletarSoftware = function (id) {
        if (confirm("Deseja realmente excluir este software?")) {
            fetch(`/softwares/${id}`, {
                method: "DELETE"
            }).then(() => {
                carregarSoftwares();
            });
        }
    };
});
