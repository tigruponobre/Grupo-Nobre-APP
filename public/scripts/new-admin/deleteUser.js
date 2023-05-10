async function deleteUser(event){
    const name = event.target.parentElement.parentElement.children[0].textContent
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o usuário ${name}?`)
    if(!confirmDelete) return
    const token = sessionStorage.getItem('token')
    const response = await fetch('../.netlify/functions/delete_admin', {
        method: 'delete',
        body: JSON.stringify({
            name,
            token
        })
    })
    if(response.status == 200){
        window.alert(`Usuário ${name} deletado com sucesso.`)
        listUsersDiv()
    }else{
        window.alert('Erro ao deletar usuário.')
    }
}