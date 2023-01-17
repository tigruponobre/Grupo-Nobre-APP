//Show documentations
let documentation = document.querySelector('#documentations .options')
let docs = document.querySelectorAll('.doc')
docs = Array.from(docs)

//Set url in sessionStorage
sessionStorage.setItem('url', document.URL.split('/').splice('0',3).join('/'))
const url = sessionStorage.url


let count = 0
documentation.addEventListener('click', ()=>{
    for(let index in docs){
        docs[index].classList.toggle('appears')
        if(docs[index].classList.contains('appears')){
            docs[index].style.display = 'flex'
        }
        if(count >= 1){
            docs[index].classList.toggle('disappears')
        }
    }
    count += 1
})


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
        login_logout.textContent = 'Login'
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
login_logout.addEventListener('click', ()=>{
    if(login_logout.textContent == 'Login'){
        [fade, loginDiv].forEach((el)=> el.classList.toggle('unhide'))
    }else{
        document.getElementById('greeting').textContent = 'Bem-vindo ao'
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('unauthorized')
        login_logout.textContent = 'Login'
    }
})

document.onkeydown = (e) =>{
    if(loginDiv.classList.contains('unhide')){
        if(e.keyCode == 27){
            [fade, loginDiv].forEach((el)=> el.classList.toggle('unhide'))
        }
    }
}