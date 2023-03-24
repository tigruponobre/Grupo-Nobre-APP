//Admin Panel
const adminButton = document.getElementById('admin')
const permissions = sessionStorage.getItem('permissions')
if(permissions == 'room-map'){
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/mapa-admin')
}else if(permissions == 'faq'){
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/base-de-conhecimento')
}else{
    adminButton.addEventListener('click', ()=> window.location.href = url + '/pages/administrativo')
}