# 🍼 Enxoval do Neném (Baby's Wishlist)

Uma aplicação interativa e carinhosa para organizar, compartilhar e gerenciar a lista de presentes (enxoval) do bebê. 
Permite que amigos e familiares escolham presentes de uma lista, adicionem ao carrinho e façam a reserva de forma simples e intuitiva. 💛

## ✨ Funcionalidades

- **Lista de Presentes:** Visualização de presentes organizados por categoria (acompanhados de imagens e quantidades).
- **Carrinho de Reservas:** Adicione itens desejados ao carrinho e conclua a reserva para que os papais saibam o que você vai dar.
- **Painel dos Papais (Admin):** Área restrita para os pais gerenciarem os itens da lista, verem as reservas e acompanharem os presentes escolhidos.
- **Design Responsivo e Moderno:** Interface bela e acolhedora com tema voltado para bebês, feita com Tailwind CSS e componentes Radix/Shadcn UI.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, Vite, TypeScript
- **Estilização:** Tailwind CSS, Shadcn UI, Embla Carousel
- **Gerenciamento de Estado:** React Query, Hooks customizados
- **Backend / Banco de Dados:** Supabase, Prisma ORM
- **Formulários e Validação:** React Hook Form, Zod
- **Roteamento:** React Router DOM

## 🚀 Como executar o projeto localmente

Siga os passos abaixo para rodar o projeto em sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) instalado em sua máquina.

### 2. Instalando as dependências
```bash
npm install
```

### 3. Configurando Variáveis de Ambiente
Certifique-se de configurar as variáveis de ambiente com as chaves do Supabase e URL do Banco de Dados no servidor. 

### 4. Executando as Migrations do Banco (Prisma)
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Iniciando o servidor de desenvolvimento
```bash
npm run dev
```
O projeto estará acessível pelo navegador geralmente na porta configurada pelo Vite.

## 📝 Licença
Este projeto é de uso pessoal para a organização do enxoval. Sinta-se livre para se inspirar! ✨
