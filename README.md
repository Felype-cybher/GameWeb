🎮 Plataforma de Jogos Educativos
Um sistema web completo para a criação, compartilhamento e jogabilidade de jogos educativos, com sistema de usuários e ranking de pontuações.

🌐 Tela Inicial do Projeto
Abaixo, uma visão geral da página principal da aplicação após o login do usuário:

📝 Descrição do Projeto
Esta aplicação foi desenvolvida como projeto para a disciplina de Programação Web, visando criar uma plataforma interativa e funcional. O sistema permite que usuários se cadastrem, criem seus próprios jogos baseados em "Termos e Definições" e joguem tanto os seus quanto os de outros usuários.

O projeto foi construído com uma arquitetura moderna, separando o backend (API RESTful em Node.js) do frontend (Single Page Application em React), e utiliza um banco de dados MongoDB para persistir todos os dados de usuários, jogos e resultados.

🚀 Funcionalidades
Gerenciamento de Usuários

Cadastro de novos usuários com senha criptografada.

Login com autenticação segura via JSON Web Tokens (JWT).

Alteração de senha para usuários já logados.

Criação de Jogos

Interface para cadastrar um conjunto de Termos e Definições.

Geração automática de 3 tipos de jogos a partir dos dados fornecidos:

Jogo da Memória

Quiz de Múltipla Escolha

Jogo de Associação (digitação)

Jogabilidade

Sistema de pontuação, tempo, acertos e combos.

Salvamento automático do resultado de cada partida no banco de dados.

Ranking Global

Exibição das melhores pontuações de todos os jogadores.

Filtros para visualizar o ranking por jogo específico ou por critério (pontos, tempo, precisão).

🛠 Tecnologias Utilizadas
Backend:

Node.js: Ambiente de execução do servidor.

Express.js: Framework para a construção da API.

MongoDB: Banco de dados NoSQL.

bcrypt: Criptografia de senhas.

jsonwebtoken (JWT): Autenticação baseada em tokens.

dotenv: Gerenciamento de variáveis de ambiente.

CORS: Para permitir a comunicação entre backend e frontend.

Frontend:

React: Biblioteca para a construção da interface.

Vite: Ferramenta de build e servidor de desenvolvimento de alta performance.

Tailwind CSS: Framework CSS para estilização rápida e moderna.

shadcn/ui: Componentes de UI (usados em botões, caixas de alerta, etc.).

💻 Como Rodar Localmente
Siga os passos abaixo para executar o projeto em sua máquina.

1. Clonar o Repositório
git clone [https://github.com/Felype-cybher/GameWeb.git](https://github.com/Felype-cybher/GameWeb.git)
cd GameWeb

2. Configurar e Rodar o Backend
Navegue até a pasta backend:

cd backend

Instale as dependências:

npm install

Configure as Variáveis de Ambiente:

Crie um arquivo chamado .env na pasta backend.

Adicione as seguintes linhas, substituindo pelos seus valores:

MONGO_URI="SUA_STRING_DE_CONEXAO_DO_MONGODB_ATLAS"
JWT_SECRET="crie-uma-chave-secreta-bem-longa-e-dificil-aqui"

Execute o servidor:

npm run dev

O backend estará rodando em http://localhost:3001.

3. Configurar e Rodar o Frontend
Abra um novo terminal.

Navegue até a pasta frontend (a partir da pasta raiz do projeto):

cd frontend

Instale as dependências:

npm install

Execute a aplicação:

npm run dev

O site estará acessível no endereço que aparecer no terminal (geralmente http://localhost:5173).
