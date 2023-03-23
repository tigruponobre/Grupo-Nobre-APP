function activate(event){
    const thisArrow = event.target
    const thisContent = thisArrow.parentElement.parentElement.parentElement.children[1]
    thisArrow.classList.toggle('arrow-activate')
    thisContent.classList.toggle('questionContentActivate')
    thisContent.classList.toggle('questionContentNotActivate')
}