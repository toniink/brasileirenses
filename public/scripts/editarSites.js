const urlSites = 'http://localhost:3000/sites';
const urlCategorias = 'http://localhost:3000/categorias';

// Função para carregar os dados do site pelo ID
async function carregarDadosSites() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('ID do site não encontrado na URL');
        alert('ID do site não encontrado na URL!');
        return;
    }

    try {
        const resposta = await fetch(`${urlSites}/${id}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar site: ${resposta.status}`);
        }
        const site = await resposta.json();

        // Preencher os campos do formulário com os dados retornados
        document.getElementById('sitesID').value = site.id_site;
        document.getElementById('nome_site').value = site.nome;
        document.getElementById('url_site').value = site.url;
        document.getElementById('descricao_site').value = site.descricao;

        // Selecionar a categoria correspondente
        const selectCategoria = document.getElementById('categoria');
        if (site.id_categoria) {
            selectCategoria.value = site.id_categoria;
        }
    } catch (error) {
        console.error('Erro ao carregar os dados do site:', error);
        alert('Erro ao carregar os dados do site.');
    }
}

// Função para carregar a lista de categorias no select
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
            selectCategoria.appendChild(opcao); // Adiciona ao select
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Erro ao carregar categorias.');
    }
}

// Função para salvar as alterações do site
document.getElementById('formEditarSites').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('sitesID').value;
    const nome_site = document.getElementById('nome_site').value.trim();
    const url_site = document.getElementById('url_site').value.trim();
    const descricao_site = document.getElementById('descricao_site').value.trim();
    const categoria = document.getElementById('categoria').value;

    // Validações no frontend
    if (!nome_site || !url_site || !descricao_site || !categoria) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    const dados = {
        id_categoria: categoria,
        nome: nome_site,
        url: url_site,
        descricao: descricao_site,
    };

    try {
        const resposta = await fetch(`${urlSites}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            const textoErro = await resposta.text();
            throw new Error(`Erro ao atualizar site: ${resposta.status} - ${textoErro}`);
        }

        alert('Site atualizado com sucesso!');
        window.location.href = '../consultaSites.html'; // Redirecionar para a página de consulta
    } catch (error) {
        console.error('Erro ao salvar as alterações do site:', error);
        alert('Erro ao salvar as alterações.');
    }
});

// Função para cancelar a edição e voltar para a página de consulta
function cancelarEdicao() {
    window.location.href = '../pages/consultaSites.html'; // Ajuste o caminho para a página de consulta geral de sites
}

// Inicializar eventos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias(); // Carrega a lista de categorias no select
    carregarDadosSites(); // Carrega os dados do site para edição
});

document.getElementById('botaoCancelar').addEventListener('click', cancelarEdicao);
