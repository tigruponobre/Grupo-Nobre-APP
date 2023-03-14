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
    <th>TURMA</th>
    <th>DISCIPLINA</th>
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
        document.getElementById('myTable').innerHTML =
        `<tr>
        <th>NÃO ENCONTRADO</th>
        </tr>`
        return
    }

    for (let elem of Array.from(Object.keys(information))){
        //Getting info
        let newCurso = document.getElementById('curso').value
        let newTurno = document.getElementById('turno').value
        let newDia = document.getElementById('dia').value
        let newTurma = elem
        let newDisciplina = information[elem]['DISCIPLINA']
        let newProfessor = information[elem]['PROFESSOR']
        let newSala = information[elem]['SALA']
        let newModulo = information[elem]['MODULO']
        let newInicio = information[elem]['INICIO']
        let newFim = information[elem]['FIM']

        let newTable = document.createElement('table')
        newTable.setAttribute('class', 'newTable')
        newTable.innerHTML = 
        `<tr>
        <th>CURSO: ${newCurso}</th>
        <th>TURNO: ${newTurno}</th>
        <th>DIA DA SEMANA: ${newDia}</th>
        <th>TURMA: ${newTurma}</th>
        <th>DISCIPLINA: ${newDisciplina}</th>
        <th>PROFESSOR(A): ${newProfessor}</th>
        <th>SALA: ${newSala}</th>
        <th>MÓDULO: ${newModulo}</th>
        <th>INÍCIO: ${newInicio}</th>
        <th>FIM: ${newFim}</th>
        <th>EDITAR: <button class="editButton">EDITAR</button></th>
        </tr>`

        document.getElementById('tables').appendChild(newTable)
    }
}

let beforeUpdate = ''

function editRow(event){
    let thisRowData = Array.from(event.target.parentElement.parentElement.children)
    for(let i = 0; i < thisRowData.length - 1; i++){
        console.log(thisRowData[i])
    }

    [document.getElementById('darkFade'), document.getElementById('editRow')].forEach(element =>{
        element.style.display = 'flex'
    })

    editCurso.value = thisRowData[0].textContent
    editTurno.value = thisRowData[1].textContent
    editDia.value = thisRowData[2].textContent
    editTurma.value = thisRowData[3].textContent
    editDisciplina.value = thisRowData[4].textContent
    editProfessor.value = thisRowData[5].textContent
    editSala.value = thisRowData[6].textContent
    editModulo.value = thisRowData[7].textContent
    editInicio.value = thisRowData[8].textContent
    editFim.value = thisRowData[9].textContent

    beforeUpdate = {
        beforeCurso: thisRowData[0].textContent,
        beforeTurno: thisRowData[1].textContent,
        beforeDia: thisRowData[2].textContent,
        beforeTurma: thisRowData[3].textContent
    }    
}

async function submitEdit(){
    //Get values
    // let updatingCurso = document.getElementById('editCurso').value
    // let updatingTurno = document.getElementById('editTurno').value
    // let updatingDia = document.getElementById('editDia').value
    // let updatingTurma = document.getElementById('editTurma').value
    // let updatingDisciplina = document.getElementById('editDisciplina').value
    let updatingProfessor = document.getElementById('editProfessor').value.toUpperCase()
    let updatingSala = document.getElementById('editSala').value
    let updatingModulo = document.getElementById('editModulo').value
    let updatingInicio = document.getElementById('editInicio').value
    let updatingFim = document.getElementById('editFim').value
    let token = await sessionStorage.getItem('token')

    //Destructurin beforeUpdate
    let { beforeCurso, beforeTurno, beforeDia, beforeTurma } = beforeUpdate
    //Fetch
    let response = await fetch(url + '/.netlify/functions/updatemap', {
        method: 'put',
        body: JSON.stringify({
            curso: beforeCurso,
            turno: beforeTurno,
            dia: beforeDia,
            turma: beforeTurma,
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
        if(window.innerWidth > 680){
            searchMapDesktop(beforeCurso, beforeTurno, beforeDia)
        }else{
            searchMapMobile(beforeCurso, beforeTurno, beforeDia)
        }
    }
}