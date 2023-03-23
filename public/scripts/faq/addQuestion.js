const closeButton = document.getElementById('close')
const addQuestion = document.getElementById('addQuestion')
const showAddQuestion = document.getElementById('showAddQuestion')

showAddQuestion.addEventListener("click", ()=>{
    addQuestion.style.display = 'block'
})

closeButton.addEventListener("click", ()=>{
    addQuestion.style.display = 'none'
})