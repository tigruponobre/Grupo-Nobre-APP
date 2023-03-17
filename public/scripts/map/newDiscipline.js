const newDisciplineBox = document.getElementById('newDiscipline')
const header = document.getElementsByTagName('header')[0]
const tables = document.getElementById('tables')
const closeCreate = document.querySelector('.closeCreate')

function showNewDisciplineBox(){
    darkFade.style.display = 'block';
    newDisciplineBox.style.display = 'flex';
}

closeCreate.addEventListener('click', ()=>{
    darkFade.style.display = 'none';
    newDisciplineBox.style.display = 'none';
})

async function createNewDiscipline(){
    const newCourse = await document.getElementById('selectCourse').value
    const newShift = await document.getElementById('selectShift').value
    const newDay = await document.getElementById('selectDay').value
    const newDisciplineName = await document.querySelector('.newDisciplineName').value
    const newClass = await document.querySelector('.newClass').value
    const newProfessor = await document.querySelector('.newProfessor').value
    const newRoom = await document.querySelector('.newRoom').value
    const newModule = await document.querySelector('.newModule').value
    const newStart = await document.querySelector('.newStart').value
    const newEnd = await document.querySelector('.newEnd').value

    const response = await fetch(url + '/.netlify/functions/insert_discipline', {
        method: 'put',
        body: JSON.stringify({
            curso: newCourse,
            turno: newShift,
            dia: newDay,
            disciplina: newDisciplineName,
            turma: newClass,
            professor: newProfessor,
            sala: newRoom,
            modulo: newModule,
            inicio: newStart,
            fim: newEnd,
            token
        })
    })

    const data = await response.json()

    if (data.resposta == "Update successful."){
        window.alert('Disciplina criada com sucesso!')
    }else{
        window.alert(data.resposta)
    }
}