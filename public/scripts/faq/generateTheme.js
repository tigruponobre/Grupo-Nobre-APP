//Show response
function showResponse(e){
    const thisImage = e.target
    thisParent = thisImage.parentElement.parentElement
    thisImage.classList.toggle('questionActivated')
    const response = [thisParent.children[1], thisParent.children[2], thisParent.children[3]]
    response.forEach(element => {
        if(element){
            element.classList.toggle('response')
        }
    })
}