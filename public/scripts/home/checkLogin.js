//Declearing variables
const login_logout = document.querySelector('.login_logout')

//Check login
function checkLogin(){
    //Get logged user
    const user = sessionStorage.getItem('logged')

    //Verifying, changing page greeting and button login_logout
    if(user){
        document.getElementById('greeting').textContent = `OLÁ ${user.split('.')[0].toUpperCase()}, VOCÊ ESTÁ NO`
        login_logout.textContent = 'Logout'
    }else{
        document.getElementById('greeting').textContent = 'Bem-vindo ao'
        login_logout.textContent = 'Login'
    }
}
checkLogin()

//Check user is authorized
if(sessionStorage.getItem('unauthorized') == 'true'){
    let authNotification = document.createElement('div')
    authNotification.setAttribute('class', 'authentication authNotificationMove')
    authNotification.innerHTML = '<img src="./img/icons/warning.png" alt="warning" width="20px"><h3>Você não está autorizado a visualizar aquela página, por gentileza, efetue o <b id="notificationLogin">login como administrador!</b></h3>'
    document.querySelector('body').insertBefore(authNotification, document.querySelector('header'))
}