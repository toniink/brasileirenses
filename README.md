# Portal de Recursos Educacionais

Um CMS educacional desenvolvido para democratizar o acesso ao conhecimento tecnológico, organizando cursos, softwares e tutoriais em uma interface intuitiva para iniciantes.

---

## 🛠 Tecnologias Utilizadas

### Front-end
- React 19 (com hooks e `react-router-dom` v7)
- Vite 6
- Bootstrap 5 + React-Bootstrap
- Bootstrap Icons + React Icons

### Backend
- Node.js
- Express 5
- SQLite3
- CORS

### Ferramentas de Desenvolvimento
- ESLint
- React Refresh
- Definições de TypeScript

### Bibliotecas Adicionais
- `jsonwebtoken`
- `react-router-dom`

---

## 📂 Estrutura do Projeto

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

yaml
Copiar
Editar

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- npm (v9+)

### Instalação

```bash
git clone https://github.com/toniink/brasileirenses/
cd brasileirenses
npm install
Execução
bash
Copiar
Editar
# Em um terminal, inicie o frontend (Vite)
npm run dev

# Em outro terminal, inicie o backend
node server.js
🔄 Fluxos Principais
👨‍💻 Usuário Comum
Acesse a lista de cursos na página inicial

Selecione um curso específico

Visualize o software relacionado

Acesse o tutorial "Como instalar"

👨‍🔧 Administrador
Acesso direto via: /#/gerenciamento

Ordem recomendada de cadastro:

Categorias

Sites de referência

Softwares

Cursos

Conteúdo (para cursos/softwares/tutoriais)

⚙️ Funcionalidades Implementadas
✅ CRUD completo para cursos, softwares, tutoriais e categorias

✅ Sistema de feedback de usuários

✅ Interface responsiva e acessível

✅ Organização hierárquica dos conteúdos

🔜 Próximas Atualizações
Sistema de playlists

Upload de imagens

Moderação de comentários

Suporte a temas claro/escuro
