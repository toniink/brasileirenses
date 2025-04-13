const urlCursos = 'http://localhost:3000/cursos';
const urlCategorias = 'http://localhost:3000/categorias';
const urlSites = 'http://localhost:3000/sites';

// Função GET para buscar cursos e listar na tabela
async function buscarCursos() {
    const resposta = await fetch('http://localhost:3000/cursos');
    const cursos = await resposta.json();

    const tabelaCursos = document.getElementById('cursoLista');
    tabelaCursos.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    cursos.forEach((curso) => {
        const linhaCurso = document.createElement('tr');
        linhaCurso.innerHTML = `
            <td>${curso.id_cursos}</td>
            <td>${curso.nome_curso}</td>
            <td>${curso.descricao}</td>
            <td>${curso.duracao}</td>
            <td>${curso.url}</td>
            <td>${curso.formato}</td>
            <td>${curso.nivel_dificuldade}</td>
            <td>${curso.nome_categoria || 'Não definida'}</td> <!-- Exibe o nome da categoria -->
            <td>${curso.nome_site || 'Não definido'}</td> <!-- Exibe o nome do site -->
            <td class="acoes">
                <button class="botao-editar" onclick="editarCurso('${curso.id_cursos}')">Editar</button>
                <button class="botao-excluir" onclick="excluirCurso('${curso.id_cursos}')">Excluir</button>
            </td>
        `;
        tabelaCursos.appendChild(linhaCurso);
    });
}

// Inicializa a busca ao carregar a página
buscarCursos();


// Função para carregar categorias na lista suspensa
async function carregarCategorias() {
    const resposta = await fetch(urlCategorias);
    const categorias = await resposta.json();

    const selectCategoria = document.getElementById('categoria');
    categorias.forEach((categoria) => {
        const opcao = document.createElement('option');
        opcao.value = categoria.id_categorias; // Insere o ID no value
        opcao.textContent = categoria.nome; // Mostra o nome na lista suspensa
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
        opcao.value = site.id_site; // Insere o ID no value
        opcao.textContent = site.nome; // Mostra o nome na lista suspensa
        selectSite.appendChild(opcao);
    });
}

// Função para salvar ou atualizar curso
async function salvarCurso(evento) {
    evento.preventDefault();

    const nome_curso = document.getElementById('nome_curso').value;
    const descricao = document.getElementById('descricao').value;
    const duracao = document.getElementById('duracao').value;
    const url = document.getElementById('url').value;
    const formato = document.getElementById('formato').value;
    const nivel_dificuldade = document.getElementById('nivel_dificuldade').value;
    const id_categoria = document.getElementById('categoria').value; // ID capturado do select
    const id_site = document.getElementById('site').value; // ID capturado do select

    const dadosCurso = {
        nome_curso,
        descricao,
        duracao,
        url,
        formato,
        nivel_dificuldade,
        id_categoria, // Enviar ID da categoria
        id_site,      // Enviar ID do site
    };

    console.log('Dados a serem enviados ao backend:', dadosCurso);

    try {
        const resposta = await fetch(urlCursos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCurso),
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao criar curso: ${resposta.status}`);
        }

        alert('Curso criado com sucesso!');
        document.getElementById('cursoFormulario').reset(); // Limpa o formulário após o envio
        buscarCursos(); // Atualiza a lista de cursos
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        alert('Erro ao criar o curso.');
    }
}

// Certifique-se de que a função esteja ligada ao formulário de inserção
document.getElementById('cursoFormulario').addEventListener('submit', salvarCurso);


// Função para excluir curso
async function excluirCurso(cursoID) {
    await fetch(`${urlCursos}/${cursoID}`, { method: 'DELETE' });
    buscarCursos();
}

// Redirecionar para a página de edição de curso
function editarCurso(cursoID) {
    window.location.href = `editarCursos.html?id=${cursoID}`;
}

// Inicializar listas suspensas e funções ao carregar a página
document.getElementById('cursoFormulario').addEventListener('submit', salvarCurso);
document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

buscarCursos();
carregarCategorias();
carregarSites();
