const apiURL = 'http://localhost:3000/usuarios';

// Obter os dados do usuário pelo ID
async function loadUserData() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return;

    const response = await fetch(`${apiURL}/${id}`);
    const user = await response.json();

    // Preencher os campos
    document.getElementById('id').value = user.id;
    document.getElementById('nome').value = user.nome;
    document.getElementById('email').value = user.email;
    document.getElementById('senha').value = user.senha;
    document.getElementById('data_criacao').value = user.data_criacao;
}

// Salvar alterações
async function saveChanges(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const userData = { nome, email, senha };

    await fetch(`${apiURL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    alert('Usuário atualizado com sucesso!');
    window.location.href = 'consultarUsuarios.html'; // Voltar para a tela principal
}

// Cancelar e voltar para a tela principal
function cancelEdit() {
    window.location.href = 'consultaUsuarios.html';
}

// Inicializar funções
document.getElementById('editForm').addEventListener('submit', saveChanges);
document.getElementById('cancelButton').addEventListener('click', cancelEdit);

// Carregar os dados do usuário ao abrir a página
loadUserData();
