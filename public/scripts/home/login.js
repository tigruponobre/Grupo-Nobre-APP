const loginButton = document.getElementById('loginButton')

let notification = document.getElementById("notification")
const inputLogin = document.getElementById("loginInput")
const inputPass = document.getElementById("passwordInput")

let contador = 0

inputPass.addEventListener('keypress', e => {
    if(e.key === 'Enter'){
        getLogged()
    }
})

async function getLogged(){
    //Wait for response
    if(contador < 1){
        loginButton.textContent = 'Aguarde...'
        contador += 1
    }

    //Restart border-color
    if(inputLogin.classList.contains('error')){
        inputLogin.classList.remove('error')
    }
    if(inputPass.classList.contains('error')){
        inputPass.classList.remove('error')
    }

    //Get frontend info
    let login = inputLogin.value
    let password = inputPass.value

    let response = await fetch(url + '/.netlify/functions/login',{
        method: 'post',
        body: JSON.stringify({
            login: login,
            password: password
        })
    })
    let data = await response.json()
    loginButton.textContent = 'Administrativo'
    if(response.status != 200){
        if(data.resposta == 'User not found.'){
            if(notification.innerText){
                notification.classList.add('bounce')
                notification.classList.remove('notifyAnimation')
                setTimeout(() => {
                    notification.classList.remove('bounce')
                }, 1000);
            }else{
                notification.classList.add('notifyAnimation')
            }
            notification.innerText = 'Usuário inexistente!'
            notification.style.display = 'block'
            inputLogin.classList.add('error')
            inputPass.classList.add('error')
        }else 
        if(data.resposta == 'Incorrect password.'){
            if(notification.innerText){
                notification.classList.add('bounce')
                notification.classList.remove('notifyAnimation')
                setTimeout(() => {
                    notification.classList.remove('bounce')
                }, 1000);
            }else{
                notification.classList.add('notifyAnimation')
            }
            notification.innerText = 'Senha incorreta!'
            notification.style.display = 'block'
            inputPass.classList.add('error')
        }
    }else{
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('unauthorized', false)
        sessionStorage.setItem('userName', login)
        checkLogin()
        notification.innerText = 'Login efetuado com sucesso!'
        notification.style.color = '#32be56'
        notification.style.display = 'block'
        notification.classList.add('bounce')
        notification.classList.remove('notifyAnimation')
        setTimeout(() => {
            notification.classList.remove('bounce')
        }, 1000);
        setTimeout(()=>{
            inputLogin.value = '' 
            inputPass.value = ''
            notification.style.display = 'none'
            document.querySelector('.fade').classList.toggle('unhide')
            document.querySelector('.loginDiv').classList.toggle('unhide')
            if(sessionStorage.unauthorized == 'true'){
                document.querySelector('.authentication').remove()
            }
        },1500)
    }
}

loginButton.addEventListener('click', getLogged)

if(sessionStorage.getItem('unauthorized') == 'true'){
    let authNotification = document.createElement('div')
    authNotification.setAttribute('class', 'authentication authNotificationMove')
    authNotification.innerHTML = '<img src="./img/icons/warning.png" alt="warning" width="20px"><h3>Você não está autorizado a visualizar aquela página, por gentileza, efetue o <b id="notificationLogin">login!</b></h3>'
    document.querySelector('body').insertBefore(authNotification, document.querySelector('header'))
}