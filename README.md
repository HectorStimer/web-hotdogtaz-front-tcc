# Hotdog Taz - Front-end

Sistema de gerenciamento de pedidos e cardápio para a lanchonete Hotdog Taz.

## 📋 Descrição

Aplicação web desenvolvida em **React** com **TypeScript** que oferece uma interface moderna e intuitiva para:

-  **Dashboard**: Visualização de resumo de comandas e pedidos em andamento
-  **Cardápio**: Gerenciamento de produtos e categorias
-  **Comandas**: Controle de comandas de clientes
-  **Fila de Pedidos**: Acompanhamento de pedidos em processamento

##  Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **ESLint** - Linting de código

##  Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── AppLayout.tsx
│   ├── Sidebar.tsx
│   ├── CommandCard.tsx
│   └── ProductCard.tsx
├── pages/            # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Cardapio.tsx
│   ├── Comandas.tsx
│   ├── Command.tsx
│   ├── AddProduct.tsx
│   ├── EditProduct.tsx
│   ├── NewRequest.tsx
│   └── Queue.tsx
├── services/         # Serviços de API
│   ├── command.service.ts
│   ├── product.service.ts
│   ├── request.service.ts
│   └── category.service.ts
├── types/           # Tipos TypeScript
│   ├── command.ts
│   ├── product.ts
│   ├── request.ts
│   └── category.ts
├── routes/          # Configuração de rotas
├── assets/          # Ativos estáticos
├── App.tsx
├── main.tsx
└── index.css
```

##  Como Começar

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd hotdogtaz-front
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação abrirá automaticamente em `http://localhost:5173`

##  Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção localmente
npm run preview

# Executar linter
npm run lint
```

##  Arquitetura

### Serviços

Os serviços gerenciam a comunicação com a API:

- **command.service.ts** - Operações relacionadas a comandas
- **product.service.ts** - Gerenciamento de produtos
- **request.service.ts** - Operações de pedidos
- **category.service.ts** - Gerenciamento de categorias

### Types

Tipos TypeScript centralizados para toda a aplicação:

- **Command** - Comanda de cliente
- **Product** - Produto do cardápio
- **Request** - Pedido/Requisição
- **Category** - Categoria de produtos

##  Estilo

A aplicação utiliza **Tailwind CSS** para estilização. As cores e componentes seguem um design system consistente com:

- Componentes com bordas arredondadas (`rounded-xl`)
- Sombras suaves (`shadow`)
- Paleta de cores adaptada
- Design responsivo mobile-first

##  API Integration

As operações são realizadas através dos serviços que se comunicam com uma API backend. Configure a URL base da API nos arquivos de serviço conforme necessário.

##  Licença

Este projeto é propriedade da Lanchonete Hotdog Taz.

##  Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
2. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
3. Push para a branch (`git push origin feature/MinhaFeature`)
4. Abra um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, entre em contato com o time de desenvolvimento.
