const urlAdmin = 'http://localhost:3000/admin/login';

document.getElementById('loginForm').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Captura os dados do formulário
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // Validações no frontend
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const resposta = await fetch(urlAdmin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        if (!resposta.ok) {
            if (resposta.status === 401) {
                document.getElementById('mensagemErro').style.display = 'block';
            } else {
                throw new Error(`Erro na autenticação: ${resposta.status}`);
            }
            return;
        }

        // Se for bem-sucedido, redireciona para o menu principal de admin
        alert('Login realizado com sucesso!');
        window.location.href = '../index.html'; // Redirecionar para a página principal
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao realizar o login. Tente novamente mais tarde.');
    }
});
