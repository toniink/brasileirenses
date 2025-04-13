const urlCategorias = 'http://localhost:3000/categorias';

async function carregarDadosCategoria() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('ID da categoria não encontrado na URL');
        return;
    }

    try {
        const resposta = await fetch(`${urlCategorias}/${id}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar categoria: ${resposta.status}`);
        }
        const categoria = await resposta.json();

        document.getElementById('categoriasID').value = categoria.id_categorias;
        document.getElementById('nome_categoria').value = categoria.nome;
        document.getElementById('descricao_categoria').value = categoria.descricao;
    } catch (error) {
        console.error('Erro ao carregar dados da categoria:', error);
    }
}

document.getElementById('formEditarCategorias').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('categoriasID').value;
    const nome = document.getElementById('nome_categoria').value;
    const descricao = document.getElementById('descricao_categoria').value;

    const dados = { nome, descricao };

    try {
        const resposta = await fetch(`${urlCategorias}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao atualizar categoria: ${resposta.status}`);
        }

        alert('Categoria atualizada com sucesso!');
        window.location.href = '../consultaCategorias.html';
    } catch (error) {
        console.error('Erro ao salvar alterações da categoria:', error);
    }
});

document.getElementById('botaoCancelar').addEventListener('click', () => {
    window.location.href = '../pages/consultaCategorias.html';
});

carregarDadosCategoria();
