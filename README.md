# Portal de Recursos Educacionais — CMS Educacional

Um sistema de gerenciamento de conteúdo (CMS) educacional completo, desenvolvido para democratizar o acesso a recursos tecnológicos por meio da organização de **cursos**, **softwares**, **tutoriais**, **feedbacks**, **playlists** e **categorias**. O projeto conta com uma interface de administração e funcionalidades robustas tanto para usuários quanto para administradores.

---

## 📚 Funcionalidades Principais

- CRUD completo para:
  - Usuários
  - Cursos (com categorias principais e secundárias)
  - Categorias
  - Softwares
  - Tutoriais com imagem
  - Feedbacks
  - Playlists
  - Sites de referência
  - Comentários e avaliações
  - Denúncias
    
- Login de administrador com verificação de senha criptografada (bcrypt)
- Associação de múltiplas categorias a cursos
- Interface visual via HTML + CSS com páginas de administração
- API RESTful usando Express e SQLite
- Separação de rotas por responsabilidade (controllers organizados)

---

## 🧰 Tecnologias Utilizadas

**Back-end**
- Node.js
- Express
- SQLite3
- Bcrypt (criptografia de senha)
- CORS (requisições cruzadas)

**Front-end (público/admin)**
- HTML5
- CSS3
- JavaScript (DOM API)
- Scripts organizados por funcionalidade em "/public/scripts/"

---

## 📁 Estrutura do Projeto

raiz/
├── config/
│ └── db.js # Conexão com o banco SQLite
├── controllers/
│ ├── usuariosController.js
│ ├── cursosController.js
│ ├── categoriasController.js
│ ├── sitesController.js
│ ├── softwaresController.js
│ ├── tutoriaisController.js
│ ├── feedbackController.js
│ ├── denunciasController.js
│ └── playlistsController.js
├── public/
│ ├── styles.css # Estilização global
│ ├── index.html # Página principal de gerenciamento
│ └── scripts/ # Scripts separados por entidade
├── routes/
│ └── *.js # Definições de rotas agrupadas
├── server.js # Ponto de entrada do backend
└── README.md # Este arquivo

---

## 🚀 Como Rodar o Projeto

**Pré-requisitos:**
- Node.js (v18+)
- SQLite3 instalado ou banco incluso no projeto

# Clone o repositório
- git clone https://github.com/toniink/brasileirenses.git

- cd brasileirenses

# Instale as dependências
- npm install

# Inicie o servidor
- npm start

O backend será executado em http://localhost:3000. A interface HTML pode ser acessada abrindo os arquivos .html diretamente no navegador ou servindo por um servidor estático local.

## 🧪 Funcionalidades Adicionais
- Sistema de login de administrador seguro
- Relacionamento entre tabelas via JOIN (ex: cursos x categorias)
- Gerenciamento visual de todas as entidades com edição e exclusão
- Suporte para carregamento de imagens em tutoriais (em desenvolvimento)

## 🛠 Melhorias Futuras
- Integração com React ou outro framework moderno
- Upload de imagens (via Multer)
- Sistema de autenticação via token JWT
- Filtros e busca avançada
- Exportação de relatórios

