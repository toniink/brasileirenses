const urlSites = 'http://localhost:3000/sites';

// Função para buscar e listar os sites
async function buscarSites() {
    const resposta = await fetch(urlSites);
    const itens = await resposta.json();

    const tabela = document.getElementById('sitesLista'); // Alinha com o ID correto do HTML
    tabela.innerHTML = ''; // Limpa a tabela antes de preencher
    itens.forEach((item) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.id_site}</td>
            <td>${item.nome}</td>
            <td>${item.descricao}</td>
            <td>${item.url}</td>
            <td>${item.categoria}</td>
            <td>
                <button onclick="editarSites('${item.id_site}')">Editar</button>
                <button onclick="excluirSites('${item.id_site}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para redirecionar para a página de edição de sites
function editarSites(id) {
    window.location.href = `editarSites.html?id=${id}`;
}

// Função para excluir um site
async function excluirSites(id) {
    await fetch(`${urlSites}/${id}`, { method: 'DELETE' });
    buscarSites(); // Atualiza a lista após a exclusão
}

// Função para salvar ou atualizar um site
document.getElementById('sitesFormulario').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const nome_sites = document.getElementById('nome_sites').value;
    const descricao = document.getElementById('descricao').value;
    const url = document.getElementById('url').value;
    const categoria = document.getElementById('categoria').value;
    const id = document.getElementById('sitesID').value;

    const dados = { nome_sites, descricao, url, categoria };

    if (id) {
        // Atualizar site
        await fetch(`${urlSites}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
    } else {
        // Inserir novo site
        await fetch(urlSites, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
    }
    document.getElementById('sitesFormulario').reset(); // Limpa o formulário
    buscarSites(); // Atualiza a lista
});

document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});
// Carregar os sites ao iniciar
buscarSites();
