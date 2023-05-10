const backButtonHTML = document.createElement('div')
backButtonHTML.setAttribute('class', 'back')
backButtonHTML.innerHTML =
    `<label class="backLabel" for="backButton">Voltar</label>
<button class="backButton"><img src="../img/icons/home-icon.png"></button>
<style>
    .back{
        position: fixed;
        bottom: 3%;
        right: 6.7%;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: .3s;
    }
    .backLabel{
        font-weight: 600;
        cursor: pointer;
        opacity: 0;
        transition: .3s;
        margin-top: 5px;
        color: #fff;
    }
    .backButton{
        background-color: transparent;
        border: none;
        cursor: pointer;
        transition: .3s;
        z-index: 3;
    }
</style>`

document.body.appendChild(backButtonHTML)

let buttonDiv = document.querySelector('.back')
let backButton = document.querySelector('.backButton')
let label = document.querySelector('.backLabel')

backButton.addEventListener('click', () => history.back())

backButton.addEventListener('mouseover', () => {
    buttonDiv.style.transform = 'translateY(-10px)'
    label.style.transform = 'translateY(-5px)'
    label.style.opacity = '1'
})
backButton.addEventListener('mouseout', () => {
    buttonDiv.style.transform = 'translateY(0)'
    label.style.transform = 'translateY(5px)'
    label.style.opacity = '0'
})