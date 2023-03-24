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