const urlCursos = 'http://localhost:3000/cursos';
const urlCategorias = 'http://localhost:3000/categorias';
const urlSites = 'http://localhost:3000/sites';

// Função GET para buscar cursos e listar na tabela
async function buscarCursos() {
    const resposta = await fetch(urlCursos);
    const cursos = await resposta.json();

    const tabelaCursos = document.getElementById('cursoLista');
    tabelaCursos.innerHTML = '';

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
            <td>${curso.categoria}</td>
            <td>${curso.site}</td>
            <td class="acoes">
                <button class="botao-editar" onclick="editarCurso('${curso.id_cursos}')">Editar</button>
                <button class="botao-excluir" onclick="excluirCurso('${curso.id_cursos}')">Excluir</button>
            </td>
        `;
        tabelaCursos.appendChild(linhaCurso);
    });
}

// Função para salvar ou atualizar curso
async function salvarCurso(evento) {
    evento.preventDefault();

    const cursoID = document.getElementById('cursoID').value;
    const nome_curso = document.getElementById('nome_curso').value;
    const descricao = document.getElementById('descricao').value;
    const duracao = document.getElementById('duracao').value;
    const url = document.getElementById('url').value;
    const formato = document.getElementById('formato').value;
    const nivel_dificuldade = document.getElementById('nivel_dificuldade').value;
    const categoria = document.getElementById('categoria').value;
    const site = document.getElementById('site').value;

    const dadosCurso = { nome_curso, descricao, duracao, url, formato, nivel_dificuldade, categoria, site };

    if (cursoID) {
        // Atualizar curso (PUT)
        await fetch(`${urlCursos}/${cursoID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCurso),
        });
    } else {
        // Criar novo curso (POST)
        await fetch(urlCursos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCurso),
        });
    }

    document.getElementById('cursoFormulario').reset();
    buscarCursos();
}

// Função para excluir curso
async function excluirCurso(cursoID) {
    await fetch(`${urlCursos}/${cursoID}`, { method: 'DELETE' });
    buscarCursos();
}

// Redirecionar para a página de edição de curso
function editarCurso(cursoID) {
    window.location.href = `editarCursos.html?id=${cursoID}`;
}

// Inicializar funções
document.getElementById('cursoFormulario').addEventListener('submit', salvarCurso);
document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Carregar cursos e categorias/sites
buscarCursos();
