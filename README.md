# 📘 Portal de Gerenciamento de Usuários
Este projeto é uma aplicação web full-stack desenvolvida com Node.js, Express e SQLite3 no backend, e HTML, CSS e JavaScript no frontend. O objetivo é fornecer uma interface intuitiva para o gerenciamento de usuários, permitindo operações de criação, leitura, atualização e exclusão (CRUD).


## 🚀 Tecnologias Utilizadas

### Backend
- Node.js: Ambiente de execução JavaScript no servidor.
- Express: Framework web para Node.js.
- SQLite3: Banco de dados relacional leve e embutido.
- bcrypt: Biblioteca para hash de senhas.
- CORS: Middleware para habilitar requisições entre diferentes origens.

### Frontend
- HTML5: Estruturação das páginas web.
- CSS3: Estilização das páginas.
- JavaScript: Lógica de interação no lado do cliente.

## 📁 Estrutura do Projeto

brasileirenses/

├── public/
│   ├── styles.css           # Estilos CSS
│   └── scripts.js           # Lógica JavaScript do frontend
├── config/
│   └── db.js                # Configuração do banco de dados SQLite
├── server.js                # Servidor Express
├── package.json             # Dependências e scripts do projeto
└── index.html               # Página principal da aplicação


## ⚙️ Funcionalidades
- Cadastro de Usuários: Adição de novos usuários com nome, email e senha.
- Listagem de Usuários: Visualização de todos os usuários cadastrados em uma tabela.
- Edição de Usuários: Atualização das informações dos usuários existentes.
- Exclusão de Usuários: Remoção de usuários do sistema.
- Hash de Senhas: As senhas são armazenadas de forma segura utilizando bcrypt.

## 🛠️ Instalação e Execução
### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior)

### Passos para executar o projeto
1. Clone o repositório:
git clone https://github.com/toniink/brasileirenses.git
cd brasileirenses


### Instale as dependências:
- npm install
- 
### Inicie o servidor:
- npm run dev

Abra o arquivo index.html no seu navegador para acessar a interface.

## 🔄 Fluxo de Uso
1. Adicionar Usuário: Preencha o formulário com nome, email e senha, e clique em "Salvar".

2. Editar Usuário: Clique em "Editar" ao lado do usuário desejado, modifique as informações e clique em "Salvar".

3. Excluir Usuário: Clique em "Excluir" ao lado do usuário que deseja remover.

## 📌 Observações
- As senhas são armazenadas de forma segura utilizando a biblioteca bcrypt.
- O banco de dados utilizado é o SQLite3, armazenado localmente no arquivo database.db.
- A aplicação é executada localmente na porta 3000.

## 📄 Licença
Este projeto está licenciado sob a Licença MIT.
