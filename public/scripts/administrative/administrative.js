//GET ELEMENTS
let main = document.getElementsByTagName('main')[0]
let menuItems = Array.from(document.querySelectorAll('#menu li'))
let circles = Array.from(document.querySelectorAll('#circles li'))
let documentations = document.getElementById('docs')
let consultUsers = document.getElementById('consultUsers')

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
            documentations.style.display = 'block'
        }
        else if(event.target.textContent == 'USUÁRIOS'){
            circles[1].classList.add('active')
            documentations.style.display = 'none'
            consultUsers.style.display = 'block'
        }
        else if(event.target.textContent == 'CADASTRO'){
            circles[2].classList.add('active')
            consultUsers.style.display = 'none'
            documentations.style.display = 'none'
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


//Search users
let search = document.getElementById('search')
search.addEventListener('keyup', (event)=>{
    event.preventDefault()
    let getUsersLi = Array.from(document.querySelectorAll('#users ul li'))
    let searchValue = search.value
    for (let user of getUsersLi){
        user.classList.add('userDisappears')
    }
    for (let user of getUsersLi){
        if(user.textContent.toLowerCase().match(searchValue.toLowerCase())){
            user.classList.remove('userDisappears')
        }
    }
})