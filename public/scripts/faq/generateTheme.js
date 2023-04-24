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

    console.log(data)
}