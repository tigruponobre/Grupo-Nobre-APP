async function listUser(){
    const response = await fetch('../.netlify/functions/search_admins')
    const data = await response.json()

    //For each user do...
    data.users.forEach(user => {
        const newCard = document.createElement('div')      
        newCard.setAttribute('class', 'userCard')

        //Get user name
        let login = user.login.split('.')
        let username
        for(i=0; i<2; i++){
            const firstLetter = login[i][0].toUpperCase()
            login[i] = firstLetter + login[i].substring(1,login[i].length)
            username = login.join(' ')
        }

        //Generate card
        newCard.innerHTML =
        `<h2>${username}</h2>
        <div class="info">
            <h5><b class="purple">Usuário:</b></h5>
            <p>${user.login}</p>
        </div>
        <div class="info">
            <h5><b class="purple">Criado por:</b></h5>
            <p>${user.criador}</p>
        </div>
        <div class="info">
            <h5><b class="purple">Criado em:</b></h5>
            <p>${user.data_de_criacao}</p>
        </div>
        <div class="delete">
            <button class="deleteUser" onclick="deleteUser(event)">Deletar usuário</button>
        </div>`

        if(user.permissions == 'admin-master'){
            document.getElementById('masters').appendChild(newCard)
        }else if(user.permissions == 'room-map-unef'){
            document.getElementById('room-map-unef').appendChild(newCard)
        }else if(user.permissions == 'room-map-unifan'){
            document.getElementById('room-map-unifan').appendChild(newCard)
        }else if(user.permissions == 'faq'){
            document.getElementById('faq').appendChild(newCard)
        }
    })
}