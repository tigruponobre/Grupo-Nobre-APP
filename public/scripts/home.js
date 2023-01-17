let documentation = document.querySelector('#documentations .options')
let docs = document.querySelectorAll('.doc')
docs = Array.from(docs)

for(let index in docs){
    docs[index].style.display = 'none'
}


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

let bringLogin = document.querySelector('.login')
let loginDiv = document.querySelector('.loginDiv')
let fade = document.querySelector('.fade')
bringLogin.addEventListener('click', ()=>{
    [fade, loginDiv].forEach((el)=> el.classList.toggle('unhide'))
})

document.onkeydown = (e) =>{
    if(loginDiv.classList.contains('unhide')){
        if(e.keyCode == 27){
            [fade, loginDiv].forEach((el)=> el.classList.toggle('unhide'))
        }
    }
}