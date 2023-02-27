//GET ELEMENTS
let main = document.getElementsByTagName('main')[0]
let menuItems = Array.from(document.querySelectorAll('#menu li'))
let circles = Array.from(document.querySelectorAll('#circles li'))
let documentations = document.getElementById('docs')

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
            documentations.style.display = 'block'
        }
        else if(event.target.textContent == 'USUÁRIOS'){
            circles[1].classList.add('active')
        }
        else if(event.target.textContent == 'CADASTRO'){
            circles[2].classList.add('active')
        }
    })
}

//GET USERS
let usersUl = document.querySelector('#users ul')
async function getUsers(){
    let response = await fetch('http://localhost:8888' + '/.netlify/functions/getUsers')
    let data = await response.json()
    let users = data.resposta

    users.forEach(element => {
        let userData = document.createElement('li')
        userData.innerHTML = element
        usersUl.appendChild(userData)
    })
}
getUsers()