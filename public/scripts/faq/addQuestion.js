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

    const response = await fetch(url + '/.netlify/functions/insert_question', {
        method: 'post',
        body: JSON.stringify({
            title,
            content: textArea,
            user_name: 'gustavo.queiroz'
        })
    })

    const data = await response.json()
    window.alert(data.msg)

    document.getElementById('titleQuestion').value = ''
    document.getElementById('response').value = ''

    getQuestions()
}