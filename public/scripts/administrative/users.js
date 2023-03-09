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
    let response = await fetch(url + '/.netlify/functions/getUsers')
    let data = await response.json()
    let users = data.resposta

    await users.forEach(element => {
        let userData = document.createElement('li')
        userData.innerHTML = `${element}<img class="deleteUsers" src="../img/icons/trash.png" width="25px"/>`
        usersUl.appendChild(userData)
    })

    //DELETE USERS
    let trash = Array.from(document.querySelectorAll(".deleteUsers"))
    trash.forEach(element => {
        element.addEventListener('click', async (e)=>{
            // console.log(e.target.parentElement.textContent)
            let gettingUserName = e.target.parentElement.textContent
            if(window.confirm(`Deseja excluir o usuário de ${gettingUserName}?`)){
                let response = await fetch(url + '/.netlify/functions/delete', {
                    method: 'delete',
                    body: JSON.stringify({
                        name: gettingUserName,
                        token: await sessionStorage.getItem('token')
                    })
                })
                if(response.status == 200){
                    window.alert('Usuário deletado com sucesso!')
                    getUsers()
                }else{
                    window.alert('Erro ao deletar usuário, contate o desenvolvedor.')
                }
            }
        })
    })
}

getUsers()
