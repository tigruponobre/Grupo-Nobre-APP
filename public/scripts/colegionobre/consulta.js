//Dots and bars on inputs
const inputCPF = document.getElementById('cpf')

inputCPF.addEventListener('keyup', (event)=>{
    if(inputCPF.value.length == 3 && event.keyCode != 8){
        inputCPF.value = inputCPF.value + '.'
    }
    if(inputCPF.value.length == 7 && event.keyCode != 8){
        inputCPF.value = inputCPF.value + '.'
    }
    if(inputCPF.value.length == 11 && event.keyCode != 8){
        inputCPF.value = inputCPF.value + '-'
    }
})

const inputNascimento = document.getElementById('dtnascimento')

inputNascimento.addEventListener('keyup', ()=>{
    if(inputNascimento.value.length == 2 && event.keyCode != 8){
        inputNascimento.value = inputNascimento.value + '/'
    }
    if(inputNascimento.value.length == 5 && event.keyCode != 8){
        inputNascimento.value = inputNascimento.value + '/'
    }
    if(event.keyCode == 13){
        searchInfo()
    }
})


//Button new search
const consultBox = document.getElementById('consulta')
const resultBox = document.getElementById('resultado')

function newSearch(){
    resultBox.style.display = 'none'
    consultBox.style.display = 'flex'
    inputCPF.value = ''
    inputNascimento.value = ''
}


async function searchInfo(){
    const consultButton = document.getElementById('consult')
    consultButton.textContent = 'Aguarde...'
    let reqCPF = inputCPF.value.replace('.','').replace('.','').replace('-','')
    const response = await fetch('http://localhost:8888/.netlify/functions/searchstudent', {
        method: 'post',
        body: JSON.stringify({
            cpf: reqCPF,
            dtnascimento: inputNascimento.value
        })
    })
    const data = await response.json()
    setTimeout(() => {
        consultButton.textContent = 'Consultar'
    }, 1000);
    
    if(response.status == 200){
        document.getElementById('notification').style.display = 'none'
        consultBox.style.display = 'none'
        resultBox.style.display = 'flex'
        let nome = document.getElementById('nome')
        let registro = document.getElementById('registro')
        nome.innerHTML = `<img class="idIcon" src="../img/icons/rosto.png" alt="rosto" width="60px"/>${data.resposta.nome}`
        registro.innerHTML = `<img class="idIcon" src="../img/icons/cracha.png" alt="cracha" width="60px"/>${data.resposta.ra}`
    }else{
        setTimeout(() => {
            document.getElementById('notification').style.display = 'block'
        }, 1000);
    }
}