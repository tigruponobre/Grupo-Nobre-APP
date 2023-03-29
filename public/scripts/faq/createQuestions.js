//Declaring variables
const body = document.querySelector('body')
const closeButton = document.getElementById('close')
const addQuestion = document.getElementById('addQuestion')
const showAddQuestion = document.getElementById('showAddQuestion')

window.addEventListener('keydown', event =>{
    if(event.keyCode == 27){
        addQuestion.style.display = 'none'
        body.style.overflowY = 'scroll'
    }
})

showAddQuestion.addEventListener("click", ()=>{
    addQuestion.style.display = 'block'
    body.style.overflowY = 'hidden'
})

closeButton.addEventListener("click", ()=>{
    addQuestion.style.display = 'none'
    body.style.overflowY = 'scroll'
})

async function postQuestion(){
    container.innerHTML = ''
    const title = document.getElementById('titleQuestion').value
    const textArea = document.getElementById('response').value
    const user_name = await sessionStorage.getItem('logged')
    const token = await sessionStorage.getItem('token')

    const response = await fetch(url + '/.netlify/functions/create_question', {
        method: 'post',
        body: JSON.stringify({
            title,
            answer: textArea,
            user_name,
            token
        })
    })

    const data = await response.json()
    window.alert(data.msg)

    document.getElementById('titleQuestion').value = ''
    document.getElementById('response').value = ''

    getQuestions()
}