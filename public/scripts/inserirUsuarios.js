const apiURL = 'http://localhost:3000/usuarios';

//função GET
async function getUsers(){
    const response = await fetch(apiURL);
    const users = await response.json();

    const userList = document.getElementById('usuarioLista');
    userList.innerHTML = '';

    users.forEach((user) => {
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td id="usuarioSenha">${user.senha}</td>
        <td>${user.data_criacao}</td>
        <td class="user-actions">
            <button class="edit-button" onclick="editUser('${user.id}')">Editar</button>
            <button class="delete-button" onclick="deleteUser('${user.id}')">Excluir</button>
        </td>
         `;
        userList.appendChild(userRow);
    });
}

async function saveUser(event){
    event.preventDefault();

    const usuarioID = document.getElementById('usuarioID').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const userData = {nome, email, senha};

    if (usuarioID) {
        //atualizar usuario put
        await fetch (`${apiURL}/${usuarioID}`, {
            method: 'PUT',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        });
    } else{
        await fetch (`${apiURL}`, {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        });
    }
    document.getElementById('usuarioForm').reset();
    getUsers();
}

// Função para excluir usuário (DELETE)
async function deleteUser(usuarioID) {
    await fetch(`${apiURL}/${usuarioID}`, { method: 'DELETE' });
    getUsers();
  }
  
  // Função para carregar dados no formulário para edição
  function editUser(usuarioID) {
    window.location.href=(`editUser.html?id=${usuarioID}`);
}

  

//botao voltar menu principal
document.getElementById('voltarButton').addEventListener('click', () => {
    window.location.href = '../index.html'; // Ajuste o caminho se necessário
});

  // Inicializa as funções
  document.getElementById('usuarioForm').addEventListener('submit', saveUser);
getUsers();

