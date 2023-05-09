//Each funcition update article div
const article = document.getElementsByTagName('article')[0]

//Grupo Nobre APP

//Presentation
function presentation(){
    article.innerHTML = 
    `<em> Grupo Nobre APP / Apresentação</em>
    <h1>Conheça o <b class="cyan">Grupo Nobre APP</b></h1>
    <p>Este software foi desenvolvido com o objetivo facilitar acessos a todas as aplicações Grupo Nobre, hospedar API's e documentações, além de se tornar a interface de gerenciamento de outros projetos.</p>
    <p>Os idiomas utilizados foram <b>Portugues Brasileiro</b> no frontend e <b>Inglês</b> no backend.</p>
    <p>O backup do projeto se encontra no <a href="https://github.com/gustavopqz/Grupo-Nobre-APP" class="cyan">github</a>.</p>
    <h2 class="presentationSubtitle">Como utilizar este painel administrativo</h2>
    <div class="doc">
        <img src="../img/icons/app.png" alt="Grupo Nobre APP">
        <p><b class="cyan">Grupo Nobre APP</b> inclui tudo que é necessário para manutenção em geral, incluindo instruições específicas e detalhamento do esqueleto do software.</p>
    </div>
    <div class="doc">
        <img src="../img/icons/user.png" alt="Usuários">
        <p><b class="cyan">Usuários</b> inclui a listagem dos usuários, os tipos atualmente existentes, a criação de novos usuários e o funcionamento do token secreto.</p>
    </div>
    <div class="doc">
        <img src="../img/icons/share.png" alt="Projetos">
        <p><b class="cyan">Projetos integrados</b> inclui cada projeto que está ligado a este software, instruções para a utilzação e redirecionamentos para as áreas de gestão dos projetos.</p>
    </div>`
}

//Dependences
function dependences(){
    article.innerHTML = 
    `<em> Grupo Nobre APP / Exigências e Dependências</em>
    <h1><b class="cyan">Exigências</b> e <b class="cyan">dependências</b> gerais do projeto</h1>
    <h2>Passo a passo:</h2>
    <div class="step">
        <p>1 - Download do <b class="mark"><a href="https://nodejs.org/en/download" target="_blank">Node.js LTS</a></b></p>
        <p>2 - Download global e configuração do <b class="mark"><a href="https://www.netlify.com/" target="_blank">Netlify CLI</a></b></p>
        <p>3 - Download e configuração ou gerenciamento do MongoDB local ou neste caso <b class="mark"><a href="https://www.mongodb.com/" target="_blank">MongoDB Atlas</a></b></p>
        <p>
            4 - Instalação das dependências:
            <ul id="dependencesList">
                <li><a href="https://www.npmjs.com/package/bcryptjs" class="mark">Bcrypt.js</a></li>
                <li><a href="https://expressjs.com/pt-br/" class="mark">Express</a></li>
                <li><a href="https://mongoosejs.com/" class="mark">Mongoose</a></li>
                <li><a href="https://axios-http.com/ptbr/docs/intro" class="mark">Axios</a></li>
                <li><a href="https://www.npmjs.com/package/dotenv" class="mark">Dotenv</a></li>
            </ul>
        </p>
        <div id="code">
            <h2>Instalação do Netlify CLI</h2>
            <div class="copyCode">
                <p>npm <b class="red">install</b> netlify-cli -g</p>
                <img onclick="copyCode(event)" src="../img/icons/copy.png" alt="Copiar" title="Copiar">
            </div>
        </div>
        <div id="code">
            <h2>Instalação de dependências</h2>
            <div class="copyCode">
                <p>npm <b class="red">install</b> bcryptjs express mongoose axios dotenv</p>
                <img onclick="copyCode(event)" src="../img/icons/copy.png" alt="Copiar" title="Copiar">
            </div>
        </div>
    </div>  `
}