//Capturando as tag's do HTML para serem usadas no Javascript
const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");
const enviarButton = document.querySelector("#titulo button");

// Declarando OPENAI_API_KEY no escopo global, para conseguir ser utilizada dentro de qualquer função.
let OPENAI_API_KEY;

//Capturando as ações de digitação dentro do inputQuestion(textarea) e de click no botão para quando forem clicados, chamarem a próxima função, que faz a requisição na api.
inputQuestion.addEventListener("keypress", (e) => {
    if (inputQuestion.value && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Impede que a pergunta seja enviada no momento que teclar enter segurando o shift. Ou seja, permite a quebra de linha, sem enviar a pergunta.
        SendQuestion();
    }
});

enviarButton.addEventListener("click", () => {
    if (inputQuestion.value) {
        SendQuestion();
    }
});

//Momento que ele consome a chave da OPEN AI através de uma API nossa.
fetch('https://home.gruponobre.edu.br/.netlify/functions/api-key')
    .then(response => response.json())
    .then(data => {
        OPENAI_API_KEY = data.apiKey;
    })
    .catch(error => console.error('Error fetching API key:', error));

//Função que faz a requisição na API, passando no Authorization a chave da API e no prompt o texto que foi digitado no input de pergunta.
function SendQuestion() {
    var sQuestion = inputQuestion.value;

    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: sQuestion,
            max_tokens: 2048, // tamanho da resposta
            temperature: 0.5, // criatividade na resposta
        }),
    })
        // Recebimento da resposta da API e tratamento de dados (sejam eles de erros ou a resposta correta em si).
        .then((response) => response.json())
        .then((json) => {
            if (result.value) result.value += "\n \n";

            if (json.error?.message) {
                result.value += `Error: ${json.error.message}`;
            } else if (json.choices?.[0].text) {
                var text = json.choices[0].text || "Sem resposta";

                result.value += "Resposta da IA Nobre: " + text;
            }

            result.scrollTop = result.scrollHeight;
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
            inputQuestion.value = "";
            inputQuestion.disabled = false;
            inputQuestion.focus();
        });

    if (result.value) result.value += "\n\n\n";

    result.value += `Pergunta: ${sQuestion}`;
    inputQuestion.value = "Carregando...";
    inputQuestion.disabled = true;

    result.scrollTop = result.scrollHeight;
}