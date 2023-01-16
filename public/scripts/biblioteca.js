let netlify = document.getElementById('netlify')
let api = document.getElementById('api')

let ntl_container = document.getElementById('netlify_container')
let api_container = document.getElementById('api_container')

api.addEventListener('click', ()=>{
    ntl_container.classList.add('apaga')
        ntl_container.style.display = 'none'
        api_container.style.display = 'block'
        api_container.classList.add('aparece')
        api_container.style.opacity = '1'
})

netlify.addEventListener('click', ()=>{
    api_container.classList.add('apaga')
        api_container.style.display = 'none'
        ntl_container.style.display = 'block'
        ntl_container.classList.add('aparece')
        ntl_container.style.opacity = '1'
})

let mobileCSS = document.createElement('link')
mobileCSS.setAttribute('rel', 'stylesheet')
mobileCSS.setAttribute('id', 'mobileCSS')
mobileCSS.setAttribute('href', '../css/general/mobile.css')

if(window.innerWidth < 768){
    document.querySelector('head').appendChild(mobileCSS)
    document.querySelector('#title h1').innerText = 'MINHA BIBLIOTECA'
}
