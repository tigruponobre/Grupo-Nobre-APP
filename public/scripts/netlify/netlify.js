//Get elements
let about = document.querySelector('#about')
let construction = document.querySelector('#construction')
let application = document.querySelector('#application')
let containers = Array.from(document.querySelectorAll('.container'))

let choicesDiv = document.querySelector('.choices')
let choices = document.querySelectorAll('.choice')

let checkbox = document.querySelector('#sandwich-check')
let x = document.querySelector('#sandwich')

let buttonDiv = document.querySelector('.back')
let backButton = document.querySelector('.backButton')
let label = document.querySelector('.backLabel')

choices[0].addEventListener('click', ()=>{
    choicesDiv.classList.toggle('disappears')
    about.classList.toggle('disappears')
    checkbox.checked = false
})
choices[1].addEventListener('click', ()=>{
    choicesDiv.classList.toggle('disappears')
    construction.classList.toggle('disappears')
    checkbox.checked = false
})
choices[2].addEventListener('click', ()=>{
    choicesDiv.classList.toggle('disappears')
    application.classList.toggle('disappears')
    checkbox.checked = false
})

x.addEventListener('click', ()=>{
    if(!checkbox.checked){
        for(let index in containers){
            if(!containers[index].classList.contains('disappears')){
                containers[index].classList.add('disappears')
            }
        }
        if(choicesDiv.classList.contains('disappears')){
            choicesDiv.classList.remove('disappears')
        }
    }
})

backButton.addEventListener('click', ()=> window.location.href = url)


backButton.addEventListener('mouseover', ()=>{
    buttonDiv.style.transform = 'translateY(-10px)'
    label.style.transform = 'translateY(-5px)'
    label.style.opacity = '1'
})
backButton.addEventListener('mouseout', ()=>{
    buttonDiv.style.transform = 'translateY(0)'
    label.style.transform = 'translateY(5px)'
    label.style.opacity = '0'
})