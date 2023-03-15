
async function validation() {
    const getToken = await sessionStorage.getItem('token')
    const permissions = await sessionStorage.getItem('permissions')
    const response = await fetch(url + '/.netlify/functions/validation', {
        method: 'post',
        body: JSON.stringify({
            validationToken: getToken,
            permissions
        })
    })
    if (response.status != 200) {
        sessionStorage.setItem('unauthorized', true)
        window.location = url
    }
}

validation()