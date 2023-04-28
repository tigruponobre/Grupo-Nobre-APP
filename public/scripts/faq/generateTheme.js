//Show response
function showResponse(e){
    const thisArrow = e.target
    thisParent = thisArrow.parentElement.parentElement
    thisArrow.classList.toggle('questionActivated')
    const response = [thisParent.children[1], thisParent.children[2], thisParent.children[3], thisParent.children[4]]
    response.forEach(element => {
        if(element){
            element.classList.toggle('response')
        }
    })
}

async function generateTheme(event){
    
    const leftSide = document.getElementById('leftSide')
    leftSide.innerHTML = `<div id="themeQuestions"></div>`

    let getTheme = ''
    if(typeof(event) == 'object'){
        getTheme = event.target.textContent
    }else{
        getTheme = event
    }

    const response = await fetch(url + '/.netlify/functions/search_questions', {
        method: 'post',
        body: JSON.stringify({
            theme: getTheme
        })
    })

    const data = await response.json()

    if(response.status != 200){
        window.alert(data.msg)
    }else{
        
        themeQuestions.innerHTML = `<h3 id="chosenTitle">${getTheme.toUpperCase()}</h3>`

        const questions = data.content
        questions.forEach( element => {
            const showQuestion = document.createElement('div')
            showQuestion.setAttribute('class', 'question')

            const generateQuestionTitle = document.createElement('h5')
            generateQuestionTitle.innerHTML = `${element.title}<img onclick="showResponse(event)" src="../img/icons/black_left_arrow.png" alt="arrow-right" width="25">`
            generateQuestionTitle.setAttribute('class', 'questionTitle')

            const generateIntireQuestion = document.createElement('div')
            generateIntireQuestion.setAttribute('class', 'question')
            generateIntireQuestion.innerHTML = generateQuestionTitle.outerHTML

            const answer_unef = document.createElement('div')
            if(element.answer_unef){
                answer_unef.setAttribute('class', 'response')
                answer_unef.innerHTML = `<h6>UNEF</h6><p>${element.answer_unef}</p>`
                console.log(element.answer_unef.replace(`
                `, 'AEHOOOOOOO'))                
                generateIntireQuestion.innerHTML += answer_unef.outerHTML
            }
            const answer_unifan = document.createElement('div')
            if(element.answer_unifan){
                answer_unifan.setAttribute('class', 'response')
                answer_unifan.innerHTML = `<h6>UNIFAN</h6><p>${element.answer_unifan}</p>`
                generateIntireQuestion.innerHTML += answer_unifan.outerHTML
            }
            const answer_unefead = document.createElement('div')
            if(element.answer_unefead){
                answer_unefead.setAttribute('class', 'response')
                answer_unefead.innerHTML = `<h6>UNEF EAD</h6><p>${element.answer_unefead}</p>`
                generateIntireQuestion.innerHTML += answer_unefead.outerHTML
            }
            const answer_unifanead = document.createElement('div')
            if(element.answer_unifanead){
                answer_unifanead.setAttribute('class', 'response')
                answer_unifanead.innerHTML = `<h6>UNIFAN EAD</h6><p>${element.answer_unifanead}</p>`
                generateIntireQuestion.innerHTML += answer_unifanead.outerHTML
            }
            themeQuestions.appendChild(generateIntireQuestion)
        })

        document.getElementById('rightSide').style.marginTop = '0'
        window.scrollTo(0, 0)
    }
}