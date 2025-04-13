const urlCursos = 'http://localhost:3000/cursos';

// Carregar os dados do curso pelo ID
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
    } catch (error) {
        console.error('Erro ao carregar os dados do curso:', error);
    }
}

// Salvar as alterações do curso
async function salvarEdicaoCurso(evento) {
    evento.preventDefault();

    const id = document.getElementById('id_curso').value;
    const nome_curso = document.getElementById('nome_curso').value;
    const descricao = document.getElementById('descricao').value;
    const duracao = document.getElementById('duracao').value;
    const url = document.getElementById('url').value;
    const formato = document.getElementById('formato').value;
    const nivel_dificuldade = document.getElementById('nivel_dificuldade').value;

    const dadosCurso = { nome_curso, descricao, duracao, url, formato, nivel_dificuldade };

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
        window.location.href = '../consultaCursos.html'; // Redireciona para a página de consulta
    } catch (error) {
        console.error('Erro ao salvar as alterações do curso:', error);
        alert('Erro ao salvar as alterações.');
    }
}

// Cancelar a edição
function cancelarEdicao() {
    window.location.href = '../pages/consultaCursos.html'; // Redireciona para a página de consulta geral
}

// Inicializar funções ao carregar a página
document.getElementById('formEditarCurso').addEventListener('submit', salvarEdicaoCurso);
document.getElementById('botaoCancelar').addEventListener('click', cancelarEdicao);


// Carregar os dados do curso ao abrir a página
carregarDadosCurso();
