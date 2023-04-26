//Declearing variables
const loginDiv = document.querySelector('.loginDiv')
const fade = document.querySelector('.fade')

const loginInputs = Array.from(document.querySelectorAll('.card .inputs input'))
const loginButtonHome = document.querySelector('#loginButton')
const register = document.querySelector('#registerMessage')

//Oppening login div
login_logout.addEventListener('click', ()=>{
    //If login_logout == Login -> Open login div -- Else -> Log out
    if(login_logout.textContent == 'Login'){
        //Remove disable attribute from loginInputs in login div
        for(let i in loginInputs){
            loginInputs[i].removeAttribute('disabled')
        }
        loginButtonHome.removeAttribute('disabled')

        //Adding url to "Solicite registro"
        register.setAttribute('href', 'http://192.168.10.10/glpi/index.php')

        //Oppening login div and showing fade
        fade.classList.toggle('unhide')
        loginDiv.classList.toggle('unhide')
    }else{
        //Log out

        //Disabling loginInputs
        for(let i in loginInputs){
            loginInputs[i].setAttribute('disabled', '')
        }
        loginButtonHome.setAttribute('disabled', '')

        //Removing url of "Solicite registro"
        register.setAttribute('href', '')

        //Removing sessionStorage Attributes
        sessionStorage.removeItem('unauthorized')
        sessionStorage.removeItem('logged')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('permissions')

        //Check login again
        checkLogin()
    }
})

//Closing login div with esc or click outside the card
document.onkeydown = (e) =>{
    if(e.keyCode == 27){
        [fade, loginDiv, update_password_div].forEach((el)=> el.classList.remove('unhide'))
    }
}

fade.addEventListener('click', ()=>{
    [fade, loginDiv, update_password_div].forEach((el)=> el.classList.remove('unhide'))
})

//Get DOM elemnts
const loginButton = document.getElementById('loginButton')
const notification = document.getElementById("notification")
const inputLogin = document.getElementById("loginInput")
const inputPass = document.getElementById("passwordInput")

//Envent listener on input password to click enter
inputPass.addEventListener('keypress', e => {
    if(e.key === 'Enter'){
        getLogged()
    }
})

//Function to login in
async function getLogged(){
    //Changing button text to make user await
    loginButton.textContent = 'Aguarde...'

    //Restart border-color
    if(inputLogin.classList.contains('error')){
        inputLogin.classList.remove('error')
    }
    if(inputPass.classList.contains('error')){
        inputPass.classList.remove('error')
    }

    //Get data to post
    let login = inputLogin.value
    let password = inputPass.value

    //Do the request
    let response = await fetch(url + '/.netlify/functions/login',{
        method: 'post',
        body: JSON.stringify({
            login,
            password,
            url
        })
    })

    let data = await response.json()

    //Bringing back button text
    loginButton.textContent = 'Login'

    //Check response
    if(response.status != 200){
        if(data.resposta == 'Admin not found.'){
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
        await sessionStorage.setItem('token', data.token)
        await sessionStorage.setItem('unauthorized', false)
        await sessionStorage.setItem('logged', login)
        await sessionStorage.setItem('permissions', data.permissions)
        console.log(data.need_to_change)
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
            if(data.permissions == 'super-admin') window.location.href = url + '/pages/administrativo'
            else if (data.permissions == 'faq') window.location.href = url + '/pages/faq-admin'
            else if (data.permissions == 'room-map') window.location.href = url + '/pages/mapa-admin'
        },1500)
    }
}

//Add function to login on button
loginButton.addEventListener('click', getLogged)