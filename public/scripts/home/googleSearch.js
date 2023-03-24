//Google search
let search = document.getElementById('search')
let searchValue = ''
search.addEventListener('keypress', (key)=>{
    if(key.keyCode == 13){
        searchValue = search.value
        window.location.href = 'https://www.google.com/search?q=' + searchValue
    }
})

let lens = document.getElementById('lens')

lens.addEventListener('click', ()=>{
    searchValue = search.value
    window.location.href = 'https://www.google.com/search?q=' + searchValue
})