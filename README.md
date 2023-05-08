# GRUPO NOBRE APP

## Choose your language
<a href="./README.md"><img src="./public/img/icons/us_flag.png" width="75px"/></a>  <a href="./LEIAME.md"><img src="./public/img/icons/br_flag.png" width="75px"/></a>

## About
- Application that hosts api's, documentations and redirects of Grupo Nobre.
- This software was written in english and brazilian portuguese

## Languages
![JS](https://skills.thijs.gg/icons?i=html,css,js,nodejs)

## Requirements
- [Node LTS](https://nodejs.org/en/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Mongo DB](https://www.mongodb.com/)

## Dependences
- `Bcrypt.js`
- `Express`
- `Mongoose`
- `Axios`
- `Dotenv`

## How to install development enviroment
- Project clone `https://github.com/gustavopqz/Grupo-Nobre-APP.git`
- Netlify global install `npm i netlify-cli -g`
- Install dependeces `npm i express mongoose axios dotenv bryptjs`
- Run dev `ntl dev`

## How to add new enviroment variables
- Put new variables in .env file
- `$ ntl env:import`

## How to deploy
- `$ ntl deploy` (deploy test)
- `$ ntl deploy --prod` (deploy in production)

## Users
- There are currently three user types
    - Master admin
    - Room map admin
    - FAQ admin
- Each admin type has a different token
- To do updates on each integrated project, the token has to be validated
- To create new admin users you might use `./public/pages/administrativo` or `./public/administrative/createAdmin.js` code
- You can find the lambda function that create new users in `./function/create_admin.js`

## Integrated projects
- This project involve othere Grupo Nobre projects, including:
    - Room map
    - FAQ (frequently asked questions)
    - Virtual Library
    - Academic record
- Most part of client side pages are hosted in Hostgator
- All admins pages are hosted in Netlify (this project)

## Frontend
- This application's frontend was created using HTML, CSS and pure JS.
- They are located at  `./public`

## Backend
- Each endpoint was created with AWS Lambda Function
- They are located at `./functions`
- To access endpoints you must use `/.netlify/function/endpoint_name`

## Structure
- Frontend:
    - Home page: `./index.html`
    - Pages: `./public/pages`
    - CSS: `./public/css`
    - Images: `./public/img`
    - Frontend scripts: `./public/scripts`

- Backend: `./functions` + `./models`


## Endpoints
- Grupo Nobre App admins
    - create_admin
    - search_admins
    - update_admin_password
    - delete_admin
    - login
    - validation
- Virtual library
    - bibli_fan
    - bibli_unef
- FAQ (frequently asked questions)
    - create_question
    - search_questions
- Academic record
    - create_school_student
    - search_school_student
- Room map
    - UNEF
        - create_discipline
        - create_map_unef
        - search_discipline
        - update_discipline
        - delete_discipline
    - UNIFAN
        - create_discipline_unifan
        - create_map_unifan
        - search_discipline_unifan
        - update_discipline_unifan
        - delete_discipline_unifan

## CREATED BY
> Gustavo Pasqua de Queiroz