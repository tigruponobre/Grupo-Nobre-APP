let menuItems = Array.from(document.querySelectorAll('#menu li'))
let circles = Array.from(document.querySelectorAll('#circles li'))

for (let index in menuItems){
    menuItems[index].addEventListener('click', (event)=>{
        for (let newIndex in menuItems){
            menuItems[newIndex].classList.remove('active')
            circles[newIndex].classList.remove('active')
        }
        event.target.classList.add('active')
        if(event.target.textContent == 'DOCUMENTAÇÕES'){
            circles[0].classList.add('active')
        }
        else if(event.target.textContent == 'USUÁRIOS'){
            circles[1].classList.add('active')
        }
        else if(event.target.textContent == 'CADASTRO'){
            circles[2].classList.add('active')
        }
    })
}
