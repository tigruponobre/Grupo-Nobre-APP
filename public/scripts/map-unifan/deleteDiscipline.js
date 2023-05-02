async function deleteDiscipline(){
    if(window.confirm(`Deseja mesmo deletar a disciplina "${document.querySelector('.editDisciplina').value}"?`)){
        const curso = document.querySelector('.editCurso').value
        const turno = document.querySelector('.editTurno').value
        const dia = document.querySelector('.editDia').value
        const disciplina = document.querySelector('.editDisciplina').value
        const token = await sessionStorage.getItem('token')
        const response = await fetch(url + '/.netlify/functions/delete_discipline_unifan',{
            method: 'delete',
            body: JSON.stringify({
                curso, 
                turno, 
                dia, 
                disciplina, 
                token
            })
        })
        const data = await response.json()
        if(data.resposta == 'Delete successful.'){
            const searchCurso = document.getElementById('curso').value
            const searchTurno = document.getElementById('turno').value
            const searchDia = document.getElementById('dia').value

            //Window alert
            window.alert(`${disciplina} deletada com sucesso!`)

            //Dismiss the boxes
            document.getElementById('darkFade').style.display = 'none'
            document.getElementById('editRow').style.display = 'none'
            //Bring back tables div that was removed if using phone screen
            document.getElementById('tables').style.display = 'flex'
        
            //Update table showing data
            if(window.innerWidth > 680){
                searchMapDesktop(searchCurso, searchTurno, searchDia)
            }else{
                searchMapMobile(searchCurso, searchTurno, searchDia)
            }
        }else{
            window.alert(`Erro ao deletar disciplina.`)
        }
    }
}