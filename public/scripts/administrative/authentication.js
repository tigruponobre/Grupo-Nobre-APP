
async function validation() {
    const token = await sessionStorage.getItem('token')
    const permissions = await sessionStorage.getItem('permissions')
    const response = await fetch(url + '/.netlify/functions/validation', {
        method: 'post',
        body: JSON.stringify({
            token,
            permissions
        })
    })
    if (response.status != 200) {
        sessionStorage.setItem('unauthorized', true)
        window.location = url
    }
}

validation()