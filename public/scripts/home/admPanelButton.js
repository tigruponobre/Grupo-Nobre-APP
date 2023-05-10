//Admin Panel
let adminButton = document.getElementById('admin')
let permissions = sessionStorage.getItem('permissions')
if(permissions == 'room-map-unef'){
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/mapa-admin-unef')
}else if(permissions == 'room-map-unifan'){
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/mapa-admin-unifan')
}else if(permissions == 'faq'){
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/faq-admin')
}else{
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/new-admin')
}