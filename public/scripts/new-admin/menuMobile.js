const sandwichCheck = document.getElementById('sandwich-check')
const sandwich = document.getElementById('sandwich')

function toggleDivs(){
    if(!sandwichCheck.checked){
        document.getElementById('right-side').style.display = 'none'
        document.getElementById('left-side').style.display = 'block'
    }else{
        document.getElementById('right-side').style.display = 'flex'
        document.getElementById('left-side').style.display = 'none'
    }
}

sandwich.addEventListener('click', toggleDivs)