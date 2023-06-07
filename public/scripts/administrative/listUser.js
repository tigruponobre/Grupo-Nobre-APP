let getUsers = []

async function listUsers(){
    getUsers = []
    const response = await fetch('../.netlify/functions/search_admins')
    const data = await response.json()

    data.users.forEach(user => {
        //Get user name
        let login = user.login.split('.')
        let username
        for(i=0; i<2; i++){
            const firstLetter = login[i][0].toUpperCase()
            login[i] = firstLetter + login[i].substring(1,login[i].length)
            username = login.join(' ')
        }

        //Push usr
        getUsers.push({
            username,
            login: user.login,
            criador: user.criador,
            criacao: user.data_de_criacao,
            permissions: user.permissions
        })
    })
}

listUsers()