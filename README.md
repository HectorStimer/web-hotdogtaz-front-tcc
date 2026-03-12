#  Hot Dog Taz — Frontend

Interface web do sistema de gerenciamento da lancheria **Hot Dog Taz**, desenvolvida com React, TypeScript e Tailwind CSS.

---

## 📋 Pré-requisitos

Antes de rodar o projeto, instale:

- [Node.js 18+](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/) (recomendado)

Extensões recomendadas no VS Code:
- `ES7+ React/Redux/React-Native snippets`
- `Tailwind CSS IntelliSense`
- `Prettier`
- `ESLint`

---

##  Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18+ | Framework UI |
| TypeScript | 5+ | Tipagem estática |
| Vite | 6+ | Bundler |
| Tailwind CSS | 4+ | Estilização |
| React Router DOM | 7+ | Roteamento |
| Axios | 1+ | Requisições HTTP |
| Keycloak JS | 24+ | Autenticação |
| @react-keycloak/web | 3+ | Integração Keycloak + React |
| Lucide React | - | Ícones |

---

##  Estrutura do Projeto

```
src/
│
├── components/
│   ├── AppLayout.tsx       # Layout principal com sidebar e área de conteúdo
│   ├── CommandCard.tsx     # Card de comanda na listagem
│   ├── Loading.tsx         # Tela de carregamento (bolinhas animadas)
│   ├── PrivateRoute.tsx    # Proteção de rotas autenticadas via Keycloak
│   ├── ProductCard.tsx     # Card de produto no cardápio
│   └── Sidebar.tsx         # Menu lateral de navegação
│
├── pages/
│   ├── AddProduct.tsx      # Formulário de criação de produto
│   ├── AddUser.tsx         # Formulário de criação de usuário
│   ├── Cardapio.tsx        # Listagem de produtos do cardápio
│   ├── Comandas.tsx        # Listagem de comandas abertas
│   ├── Command.tsx         # Detalhes de uma comanda com seus pedidos
│   ├── Dashboard.tsx       # Tela inicial com resumo do sistema
│   ├── EditProduct.tsx     # Formulário de edição de produto
│   ├── EditUser.tsx        # Formulário de edição de usuário
│   ├── NewRequest.tsx      # Tela para criar novo pedido dentro de uma comanda
│   ├── Queue.tsx           # Fila de pedidos para a cozinha
│   └── Users.tsx           # Listagem de usuários
│
├── routes/
│   └── index.tsx           # Definição de todas as rotas da aplicação
│
├── services/
│   ├── api.ts              # Instância central do Axios com interceptor de token
│   ├── category.service.ts # Requisições de categorias
│   ├── command.service.ts  # Requisições de comandas
│   ├── product.service.ts  # Requisições de produtos
│   ├── request.service.ts  # Requisições de pedidos
│   └── user.service.ts     # Requisições de usuários
│
├── types/
│   ├── category.ts         # Tipo Category
│   ├── command.ts          # Tipo Command
│   ├── product.ts          # Tipo Product
│   ├── request.ts          # Tipos Request e RequestItem
│   └── user.ts             # Tipo User
│
├── keycloak.ts             # Configuração do cliente Keycloak
├── main.tsx                # Ponto de entrada da aplicação
└── index.css               # Estilos globais (Tailwind)
```

---

##  Como rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/HectorStimer/web-hotdogtaz-front.git
cd web-hotdogtaz-front
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Verificar o `src/keycloak.ts`

Confirma que as configurações apontam para o Keycloak correto:

```ts
const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'hotdogtaz',
  clientId: 'hotdogtaz-front',
})
```

### 4. Verificar o `src/services/api.ts`

Confirma que a URL base da API está correta:

```ts
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
})
```

### 5. Rodar o projeto

```bash
npm run dev
```

O front estará disponível em `http://localhost:5173`

>  O backend e o Keycloak precisam estar rodando antes de abrir o front.

---

## Páginas do Sistema

| Rota | Página | Descrição |
|---|---|---|
| `/app` | Dashboard | Resumo de comandas e pedidos em andamento |
| `/app/cardapio` | Cardápio | Listagem de produtos com filtro de ativos |
| `/app/cardapio/novo` | Novo Produto | Formulário para criar produto |
| `/app/cardapio/:id` | Editar Produto | Formulário para editar produto |
| `/app/comandas` | Comandas | Listagem de comandas abertas e finalizadas |
| `/app/comandas/:id` | Comanda | Detalhes da comanda com pedidos e opção de fechar |
| `/app/comandas/:id/novo-pedido` | Novo Pedido | Seleção de produtos para criar pedido |
| `/app/fila` | Fila | Pedidos em andamento para a cozinha avançar status |
| `/app/usuarios` | Usuários | Listagem de usuários do sistema |
| `/app/usuarios/novo` | Novo Usuário | Formulário para criar usuário |
| `/app/usuarios/:id` | Editar Usuário | Formulário para editar usuário |

---

##  Autenticação

O sistema usa **Keycloak** para autenticação. Ao acessar qualquer rota, o usuário é redirecionado automaticamente para a tela de login do Keycloak.

Após o login, o token JWT é enviado automaticamente em todas as requisições para a API via header:
```
Authorization: Bearer <token>
```

Perfis de acesso:
- `ADMIN` — acesso total ao sistema
- `CLERK` — acesso restrito (não acessa página de usuários)

---

##  Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza o build de produção
```

