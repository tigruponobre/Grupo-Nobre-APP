# GRUPO NOBRE APP

## Escolha seu idioma
<a href="./README.md"><img src="./public/img/icons/us_flag.png" width="75px"/></a>  <a href="./LEIAME.md"><img src="./public/img/icons/br_flag.png" width="75px"/></a>

## Sobre
- Aplicativo que hospeda api's, documentações e redirecionamentos do Grupo Nobre.
- Este software foi escrito em inglês e português brasileiro

## Linguagens
[![JS](https://skills.thijs.gg/icons?i=html,css,js,nodejs)](https://skills.thijs.gg)

## Requisitos
- [Node LTS](https://nodejs.org/en/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Mongo DB](https://www.mongodb.com/)

## Dependencias
- `Bcrypt.js`
- `Express`
- `Mongoose`
- `Axios`
- `Dotenv`

## Como instalar o ambiente de desenvolvimento
- Clone o projeto `https://github.com/gustavopqz/Grupo-Nobre-APP.git`
- Instalação global do Netlify CLI `npm i netlify-cli -g`
- Instalação de dependencias `npm i express mongoose axios dotenv bryptjs`
- Rodar ambiente `ntl dev`

## Como adicionar variáveis de ambiente
- Coloque as variáis do arquivo .env
- `$ ntl env:import`

## Como executar o deploy
- `$ ntl deploy` (deploy teste)
- `$ ntl deploy --prod` (deploy em produção)

## Usuários
- Existem atualmente três tipos de usuários
     - Administrador mestre
     - Administrador do mapa da salas
     - Administrador de perguntas frequentes
- Cada tipo de administrador possui um token diferente
- Para fazer atualizações em cada projeto integrado, o token deve ser validado
- Para criar novos usuários admin, você pode usar o código `./public/pages/administrativo` ou `./public/administrative/createAdmin.js`
- Você pode encontrar a função lambda que cria novos usuários em `./function/create_admin.js`

## Projetos integrados
- Este projeto envolve outros projetos do Grupo Nobre, incluindo:
     - Mapa do quarto
     - FAQ (perguntas frequentes)
     - Biblioteca virtual
     - Recorde acadêmico
- A maior parte das páginas do lado do cliente são hospedadas no Hostgator
- Todas as páginas de administração estão hospedadas no Netlify (este projeto)

## Frontend
- O frontend desta aplicação foi criado usando HTML, CSS e JS puro.
- Arquivos frontend estão localizados em `./public`

## Backend
- Cada endpoint foi criado com a função AWS Lambda
- Arquivos backend estão localizados em `./functions` e modelos em `./models`
- Para acessar endpoints você deve usar `/.netlify/function/endpoint_name`

## Estrutura
- Frontend:
    - Home page: `./index.html`
    - Pages: `./public/pages`
    - CSS: `./public/css`
    - Imagens: `./public/img`
    - Frontend scripts: `./public/scripts`

- Backend: `./functions` + `./models`


## Endpoints
- Grupo Nobre App admins
    >- create_admin
    >- search_admins
    >- update_admin_password
    >- delete_admin
    >- login
    >- validation
- Biblioteca virtual
    >- bibli_fan
    >- bibli_unef
- Dúvidas frequentes
    >- create_question
    >- search_questions
- Consulta de RA
    >- create_school_student
    >- search_school_student
- Mapa de salas
    - UNEF
        >- create_discipline
        >- create_map_unef
        >- search_discipline
        >- update_discipline
        >- delete_discipline
    - UNIFAN
        >- create_discipline_unifan
        >- create_map_unifan
        >- search_discipline_unifan
        >- update_discipline_unifan
        >- delete_discipline_unifan

## Criado por
> Gustavo Pasqua de Queiroz