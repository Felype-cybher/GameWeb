Plataforma de Jogos Educativos
📖 Descrição do Projeto
Este projeto consiste em uma plataforma web completa para a criação e compartilhamento de jogos educativos. Usuários podem se cadastrar, criar diferentes tipos de jogos baseados em "termos e definições", jogar os games disponíveis e ter seus resultados salvos em um ranking geral.

Esta é a primeira entrega do projeto, focada nas funcionalidades essenciais de gerenciamento de usuários, conteúdo e geração de jogos, conforme especificado nos requisitos da disciplina.

✨ Funcionalidades Implementadas
Gerenciamento de Usuários:

Cadastro de novos usuários.

Login com autenticação via JSON Web Tokens (JWT).

Alteração de senha para usuários logados.

Criação de Conteúdo:

Interface para criar a base dos jogos, inserindo pares de Termo e Definição.

Geração e Jogo:

Criação de 3 tipos de jogos a partir dos dados inseridos:

Jogo da Memória: Encontrar os pares de termo e definição.

Quiz de Múltipla Escolha: Acertar a definição correta para um termo.

Jogo de Associação: Digitar a definição correta para um termo.

Controle de pontuação, acertos, erros e tempo durante as partidas.

Ranking e Resultados:

Todos os resultados das partidas são salvos no banco de dados.

Tela de Ranking que exibe as melhores pontuações, com filtros por jogo e por critério (pontos, tempo, precisão).

💻 Tecnologias Utilizadas
Backend:

Node.js: Ambiente de execução do servidor.

Express.js: Framework para criação da API RESTful.

MongoDB: Banco de dados NoSQL para armazenar usuários, jogos e resultados.

Mongoose: Biblioteca para modelagem dos dados do MongoDB.

bcrypt: Para criptografia segura de senhas.

jsonwebtoken (JWT): Para gerenciamento de sessões e autenticação.

dotenv: Para gerenciamento de variáveis de ambiente.

Frontend:

React: Biblioteca para construção da interface de usuário.

Vite: Ferramenta de build e servidor de desenvolvimento.

Tailwind CSS: Framework de estilização para um design rápido e moderno.

shadcn/ui: Componentes de UI (usados para botões, toasts, etc.).

🚀 Como Instalar e Executar
Siga os passos abaixo para rodar o projeto em sua máquina local.

Pré-requisitos
Node.js (versão 14 ou superior)

npm (geralmente vem com o Node.js)

Uma string de conexão do MongoDB Atlas

1. Clonar o Repositório
git clone [https://github.com/Felype-cybher/GameWeb.git](https://github.com/Felype-cybher/GameWeb.git)
cd GameWeb

2. Configurar o Backend
Navegue até a pasta do backend:

cd backend

Instale as dependências:

npm install

Configure as Variáveis de Ambiente:

Crie um arquivo chamado .env na pasta backend.

Adicione as seguintes linhas, substituindo pelos seus valores:

MONGO_URI="SUA_STRING_DE_CONEXAO_DO_MONGODB_ATLAS"
JWT_SECRET="crie-uma-chave-secreta-bem-longa-e-dificil"

Execute o servidor do backend:

npm run dev

O servidor estará rodando em http://localhost:3001.

3. Configurar o Frontend
Abra um novo terminal.

Navegue até a pasta do frontend a partir da raiz do projeto:

cd frontend

Instale as dependências:

npm install

Execute a aplicação frontend:

npm run dev

O site estará acessível em http://localhost:5173 (ou na porta que o Vite indicar).
