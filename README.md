# 📚 Portal de Recursos Educacionais
Um sistema completo de gerenciamento de conteúdos educacionais voltado para iniciantes em tecnologia. A plataforma permite cadastrar, editar e consultar cursos, categorias, sites e usuários, além de associar múltiplas categorias a um curso, tudo com interface web intuitiva e API RESTful.

## 🚀 Funcionalidades
- CRUD de usuários, cursos, categorias e sites
- Associação de categorias secundárias a cursos
- Interface responsiva com HTML, CSS e JavaScript
- Backend com Node.js, Express e SQLite
- Autenticação de usuários com senhas criptografadas
- Separação clara entre camadas (controllers, rotas, serviços, views)

## 🛠 Tecnologias Utilizadas
- Backend
- Node.js
- Express
- SQLite3
- Bcrypt (criptografia de senhas)
- CORS

## Frontend
- HTML5
- CSS3 (layout responsivo com estilização moderna)
- JavaScript (consumo de API via fetch)

## Organização de Código
- controllers/ – lógica das rotas (CRUD para categorias, cursos, sites, usuários)
- public/ – arquivos estáticos: CSS e scripts JS
- pages/ – HTML da interface do sistema
- scripts/ – interações JS para formulários e manipulação de dados

## 📂 Estrutura de Diretórios

portal-recursos/
├── config/              # Conexão com banco de dados SQLite
├── controllers/         # Lógica dos recursos (usuários, cursos, etc.)
├── public/              # Estilos (CSS) e scripts (JS)
├── pages/               # Interfaces HTML
├── routes/              # Definição das rotas da API
├── server.js            # Ponto de entrada do backend
└── database.db          # Banco de dados SQLite

## 📄 Funcionalidades por Módulo
### 🧑‍🏫 Cursos
- Cadastro e listagem com descrição, duração, formato e dificuldade
- Associação a categorias e sites
- Edição e exclusão de cursos
- Gerenciamento de categorias secundárias

### 🧩 Categorias
- Criar, editar, deletar categorias
- Atribuir categorias secundárias aos cursos
- Visualizar categorias associadas

### 🌐 Sites
- Vincular cursos a plataformas como Alura, Udemy, etc.
- Campos: nome, URL e descrição

## 👤 Usuários
- CRUD completo com hash de senhas
- Campos: nome, email, senha (criptografada)

## 🔧 Como Executar o Projeto
### Pré-requisitos
- Node.js (v18+)
- npm (v9+)

### Instalação

- git clone https://github.com/toniink/brasileirenses
- cd portal-recurso
- npm install

### Execução
### Iniciar o servidor
- npm run dev
- Acesse no navegador: http://localhost:3000

## 🔜 Melhorias Futuras
- Upload de imagens
- Moderação de comentários
- Filtros por nível/formato
- Paginação e busca avançada
- Login de usuários com autenticação JWT

## 📸 Layouts e Interfaces
- O sistema inclui páginas para:
- Cadastro e edição de cursos, usuários, categorias e sites
- Tabelas responsivas com ações de editar/excluir
- Associações dinâmicas via JavaScript

