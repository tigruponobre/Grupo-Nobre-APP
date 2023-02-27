//GET ELEMENTS
let main = document.getElementsByTagName('main')[0]
let menuItems = Array.from(document.querySelectorAll('#menu li'))
let circles = Array.from(document.querySelectorAll('#circles li'))
let documentations = document.getElementById('docs')
let consultUsers = document.getElementById('consultUsers')
let register = document.getElementById('register')

//SELECT MENU BUTTON
for (let index in menuItems){
    menuItems[index].addEventListener('click', (event)=>{
        //Remove main
        main.style.display = 'none';

        for (let newIndex in menuItems){
            menuItems[newIndex].classList.remove('active')
            circles[newIndex].classList.remove('active')
        }
        event.target.classList.add('active')
        if(event.target.textContent == 'DOCUMENTAÇÕES'){
            circles[0].classList.add('active')
            consultUsers.style.display = 'none'
            register.style.display = 'none'
            documentations.style.display = 'block'
        }
        else if(event.target.textContent == 'USUÁRIOS'){
            getUsers()
            circles[1].classList.add('active')
            documentations.style.display = 'none'
            register.style.display = 'none'
            consultUsers.style.display = 'block'
        }
        else if(event.target.textContent == 'CADASTRO'){
            circles[2].classList.add('active')
            consultUsers.style.display = 'none'
            documentations.style.display = 'none'
            register.style.display = 'block'
        }
    })
}