async function createUser(){
    //Get data
    const firstName = document.getElementById('firstName').value.replace(' ', '').toLowerCase()
    const lastName = document.getElementById('lastName').value.replace(' ', '').toLowerCase()
    const pass = document.getElementById('pass').value
    const confirmPass = document.getElementById('confirmPass').value
    const permissions = document.getElementById('permissions').value
    const token = await sessionStorage.getItem('token')
    const newDate = new Date()
    const currentDate = await `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`
    const creator = await sessionStorage.getItem('logged')

    //Check permissons select
    if(permissions == 'not-selected'){
        window.alert('Selecione as permissões do usuário.')
        return
    }

    //Check if passwords matches
    if(pass != confirmPass){
        window.alert('Senhas não compatíveis.')

        //Turn password's border bottom red
        document.getElementById('pass').style.borderBottom = '2px solid #dd5050'
        document.getElementById('confirmPass').style.borderBottom = '2px solid #dd5050'
        return
    }

    //Create User
    const response = await fetch('../.netlify/functions/create_admin', {
        method: 'post',
        body: JSON.stringify({
            login: firstName + '.' + lastName,
            password: pass,
            permissions,
            currentDate,
            creator,
            token
        })
    })
    
    //Response
    if(response.status == 302){
        window.alert('Usuário já existe.')
        return
    }else if(response.status == 201){
        window.alert(`Usuário ${firstName + '.' + lastName} criado com sucesso!`)
    }else{
        window.alert('Erro de servidor, contate o desenvolvedor.')
        return
    }

    //Clean values
    document.getElementById('firstName').value = ''
    document.getElementById('lastName').value = ''
    document.getElementById('pass').value = ''
    document.getElementById('confirmPass').value = ''
    document.getElementById('permissions').value = 'not-selected'
}   