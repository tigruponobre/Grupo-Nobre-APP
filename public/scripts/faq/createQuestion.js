//Variabels
const addQuestionButton = document.getElementById('addQuestion')
const addQuestionDiv = document.getElementById('addQuestionDiv')
const questionTitle = document.getElementById('questionTitle')
const theme = document.getElementById('selectTheme')
const unefCheck = document.getElementById('unefCheck')
const unifanCheck = document.getElementById('unifanCheck')
const unefeadCheck = document.getElementById('unefeadCheck')
const unifaneadCheck = document.getElementById('unifaneadCheck')
const unefTextArea = document.getElementById('unefTextArea')
const unifanTextArea = document.getElementById('unifanTextArea')
const unefeadTextArea = document.getElementById('unefeadTextArea')
const unifaneadTextArea = document.getElementById('unifaneadTextArea')
const bodyChildren = Array.from(document.querySelector('body').children)

addQuestionButton.addEventListener('click', ()=>{
    bodyChildren.forEach(element => {
        element.style.display = 'none'
    });
    addQuestionDiv.style.display = 'block'
})

questionTitle.addEventListener('blur', ()=>{
    questionTitle.value = questionTitle.value[0].toUpperCase() + questionTitle.value.substring(1,questionTitle.value.length)
})

unefCheck.addEventListener('click', ()=>{
    if(unefCheck.checked){
        unefTextArea.removeAttribute('disabled')
    }else{
        unefTextArea.value = ''
        unefTextArea.setAttribute('disabled', '')
    }
})
unifanCheck.addEventListener('click', ()=>{
    if(unifanCheck.checked){
        unifanTextArea.removeAttribute('disabled')
    }else{
        unifanTextArea.value = ''
        unifanTextArea.setAttribute('disabled', '')
    }
})
unefeadCheck.addEventListener('click', ()=>{
    if(unefeadCheck.checked){
        unefeadTextArea.removeAttribute('disabled')
    }else{
        unefeadTextArea.value = ''
        unefeadTextArea.setAttribute('disabled', '')
    }
})
unifaneadCheck.addEventListener('click', ()=>{
    if(unifaneadCheck.checked){
        unifaneadTextArea.removeAttribute('disabled')
    }else{
        unifaneadTextArea.value = ''
        unifaneadTextArea.setAttribute('disabled', '')
    }
})

async function addNewQuestion(){
    if(theme.value == 'not_selected'){
        theme.style.border = '1px solid #dd3535'
        window.alert('Selecione o tema!')
    }else{
        theme.style.border = 'none'

        const response = await fetch(url + '/.netlify/functions/create_question', {
            method: 'post',
            body: JSON.stringify({
                theme: theme.value,
                title: questionTitle.value,
                answer_unef: unefTextArea.value,
                answer_unifan: unefTextArea.value,
                answer_unefead: unefeadTextArea.value,
                answer_unifanead: unifaneadTextArea.value,
                user_name: sessionStorage.getItem('logged')
            })
        })

        if(response.status == 201){
            window.alert('Pergunta cadastrada com sucesso!')
        }else{
            window.alert('Erro ao cadastrar, entre em contato com o administrador.')
        }
    }
}

