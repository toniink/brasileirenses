const urlCategoriasCursos = 'http://localhost:3000/categoriasCursos'; // API para gerenciar categorias do curso
const urlCategorias = 'http://localhost:3000/categorias'; // API para carregar categorias disponíveis
const urlCursos = 'http://localhost:3000/cursos'; // API para buscar informações do curso

// Função para carregar dados do curso
async function carregarCurso() {
    const params = new URLSearchParams(window.location.search);
    const id_curso = params.get('id'); // Pega o ID do curso da URL

    if (!id_curso) {
        alert('ID do curso não encontrado!');
        window.location.href = 'consultaCursos.html'; // Redireciona se o ID estiver ausente
        return;
    }

    try {
        const resposta = await fetch(`${urlCursos}/${id_curso}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar curso: ${resposta.status}`);
        }

        const curso = await resposta.json();
        document.getElementById('id_curso').value = curso.id_cursos; // Mostra o ID no input
        document.getElementById('nome_curso').querySelector('span').textContent = curso.nome_curso; // Mostra o nome do curso

        carregarCategoriasAssociadas(id_curso); // Carrega as categorias associadas
    } catch (error) {
        console.error('Erro ao carregar o curso:', error);
    }
}

// Função para carregar categorias associadas ao curso
async function carregarCategoriasAssociadas(id_curso) {
    try {
        const resposta = await fetch(`${urlCategoriasCursos}/${id_curso}`);
        const categoriasAssociadas = await resposta.json();

        const tabela = document.getElementById('categoriasLista').querySelector('tbody');
        tabela.innerHTML = ''; // Limpa antes de preencher

        categoriasAssociadas.forEach((categoria) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${categoria.id_categoria}</td>
                <td>${categoria.nome}</td>
                <td>
                    <button onclick="removerCategoria(${id_curso}, ${categoria.id_categoria})">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar categorias associadas:', error);
    }
}

// Função para carregar categorias disponíveis no select
async function carregarCategorias() {
    try {
        const resposta = await fetch(urlCategorias);
        const categorias = await resposta.json();

        const selectCategoria = document.getElementById('categoria');
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>'; // Limpa antes de carregar

        categorias.forEach((categoria) => {
            const opcao = document.createElement('option');
            opcao.value = categoria.id_categorias;
            opcao.textContent = categoria.nome;
            selectCategoria.appendChild(opcao);
        });
    } catch (error) {
        console.error('Erro ao carregar categorias disponíveis:', error);
    }
}

// Função para adicionar categoria ao curso
async function adicionarCategoria(evento) {
    evento.preventDefault();

    const id_curso = document.getElementById('id_curso').value;
    const id_categoria = document.getElementById('categoria').value;

    if (!id_categoria) {
        alert('Selecione uma categoria!');
        return;
    }

    try {
        const resposta = await fetch(urlCategoriasCursos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_curso, id_categoria }),
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao adicionar categoria: ${resposta.status}`);
        }

        alert('Categoria adicionada com sucesso!');
        carregarCategoriasAssociadas(id_curso); // Atualiza a lista após adicionar
    } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao adicionar categoria.');
    }
}

// Função para remover categoria do curso
async function removerCategoria(id_curso, id_categoria) {
    try {
        const resposta = await fetch(`${urlCategoriasCursos}/${id_curso}/${id_categoria}`, {
            method: 'DELETE',
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao remover categoria: ${resposta.status}`);
        }

        alert('Categoria removida com sucesso!');
        carregarCategoriasAssociadas(id_curso); // Atualiza a lista
    } catch (error) {
        console.error('Erro ao remover categoria:', error);
        alert('Erro ao remover categoria.');
    }
}

// Função para voltar à edição do curso
function voltarParaEdicao() {
    const params = new URLSearchParams(window.location.search);
    const id_curso = params.get('id');
    if (id_curso) {
        window.location.href = `editarCursos.html?id=${id_curso}`;
    } else {
        alert('ID do curso não encontrado!');
    }
}

// Inicializar a página ao carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarCurso();
    carregarCategorias();

    document.getElementById('formAdicionarCategoria').addEventListener('submit', adicionarCategoria);
    document.getElementById('botaoVoltar').addEventListener('click', voltarParaEdicao);
});
