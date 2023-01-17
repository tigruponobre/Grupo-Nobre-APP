let getToken = sessionStorage.getItem('token')
const url = sessionStorage.url

if(!getToken){
    sessionStorage.setItem('unauthorized', true)
    window.location = url
}else{
    async function validation(){
        let response = await fetch(url + '/.netlify/functions/validation',{
            method: 'post',
            body: JSON.stringify({
                tokenValidation: getToken
            })
        })
        if(response.status != 200){
            sessionStorage.setItem('unauthorized', true)
            window.location = url
        }
    }
}