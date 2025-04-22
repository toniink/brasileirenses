const urlCursos = 'http://localhost:3000/cursos';
const urlCategorias = 'http://localhost:3000/categorias';
const urlSites = 'http://localhost:3000/sites';

// Função para carregar os dados do curso pelo ID
async function carregarDadosCurso() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('ID do curso não encontrado na URL');
        return;
    }

    try {
        const resposta = await fetch(`${urlCursos}/${id}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar curso: ${resposta.status}`);
        }
        const curso = await resposta.json();

        // Preencher os campos do formulário
        document.getElementById('id_curso').value = curso.id_cursos;
        document.getElementById('nome_curso').value = curso.nome_curso;
        document.getElementById('descricao').value = curso.descricao;
        document.getElementById('duracao').value = curso.duracao;
        document.getElementById('url').value = curso.url;
        document.getElementById('formato').value = curso.formato;
        document.getElementById('nivel_dificuldade').value = curso.nivel_dificuldade;

        // Selecionar as opções da lista suspensa com os IDs associados
        document.getElementById('categoria').value = curso.categoria; // ID da categoria
        document.getElementById('site').value = curso.site; // ID do site
    } catch (error) {
        console.error('Erro ao carregar os dados do curso:', error);
    }
}

// Função para carregar categorias na lista suspensa
async function carregarCategorias() {
    const resposta = await fetch(urlCategorias);
    const categorias = await resposta.json();

    const selectCategoria = document.getElementById('categoria');
    categorias.forEach((categoria) => {
        const opcao = document.createElement('option');
        opcao.value = categoria.id_categorias; // Insere o ID como valor
        opcao.textContent = categoria.nome; // Mostra o nome no dropdown
        selectCategoria.appendChild(opcao);
    });
}

// Função para carregar sites na lista suspensa
async function carregarSites() {
    const resposta = await fetch(urlSites);
    const sites = await resposta.json();

    const selectSite = document.getElementById('site');
    sites.forEach((site) => {
        const opcao = document.createElement('option');
        opcao.value = site.id_site; // Insere o ID como valor
        opcao.textContent = site.nome; // Mostra o nome no dropdown
        selectSite.appendChild(opcao);
    });
}

// Função para salvar as alterações do curso
async function salvarEdicaoCurso(evento) {
    evento.preventDefault();

    const id = document.getElementById('id_curso').value;
    const nome_curso = document.getElementById('nome_curso').value;
    const descricao = document.getElementById('descricao').value;
    const duracao = document.getElementById('duracao').value;
    const url = document.getElementById('url').value;
    const formato = document.getElementById('formato').value;
    const nivel_dificuldade = document.getElementById('nivel_dificuldade').value;
    const id_categoria = document.getElementById('categoria').value; // ID selecionado no dropdown
    const id_site = document.getElementById('site').value; // ID selecionado no dropdown

    const dadosCurso = {
        nome_curso,
        descricao,
        duracao,
        url,
        formato,
        nivel_dificuldade,
        id_categoria, // FK de categoria
        id_site,      // FK de site
    };

    try {
        const resposta = await fetch(`${urlCursos}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCurso),
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao atualizar curso: ${resposta.status}`);
        }

        alert('Curso atualizado com sucesso!');
        window.location.href = '../consultaCursos.html'; // Redireciona para a página de consulta de cursos
    } catch (error) {
        console.error('Erro ao salvar as alterações do curso:', error);
        alert('Erro ao salvar as alterações.');
    }
}

// Função para cancelar a edição
function cancelarEdicao() {
    window.location.href = '../pages/consultaCursos.html'; // Redirecionar para consulta de cursos
}

// Função para redirecionar para a página de categorias secundárias
function gerenciarCategoriasSecundarias() {
    const id_curso = document.getElementById('id_curso').value; // Obtém o ID do curso
    if (!id_curso) {
        alert('ID do curso não encontrado!');
        return;
    }

    // Redireciona para a página de categorias secundárias, incluindo o ID do curso na URL
    window.location.href = `categoriasCursos.html?id=${id_curso}`;
}

// Inicializar listas suspensas e carregar os dados ao abrir a página
document.getElementById('formEditarCurso').addEventListener('submit', salvarEdicaoCurso);
document.getElementById('botaoCancelar').addEventListener('click', cancelarEdicao);
document.getElementById('botaoGerenciarCategorias').addEventListener('click', gerenciarCategoriasSecundarias);

carregarCategorias();
carregarSites();
carregarDadosCurso();
