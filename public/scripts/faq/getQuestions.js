const container = document.getElementById('container')
async function getQuestions(){
    const response = await fetch(url + '/.netlify/functions/get_questions')
    const data = await response.json()

    for (let question of Array.from(data.questions)){
        const newQuestion = document.createElement('div')
        newQuestion.setAttribute('class', 'question')
        newQuestion.innerHTML = ` <div class="questionHeader">
        <h2>${question.title}</h2>
        <img onclick="activate(event)" class="arrow-left" src="../img/icons/white-arrow.png" alt="arrow-left">
        </div>
        <p class="questionContent questionContentNotActivate">${question.content}</p>`
        container.appendChild(newQuestion)
    }
}

getQuestions()

function activate(event){
    const thisArrow = event.target
    const thisContent = thisArrow.parentElement.parentElement.children[1]    
    thisArrow.classList.toggle('arrow-activate')
    thisContent.classList.toggle('questionContentActivate')
    thisContent.classList.toggle('questionContentNotActivate')
}