//Show response
function showResponse(e){
    const thisArrow = e.target
    thisParent = thisArrow.parentElement.parentElement
    thisArrow.classList.toggle('questionActivated')
    const response = [thisParent.children[1], thisParent.children[2], thisParent.children[3]]
    response.forEach(element => {
        if(element){
            element.classList.toggle('response')
        }
    })
}

async function generateTheme(event){
    const getTheme = event.target.textContent

    const response = await fetch(url + '/.netlify/functions/search_questions', {
        method: 'post',
        body: JSON.stringify({
            theme: getTheme
        })
    })

    const data = await response.json()

    if(response.status != 200){
        window.alert(data.msg)
    }else{
        const questions = data.content
        questions.forEach( element => {
            const showQuestion = document.createElement('div')
            showQuestion.setAttribute('class', 'question')
            showQuestion.innerHTML = 
            `<h5 class="questionTitle">${element.title}<img onclick="showResponse(event)"
            src="../img/icons/black_left_arrow.png" alt="arrow-right" width="25"></h5>
            <div class="unef response">
                <h6>UNEF</h6>
                <p>Qualquer dúvida acadêmica, direcionado a coordenação e professores. Aluno EAD não resolve
                problemas acadêmicas no NAC - UNEF.</p>
            </div>
            <div class="unifan response">
                <h6>UNIFAN</h6>
                <p>Alunos com dificuldade passados o contato geral da huggy (2102-9100) e pedimos para falar com o NAC.</p>
            </div>`

            //ANTES DE FAZER O QUE ESTAVA FAZENDO ACIMA É NECESSÁRIO VERIFICAR QUAIS CAMPOS TEM CONTÉUDO, UNEF - UNINFAN - UNEF EAD - UNIFAN EAD E CRIAR DIVS PARA CADA QUANDO HOUVER CONTEÚDO, CONCATENAR COMO STRING E SÓ DEPOIS EXECUTAR O APPEND
        })
    }
}