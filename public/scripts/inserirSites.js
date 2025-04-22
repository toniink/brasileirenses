const urlSites = 'http://localhost:3000/sites';
const urlCategorias = 'http://localhost:3000/categorias';

// Função para buscar e listar os sites
async function buscarSites() {
    try {
        const resposta = await fetch(urlSites);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar sites: ${resposta.status}`);
        }

        const itens = await resposta.json();
        const tabela = document.getElementById('sitesLista'); // Alinha com o ID correto do HTML
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        itens.forEach((item) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${item.id_site}</td>
                <td>${item.nome}</td>
                <td>${item.descricao}</td>
                <td><a href="${item.url}" target="_blank">${item.url}</a></td>
                <td>${item.categoria || 'Sem Categoria'}</td>
                <td>
                    <button onclick="editarSites('${item.id_site}')">Editar</button>
                    <button onclick="excluirSites('${item.id_site}')">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao buscar sites:', error);
        alert('Erro ao carregar a lista de sites.');
    }
}

// Função para redirecionar para a página de edição de sites
function editarSites(id) {
    window.location.href = `editarSites.html?id=${id}`;
}

// Função para excluir um site
async function excluirSites(id) {
    try {
        const resposta = await fetch(`${urlSites}/${id}`, { method: 'DELETE' });
        if (!resposta.ok) {
            throw new Error(`Erro ao excluir site: ${resposta.status}`);
        }
        alert('Site excluído com sucesso!');
        buscarSites(); // Atualiza a lista após a exclusão
    } catch (error) {
        console.error('Erro ao excluir site:', error);
        alert('Erro ao excluir o site.');
    }
}

// Função para salvar ou atualizar um site
document.getElementById('sitesFormulario').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Captura os dados do formulário
    const nome_sites = document.getElementById('nome_sites').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const url = document.getElementById('url').value.trim();
    const categoria = document.getElementById('categoria').value;
    const id = document.getElementById('sitesID').value;

    // Validações no frontend
    if (!nome_sites || !descricao || !url || !categoria) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    const dados = {
        id_categoria: categoria, // Backend espera id_categoria
        nome: nome_sites,
        url,
        descricao,
    };

    try {
        let resposta;

        if (id) {
            // Atualizar site existente
            resposta = await fetch(`${urlSites}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
        } else {
            // Inserir novo site
            resposta = await fetch(urlSites, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
        }

        if (!resposta.ok) {
            const textoErro = await resposta.text();
            throw new Error(`Erro ao salvar site: ${resposta.status} - ${textoErro}`);
        }

        alert('Site salvo com sucesso!');
        document.getElementById('sitesFormulario').reset(); // Limpa o formulário
        buscarSites(); // Atualiza a lista
    } catch (error) {
        console.error('Erro ao salvar site:', error);
        alert('Erro ao salvar o site. Verifique os dados e tente novamente.');
    }
});

// Função para carregar categorias no select
async function carregarCategorias() {
    try {
        const resposta = await fetch(urlCategorias);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar categorias: ${resposta.status}`);
        }

        const categorias = await resposta.json();
        const selectCategoria = document.getElementById('categoria');

        // Limpa o select antes de adicionar as opções
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';

        categorias.forEach((categoria) => {
            const opcao = document.createElement('option');
            opcao.value = categoria.id_categorias; // Valor será o ID da categoria
            opcao.textContent = categoria.nome; // Nome da categoria
            selectCategoria.appendChild(opcao);
        });

        
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Erro ao carregar categorias.');
    }
}

// Listener do botão de voltar
document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Inicializar a página ao carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias(); // Carrega as categorias
    buscarSites(); // Carrega os sites
});
