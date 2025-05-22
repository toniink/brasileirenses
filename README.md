# Portal de Recursos Educacionais

Um CMS educacional desenvolvido para democratizar o acesso ao conhecimento tecnológico, organizando cursos, softwares e tutoriais em uma interface intuitiva para iniciantes.



## 🛠 Tecnologias Utilizadas
### Frontend
- **React 19** (com hooks e react-router-dom v7)
- **Vite 6** (como build tool)
- **Bootstrap 5** + React-Bootstrap (estilização)
- **Bootstrap Icons** + React Icons (pacote de ícones)

### Backend
- **Node.js** (ambiente de execução)
- **Express 5** (framework para API)
- **SQLite3** (banco de dados embutido)
- **CORS** (middleware para requisições cruzadas)

### Ferramentas de Desenvolvimento
- **ESLint** (padronização de código)
- **React Refresh** (hot reloading)
- **TypeScript Definitions** (tipagem para React)

### Bibliotecas Adicionais
- **jsonwebtoken** (para autenticação)
- **react-router-dom** (gerenciamento de rotas SPA)

---

## 📂 Estrutura do Projeto
```
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
```

---

## 🚀 Como Executar o Projeto

1. **Pré-requisitos**:
   - Node.js (v18+)
   - npm (v9+)

2. **Instalação**:
   
   ```
   git clone https://github.com/toniink/brasileirenses/
   ```
   ```
   cd brasileirenses
   ```
   ```
   npm install
   ```

3. **Execução**
```
# Iniciar frontend (Vite)
npm run dev
```
```
# Em outro terminal, iniciar backend
node server.js
   ```
   ---

## 🔄 Fluxos Principais
### 👨‍💻 Usuário Comum
1. Acessa a lista de cursos na página inicial
2. Seleciona um curso específico
3. Visualiza o software relacionado
4. Acessa o tutorial "Como instalar"


### 👨‍🔧 Administrador
**Acesso**: `/#/gerenciamento` (acesso direto pelo endpoint)
***Ordem de Cadastro***:

1. Categorias
2. Sites de referência
3. Softwares
4. Cursos
5. Conteúdos (textos) para Cursos/Softares/Tutoriais

---

## ⚙️ Funcionalidades Implementadas
- CRUD completo para gestão de conteúdos
- Sistema de feedback dos usuários
- Interface responsiva e acessível
- Organização hierárquica dos materiais educacionais

---

## 🔜 Próximas Atualizações
- Sistema de playlists
- Upload de imagens
- Moderação de comentários
---
- Temas claro/escuro
