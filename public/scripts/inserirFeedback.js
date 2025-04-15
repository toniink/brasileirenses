const urlFeedback = 'http://localhost:3000/feedback';

// Função para buscar e listar os feedbacks
async function buscarFeedbacks() {
    try {
        const resposta = await fetch(urlFeedback);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar feedbacks: ${resposta.status}`);
        }

        const feedbacks = await resposta.json();
        const tabela = document.getElementById('feedbackLista');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        feedbacks.forEach((feedback) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${feedback.id_feedback}</td>
                <td>${feedback.id_usuario}</td>
                <td>${feedback.tipo_feedback}</td>
                <td>${feedback.mensagem || 'Sem mensagem'}</td>
                <td>${feedback.data_feedback}</td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        alert('Erro ao carregar feedbacks.');
    }
}

// Função para salvar um novo feedback
document.getElementById('feedbackForm').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Captura os dados do formulário
    const id_usuario = document.getElementById('id_usuario').value.trim();
    const tipo_feedback = document.getElementById('tipo_feedback').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    // Validações no frontend
    if (!id_usuario || !tipo_feedback) {
        alert('Os campos "ID do Usuário" e "Tipo de Feedback" são obrigatórios.');
        return;
    }

    const dados = { id_usuario, tipo_feedback, mensagem };

    try {
        const resposta = await fetch(urlFeedback, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            const textoErro = await resposta.text();
            throw new Error(`Erro ao salvar feedback: ${resposta.status} - ${textoErro}`);
        }

        alert('Feedback salvo com sucesso!');
        document.getElementById('feedbackForm').reset(); // Limpa o formulário
        buscarFeedbacks(); // Atualiza a lista
    } catch (error) {
        console.error('Erro ao salvar feedback:', error);
        alert('Erro ao salvar o feedback.');
    }
});

// Listener do botão "Voltar"
document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    buscarFeedbacks(); // Carrega os feedbacks na tabela
});
