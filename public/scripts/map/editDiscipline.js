//Get inputs
let beforeUpdate = ''
let editCurso = document.querySelector('.editCurso')
let editTurno = document.querySelector('.editTurno')
let editDia = document.querySelector('.editDia')
let editDisciplina = document.querySelector('.editDisciplina')
let editTurma = document.querySelector('.editTurma')
let editProfessor = document.querySelector('.editProfessor')
let editSala = document.querySelector('.editSala')
let editModulo = document.querySelector('.editModulo')
let editInicio = document.querySelector('.editInicio')
let editFim = document.querySelector('.editFim')

//Function to edit some row
function editRow(event){
    let thisRowData = Array.from(event.target.parentElement.parentElement.children)

    document.getElementById('darkFade').style.display = 'flex'
    document.getElementById('editRow').style.display = 'flex'

    editCurso.value = document.getElementById('curso').value
    editTurno.value = document.getElementById('turno').value
    editDia.value = document.getElementById('dia').value
    editDisciplina.value = thisRowData[0].textContent
    editTurma.value = thisRowData[1].textContent
    editProfessor.value = thisRowData[2].textContent
    editSala.value = thisRowData[3].textContent
    editModulo.value = thisRowData[4].textContent
    editInicio.value = thisRowData[5].textContent
    editFim.value = thisRowData[6].textContent

    beforeUpdate = {
        beforeCurso: document.getElementById('curso').value,
        beforeTurno: document.getElementById('turno').value,
        beforeDia: document.getElementById('dia').value,
        beforeDisciplina: thisRowData[0].textContent
    }    
}

//Mobile edit row version
function editRowMobile(event){
    //Remove tables from screen
    document.getElementById('tables').style.display = 'none'

    //Get necessary data to update
    let thisRowData = Array.from(event.target.parentElement.parentElement.children)
    thisRowNecessaryData = []
    for(let elem of Array.from(thisRowData)){
        if(elem.classList.contains('tableData')){
            thisRowNecessaryData.push(elem)
        }
    }

    //Show edit row box
    document.getElementById('darkFade').style.display = 'flex'
    document.getElementById('editRow').style.display = 'flex'

    //Setting necessary data to variables
    editCurso.value = thisRowNecessaryData[0].textContent
    editTurno.value = thisRowNecessaryData[1].textContent
    editDia.value = thisRowNecessaryData[2].textContent
    editDisciplina.value = thisRowNecessaryData[3].textContent
    editTurma.value = thisRowNecessaryData[4].textContent
    editProfessor.value = thisRowNecessaryData[5].textContent
    editSala.value = thisRowNecessaryData[6].textContent
    editModulo.value = thisRowNecessaryData[7].textContent
    editInicio.value = thisRowNecessaryData[8].textContent
    editFim.value = thisRowNecessaryData[9].textContent

    //Saving necessary data before the update to search on DB
    beforeUpdate = {
        beforeCurso: thisRowNecessaryData[0].textContent,
        beforeTurno: thisRowNecessaryData[1].textContent,
        beforeDia: thisRowNecessaryData[2].textContent,
        beforeDisciplina: thisRowNecessaryData[3].textContent
    }    
}

//Submit edit
async function submitEdit(){
    //Get values
    let updatingProfessor = document.querySelector('.editProfessor').value.toUpperCase()
    let updatingSala = document.querySelector('.editSala').value
    let updatingModulo = document.querySelector('.editModulo').value
    let updatingInicio = document.querySelector('.editInicio').value
    let updatingFim = document.querySelector('.editFim').value

    //Destructurin beforeUpdate
    let { beforeCurso, beforeTurno, beforeDia, beforeDisciplina } = beforeUpdate
    //Fetch
    let response = await fetch(url + '/.netlify/functions/update_map', {
        method: 'put',
        body: JSON.stringify({
            curso: beforeCurso,
            turno: beforeTurno,
            dia: beforeDia,
            disciplina: beforeDisciplina,
            professor: updatingProfessor,
            sala: updatingSala,
            modulo: updatingModulo,
            inicio: updatingInicio,
            fim: updatingFim,
            token
        })
    })

    let data = await response.json()

    if (data.resposta == "Update successful."){
        window.alert('Disciplina atualizada com sucesso!')
        document.getElementById('darkFade').style.display = 'none'
        document.getElementById('editRow').style.display = 'none'
        //Bring back tables div that was removed if using phone screen
        document.getElementById('tables').style.display = 'flex'
        
        if(window.innerWidth > 680){
            searchMapDesktop(beforeCurso, beforeTurno, beforeDia)
        }else{
            searchMapMobile(beforeCurso, beforeTurno, beforeDia)
        }
    }
}

//Esq to close edit Div
window.addEventListener('keydown', event =>{
    if(event.keyCode == 27){
        //Bring back tables div that was removed if using phone screen
        document.getElementById('tables').style.display = 'flex'

        document.getElementById('darkFade').style.display = 'none'
        document.getElementById('editRow').style.display = 'none'
        document.getElementById('editCreate').style.display = 'none'
    }
})