
async function validation() {
    const token = await sessionStorage.getItem('token')
    const permissions = await sessionStorage.getItem('permissions')
    const response = await fetch('../.netlify/functions/validation', {
        method: 'post',
        body: JSON.stringify({
            token,
            permissions
        })
    })
    if(response.status != 200) {
        sessionStorage.setItem('unauthorized', true)
        window.location = history.back()
    }else{
        document.body.style.display = 'block'
    }

}

validation()