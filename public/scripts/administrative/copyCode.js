function copyCode(event){
    const text = event.target.parentElement.children[0].textContent
    const textArea = document.createElement("textarea")
    document.body.appendChild(textArea)
    textArea.value = text
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
}