if(window.visualViewport.width < 768){
    document.querySelector('body').style.backgroundPosition = 'left'
    document.querySelector('body').style.overflowX = 'hidden'
    document.querySelector('nav').style.justifyContent = 'center'
    document.querySelector('nav ul').style.gap = '20%'
    document.querySelector("#logodiv").style.margin = '0'
    document.querySelector("#logodiv").style.display = 'flex'
    document.querySelector("#logodiv").style.justifyContent = 'center'
    document.querySelector("#title").style.textAlign = 'center'
    document.querySelector("#title").style.marginTop = '10%'
    document.querySelector("#title").style.marginTop = '10%'
    document.querySelector("#title").style.borderRight = '2px solid #fff'
    document.querySelector("#title").style.marginRight = '5%'
    document.querySelector("#title").style.margin = '10% 5%'
    document.querySelector("#container").style.maxHeight = '55vh'
    let options = Array.from(document.querySelectorAll(".options"))
    
    for(let index in options){
        options[index].style.maxWidth = '100%'
        options[index].style.marginLeft = '0'
        options[index].style.position = 'relative'
        options[index].style.left = '10%'

        
        options[index].style.marginTop = '5%'
    }

    let docs = Array.from(document.querySelectorAll('.doc'))

    for(let index in docs){
        docs[index].style.marginLeft = '45%'
    }
    document.querySelector('#left-side #title > h1').style.fontSize = '2em'
    document.querySelector("#copy").style.fontSize = '12px'
}