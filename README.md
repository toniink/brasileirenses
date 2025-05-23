Portal de Recursos Educacionais
Um CMS educacional desenvolvido para democratizar o acesso ao conhecimento tecnológico, organizando cursos, softwares e tutoriais em uma interface intuitiva para iniciantes.

🛠 Tecnologias Utilizadas
Front-end
React 19 (com hooks e react-router-dom v7)
Vite 6 (ferramenta de construção como)
Bootstrap 5 + React-Bootstrap (estilização)
Ícones Bootstrap + Ícones React (pacote de ícones)
Backend
Node.js (ambiente de execução)
Express 5 (estrutura para API)
SQLite3 (banco de dados embutido)
CORS (middleware para requisições cruzadas)
Ferramentas de Desenvolvimento
ESLint (padronização de código)
React Refresh (recarga dinâmica)
Definições de TypeScript (tipagem para React)
Bibliotecas Adicionais
jsonwebtoken (para autenticação)
react-router-dom (gerenciamento de rotas SPA)
📂 Estrutura do Projeto
brasileirenses/
├── server.js # Ponto de entrada do backend
├── vite.config.js # Configuração do Vite
├── database.db # Banco de dados SQLite
├── src/
│ ├── api/ # Autenticação
│ ├── config/ # Configurações do DB
│ ├── controllers/ # Lógica da API
│ ├── pages/ # Componentes React
│ │ ├── admin/ # Área de gerenciamento
│ │ └── public/ # Páginas acessíveis
│ ├── routes/ # Endpoints da API
│ └── services/ # Consultas complexas
🚀 Como Executar o Projeto
Pré-requisitos :

Node.js (v18+)
npm (v9+)
Instalação :

git clone https://github.com/toniink/brasileirenses/
cd brasileirenses
npm install
Execução

# Iniciar frontend (Vite)
npm run dev
# Em outro terminal, iniciar backend
node server.js
🔄 Fluxos Principais
👨‍💻 Usuário Comum
Acesse a lista de cursos na página inicial
Selecione um curso específico
Visualização do software relacionado
Acesse o tutorial "Como instalar"
👨‍🔧 Administrador
Acesso : /#/gerenciamento(acesso direto pelo endpoint) Ordem de Cadastro :

Categorias
Sites de referência
Softwares
Cursos
Conteúdos (textos) para Cursos/Softwares/Tutoriais
⚙️ Funcionalidades Implementadas
CRUD completo para gestão de conteúdo
Sistema de feedback dos usuários
Interface responsiva e acessível
Organização hierárquica dos materiais educacionais
🔜 Próximas Atualizações
Sistema de playlists
Carregar imagens
Moderação de comentários
Temas claros/escuros
