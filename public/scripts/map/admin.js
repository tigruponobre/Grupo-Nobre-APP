//Give all selects the same eventListener
[document.getElementById('curso'), document.getElementById('turno'), document.getElementById('dia')].forEach(element => {
    element.addEventListener('change', ()=>{
        let checkSelects = document.getElementById('curso').value != 'curso' && document.getElementById('turno').value != 'turno' && document.getElementById('dia').value != 'dia'
        if(checkSelects && window.innerWidth > 680) {
            searchMapDesktop(document.getElementById('curso').value, document.getElementById('turno').value, document.getElementById('dia').value)
        }else if(checkSelects && window.innerWidth <= 680){
            searchMapMobile(document.getElementById('curso').value, document.getElementById('turno').value, document.getElementById('dia').value)
        }
    })
});

//url
const url = document.URL.split('/').splice('0',3).join('/')

async function searchMapDesktop(curso, turno, dia){
    //Reset table
    document.getElementById('myTable').innerHTML = 
    `<tr>
    <th>CURSO</th>
    <th>TURNO</th>
    <th>DIA DA SEMANA</th>
    <th>DISCIPLINA</th>
    <th>TURMA</th>
    <th>PROFESSOR(A)</th>
    <th>SALA</th>
    <th>MÓDULO</th>
    <th>INÍCIO</th>
    <th>FIM</th>
    <th>EDITAR</th>
    </tr>`

    //Declearing information variable
    let information = ''

    //Fetch
    const response = await fetch(url + '/.netlify/functions/searchmap', {
        method: 'post',
        body: JSON.stringify({
            curso: curso,
            turno: turno,
            dia: dia
        })
    })
    const data = await response.json()
    if (response.status == 200){
        information = await data.information
        if(!information){
            document.getElementById('myTable').innerHTML =
            `<tr>
            <th>NÃO ENCONTRADO</th>
            </tr>`
            return
        }
    }else{
        document.getElementById('myTable').innerHTML =
        `<tr>
        <th>NÃO ENCONTRADO</th>
        </tr>`
        return
    }

    //Updating table
    for (let elem of Array.from(Object.keys(information))){
        //New Row
        let newRow = document.createElement('tr')

        //Information that doesn't came in the fetch response
        //Curso from select
        let newCurso = document.createElement('td')
        newCurso.innerText = document.getElementById('curso').value
        newRow.appendChild(newCurso)

        //Turno from select
        let newTurno = document.createElement('td')
        newTurno.innerText = document.getElementById('turno').value
        newRow.appendChild(newTurno)

        //Dia from select
        let newDia = document.createElement('td')
        newDia.innerText = document.getElementById('dia').value
        newRow.appendChild(newDia)

        //Turma from response
        let newTurma = document.createElement('td')
        newTurma.innerText = elem
        newRow.appendChild(newTurma)

        //Information in JSON from the request
        for (let key of Array.from(Object.keys(information[elem]))){
            let newData = document.createElement('td')
            newData.innerText = information[elem][key]
            newRow.appendChild(newData)
        }

        //Edit button
        let editButton = document.createElement('td')
        editButton.innerHTML = '<button class="editButton" onClick="editRow(event)">EDITAR</button>'
        newRow.appendChild(editButton)

        //Adding on the table
        document.getElementById('myTable').appendChild(newRow)
    }
}

async function searchMapMobile(curso, turno, dia){
    //Declearing information variable
    let information = ''

    //Fetch
    const response = await fetch(url + '/.netlify/functions/searchmap', {
        method: 'post',
        body: JSON.stringify({
            curso: curso,
            turno: turno,
            dia: dia
        })
    })
    const data = await response.json()
    if (response.status == 200){
        information = await data.information
        document.getElementById('tables').innerHTML = ''
    }else{
        document.getElementById('tables').innerHTML =
        `<table>
        <tr>
        <th>NÃO ENCONTRADO</th>
        </tr>
        </table>`
        return
    }

    for (let elem of Array.from(Object.keys(information))){
        //Getting info
        let newCurso = document.getElementById('curso').value
        let newTurno = document.getElementById('turno').value
        let newDia = document.getElementById('dia').value
        let newDisciplina = elem
        let newTurma = information[elem]['TURMA']
        let newProfessor = information[elem]['PROFESSOR']
        let newSala = information[elem]['SALA']
        let newModulo = information[elem]['MODULO']
        let newInicio = information[elem]['INICIO']
        let newFim = information[elem]['FIM']

        let newTable = document.createElement('table')
        newTable.setAttribute('class', 'newTable')
        newTable.innerHTML = 
        `<tr>
        <th>CURSO:<td class="tableData">${newCurso}</td></th>
        <th>TURNO: <td class="tableData">${newTurno}</td></th>
        <th>DIA DA SEMANA: <td class="tableData">${newDia}</td></th>
        <th>DISCIPLINA: <td class="tableData">${newDisciplina}</td></th>
        <th>TURMA: <td class="tableData">${newTurma}</td></th>
        <th>PROFESSOR(A): <td class="tableData">${newProfessor}</td></th>
        <th>SALA: <td class="tableData">${newSala}</td></th>
        <th>MÓDULO: <td class="tableData">${newModulo}</td></th>
        <th>INÍCIO: <td class="tableData">${newInicio}</td></th>
        <th>FIM: <td class="tableData">${newFim}</td></th>
        <th>EDITAR: <button class="editButton" onClick="editRowMobile(event)">EDITAR</button></th>
        </tr>`

        document.getElementById('tables').appendChild(newTable)
    }
}

let beforeUpdate = ''

function editRow(event){
    let thisRowData = Array.from(event.target.parentElement.parentElement.children)

    document.getElementById('darkFade').style.display = 'flex'
    document.getElementById('editRow').style.display = 'flex'

    editCurso.value = thisRowData[0].textContent
    editTurno.value = thisRowData[1].textContent
    editDia.value = thisRowData[2].textContent
    editDisciplina.value = thisRowData[3].textContent
    editTurma.value = thisRowData[4].textContent
    editProfessor.value = thisRowData[5].textContent
    editSala.value = thisRowData[6].textContent
    editModulo.value = thisRowData[7].textContent
    editInicio.value = thisRowData[8].textContent
    editFim.value = thisRowData[9].textContent

    beforeUpdate = {
        beforeCurso: thisRowData[0].textContent,
        beforeTurno: thisRowData[1].textContent,
        beforeDia: thisRowData[2].textContent,
        beforeDisciplina: thisRowData[3].textContent
    }    
}

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

async function submitEdit(){
    //Get values
    let updatingProfessor = document.getElementById('editProfessor').value.toUpperCase()
    let updatingSala = document.getElementById('editSala').value
    let updatingModulo = document.getElementById('editModulo').value
    let updatingInicio = document.getElementById('editInicio').value
    let updatingFim = document.getElementById('editFim').value
    let token = await sessionStorage.getItem('token')

    //Destructurin beforeUpdate
    let { beforeCurso, beforeTurno, beforeDia, beforeDisciplina } = beforeUpdate
    //Fetch
    let response = await fetch(url + '/.netlify/functions/updatemap', {
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

window.addEventListener('keydown', event =>{
    if(event.keyCode == 27){
        //Bring back tables div that was removed if using phone screen
        document.getElementById('tables').style.display = 'flex'

        document.getElementById('darkFade').style.display = 'none'
        document.getElementById('editRow').style.display = 'none'
    }
})

document.getElementById('closeEdit').addEventListener('click', ()=>{
    //Bring back tables div that was removed if using phone screen
    document.getElementById('tables').style.display = 'flex'

    document.getElementById('darkFade').style.display = 'none'
    document.getElementById('editRow').style.display = 'none'
})