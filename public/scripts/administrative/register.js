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

//Get elemets
let passwordInput = document.getElementById('password')
let confirmPasswordInput = document.getElementById('confirmPassword')
let notification = document.getElementById('notification')
let registrateButton = document.getElementById('registrate')
let url = document.URL.split('/').splice('0',3).join('/')

async function createUser(){
    //Get values
    let firstName = document.getElementById('firstName').value
    let lastName = document.getElementById('lastName').value
    let password = passwordInput.value
    let confirmPassword = confirmPasswordInput.value

    //Check if passwords match
    if(password != confirmPassword){
        passwordInput.style.borderColor = 'rgb(200, 82, 115)'
        confirmPasswordInput.style.borderColor = 'rgb(200, 82, 115)'
        notification.innerHTML = 'Senhas não conferem!'
        notification.style.borderColor = 'rgb(200, 82, 115)'
    }else{
        let login = firstName.toLowerCase() + '.' + lastName.toLowerCase()
        let response = await fetch(url + '/.netlify/functions/create',{
            method: 'post',
            body: JSON.stringify({
                login,
                password
            })
        })
        let data = await response.json()
        if (data.resposta == 'User created successfully'){
            notification.style.color = 'rgb(44, 117, 44)'
            notification.innerHTML = `Usuário "${login}" criado com sucesso!`
            document.getElementById('firstName').value = ''
            document.getElementById('lastName').value = ''
            document.getElementById('password').value = ''
            document.getElementById('confirmPassword').value = ''
            setTimeout(() => {
                notification.innerHTML = ''
                passwordInput.style.borderColor = '#2D73B4'
                confirmPasswordInput.style.borderColor = '#2D73B4'
            }, 5000);
        }
    }
}

