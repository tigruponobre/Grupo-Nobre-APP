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

        //Disciplina from response
        let newDisciplina = document.createElement('td')
        newDisciplina.innerText = elem
        newRow.appendChild(newDisciplina)

        //Information in JSON from the request
        for (let key of Array.from(Object.keys(information[elem]))){
            let newData = document.createElement('td')
            newData.innerText = information[elem][key]
            newRow.appendChild(newData)
        }

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
        </tr>`

        document.getElementById('tables').appendChild(newTable)
    }
}