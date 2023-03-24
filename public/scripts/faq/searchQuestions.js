const searchInput = document.getElementById('searchKeyword')

searchInput.addEventListener('keyup', (event)=>{
    event.preventDefault()
    const titles = Array.from(document.querySelectorAll('.questionHeader h2'))

    for(let question of titles){
        const questionDiv = question.parentElement.parentElement
        questionDiv.style.display = 'none'

        const questionTitle = question.textContent.toLowerCase()
        const searchValue = searchInput.value.toLowerCase()
        if(questionTitle.match(searchValue)){
            question.parentElement.parentElement.style.display = 'flex'
        }
    }
})