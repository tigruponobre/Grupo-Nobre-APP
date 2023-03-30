//Declearing variables
const call_update_password = document.getElementById('call_update_password')
let updateInputs = Array.from(document.querySelectorAll('.update_password .inputs input'))
let update_password_div = document.querySelector('.update_password')

call_update_password.addEventListener('click', ()=>{
    loginDiv.classList.toggle('unhide')
    update_password_div.classList.toggle('unhide')
})