const loginButton = document.getElementById('loginButton')
sessionStorage.setItem('url', document.URL.split('/').splice('0',3).join('/'))
const url = sessionStorage.url

const notification = document.getElementById("notification")
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
    const login = inputLogin.value
    const password = inputPass.value

    let response = await fetch(url + '/.netlify/functions/login' ,{
        method: 'post',
        body: JSON.stringify({
            login: login,
            password: password
        })
    })
    let data = await response.json()
    loginButton.textContent = 'Login'
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
        window.location = url + '/pages/biblioteca'
    }
}

loginButton.addEventListener('click', getLogged)

if(sessionStorage.getItem('unauthorized') == 'true'){
    window.alert('You are not authorized to view that page.')
}

if(window.innerWidth < 768){
    document.querySelector('#card').style.width = '100%'
}