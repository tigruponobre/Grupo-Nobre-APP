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

function generateTheme(event){
    console.log(event.target.textContent)
}