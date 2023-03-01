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

//GET USERS
let usersUl = document.querySelector('#users ul')
async function getUsers(){
    usersUl.innerHTML = ''
    let response = await fetch('http://localhost:8888' + '/.netlify/functions/getUsers')
    let data = await response.json()
    let users = data.resposta

    users.forEach(element => {
        let userData = document.createElement('li')
        userData.innerHTML = element
        usersUl.appendChild(userData)
    })
}