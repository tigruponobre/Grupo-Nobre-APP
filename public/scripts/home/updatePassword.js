//Declearing variables
const call_update_password = document.getElementById('call_update_password')
let updateInputs = Array.from(document.querySelectorAll('.update_password .inputs input'))
let update_password_div = document.querySelector('.update_password')
const user_to_update = document.getElementById('login_input')
const old_password = document.getElementById('password_input')
const new_password = document.getElementById('new_password_input')
const confirm_new_password = document.getElementById('confirm_password_input')

call_update_password.addEventListener('click', ()=>{
    loginDiv.classList.toggle('unhide')
    update_password_div.classList.toggle('unhide')
})

async function updatePassword(){
    //Check Passwords
    if(new_password.value != confirm_new_password.value){
        new_password.classList.add('error')
        confirm_new_password.classList.add('error')
        return;
    }else{
        if(new_password.classList.contains('error')){
            new_password.classList.remove('error')
            confirm_new_password.classList.remove('error')
        }
    }

    //Do the update
    const response = await fetch(url + '/.netlify/functions/update_admin_password', {
        method: 'put',
        body: JSON.stringify({
            login: user_to_update.value,
            oldPassword: old_password.value,
            newPassword: new_password.value
        })
    })
    const data = await response.json()
    console.log(data.msg)
}