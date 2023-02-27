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