const urlCategorias = 'http://localhost:3000/categorias';

// Função para buscar e listar as categorias
async function buscarCategorias() {
    const resposta = await fetch(urlCategorias);
    const categorias = await resposta.json();

    const tabela = document.getElementById('categoriasLista');
    tabela.innerHTML = '';
    categorias.forEach((categoria) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${categoria.id_categorias}</td>
            <td>${categoria.nome}</td>
            <td>${categoria.descricao}</td>
            <td>
                <button onclick="editarCategoria('${categoria.id_categorias}')">Editar</button>
                <button onclick="excluirCategoria('${categoria.id_categorias}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para redirecionar para a página de edição
function editarCategoria(id) {
    window.location.href = `editarCategorias.html?id=${id}`;
}

// Função para excluir uma categoria
async function excluirCategoria(id) {
    await fetch(`${urlCategorias}/${id}`, { method: 'DELETE' });
    buscarCategorias();
}

// Função para inserir ou atualizar uma categoria
document.getElementById('categoriasFormulario').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('categoriasID').value;
    const nome = document.getElementById('nome_categoria').value;
    const descricao = document.getElementById('descricao_categoria').value;

    const dados = { nome, descricao };

    if (id) {
        // Atualizar
        await fetch(`${urlCategorias}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
    } else {
        // Inserir novo
        await fetch(urlCategorias, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
    }

    document.getElementById('categoriasFormulario').reset();
    buscarCategorias();
    
});
document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});
// Inicializar lista de categorias
buscarCategorias();
