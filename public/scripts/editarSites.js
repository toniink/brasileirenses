const urlSites = 'http://localhost:3000/sites';

// Função para carregar os dados do site pelo ID
async function carregarDadosSites() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('ID do site não encontrado na URL');
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
        document.getElementById('categoria').value = site.categoria;
    } catch (error) {
        console.error('Erro ao carregar os dados do site:', error);
    }
}

// Função para salvar as alterações do site
document.getElementById('formEditarSites').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('sitesID').value;
    const nome_site = document.getElementById('nome_site').value;
    const url_site = document.getElementById('url_site').value;
    const descricao_site = document.getElementById('descricao_site').value;
    const categoria = document.getElementById('categoria').value;

    const dados = { nome_site, url_site, descricao_site, categoria };

    try {
        const resposta = await fetch(`${urlSites}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao atualizar site: ${resposta.status}`);
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
document.getElementById('botaoCancelar').addEventListener('click', cancelarEdicao);
carregarDadosSites();
