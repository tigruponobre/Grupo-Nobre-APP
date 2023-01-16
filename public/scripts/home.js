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
            if(docs[index].classList.contains('disappears')){
                setTimeout(()=>{
                    docs[index].style.display = 'none'
                }, 950)
            }
        }
    }
    count += 1
})


// fatores.addEventListener('click', ()=>{
//     let audio = document.createElement('audio')
//     audio.setAttribute('controls','')
//     audio.setAttribute('autoplay','')
//     audio.setAttribute('style','display: none;')
//     audio.innerHTML = '<source src="fatores.ogg" type="audio/ogg">'

//     right.appendChild(audio)
// })

