//Show documentations
let consultaDocs = document.querySelector('#queryDocs')
let docs = document.querySelectorAll('.doc')
docs = Array.from(docs)

//Login/Logout
let login_logout = document.querySelector('.login_logout')
async function checkLogin(){
    let token = sessionStorage.getItem('token')
    let response = await fetch(url + '/.netlify/functions/validation',{
        method: 'post',
        body: JSON.stringify({
            validationToken: token
        })
    })
    if(response.status != 200){
        login_logout.textContent = 'Administrativo'
        document.getElementById('greeting').textContent = 'Bem-vindo ao'
    }else{
        let user = sessionStorage.userName
        document.getElementById('greeting').textContent = `OLÁ ${user.split('.')[0].toUpperCase()}, VOCÊ ESTÁ NO`
        login_logout.textContent = 'Logout'
    }
}
checkLogin()

let loginDiv = document.querySelector('.loginDiv')
let fade = document.querySelector('.fade')

let inputs = Array.from(document.querySelectorAll('.inputs input'))
let loginButtonHome = document.querySelector('#loginButton')
let register = document.querySelector('#registerMessage a')
login_logout.addEventListener('click', ()=>{
    if(login_logout.textContent == 'Administrativo'){
        for(let i in inputs){
            inputs[i].removeAttribute('disabled')
        }
        loginButtonHome.removeAttribute('disabled')
        register.setAttribute('href', 'http://192.168.10.10/glpi/index.php')
        fade.classList.toggle('unhide')
        loginDiv.classList.toggle('unhide')
    }else{
        for(let i in inputs){
            inputs[i].setAttribute('disabled', '')
        }
        loginButtonHome.setAttribute('disabled', '')
        register.setAttribute('href', '')
        sessionStorage.removeItem('unauthorized')
        sessionStorage.removeItem('userName')
        sessionStorage.removeItem('token')
        checkLogin()
    }
})

document.onkeydown = (e) =>{
    if(loginDiv.classList.contains('unhide')){
        if(e.keyCode == 27){
            [fade, loginDiv].forEach((el)=> el.classList.toggle('unhide'))
        }
    }
}

fade.addEventListener('click', ()=>{
    [fade, loginDiv].forEach((el)=> el.classList.toggle('unhide'))
})

let search = document.getElementById('search')
let searchValue = ''
search.addEventListener('keypress', (key)=>{
    if(key.keyCode == 13){
        searchValue = search.value
        window.location.href = 'https://www.google.com/search?q=' + searchValue
    }
})

let lens = document.getElementById('lens')

lens.addEventListener('click', ()=>{
    searchValue = search.value
    window.location.href = 'https://www.google.com/search?q=' + searchValue
})