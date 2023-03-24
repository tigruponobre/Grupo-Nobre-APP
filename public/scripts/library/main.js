let buttonDiv = document.querySelector('.back')
let backButton = document.querySelector('.backButton')
let label = document.querySelector('.backLabel')

backButton.addEventListener('click', ()=> window.location.href = url + '/pages/administrativo')

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