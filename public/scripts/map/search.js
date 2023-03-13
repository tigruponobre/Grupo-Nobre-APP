//Give all selects the same eventListener
[document.getElementById('curso'), document.getElementById('turno'), document.getElementById('dia')].forEach(element => {
    element.addEventListener('change', ()=>{
        let checkSelects = document.getElementById('curso').value != 'curso' && document.getElementById('turno').value != 'turno' && document.getElementById('dia').value != 'dia'
        if(checkSelects) searchMap(document.getElementById('curso').value, document.getElementById('turno').value, document.getElementById('dia').value)
    })
});

const url = document.URL.split('/').splice('0',3).join('/')

async function searchMap(curso, turno, dia){
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
            console.log(information[elem][key])
            newRow.appendChild(newData)
        }

        //Adding on the table
        document.getElementById('myTable').appendChild(newRow)
    }
}
