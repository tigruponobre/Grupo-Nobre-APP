// function sortear() {

//     // Obter valores dos inputs
//     const quantidadeDeNumeros = document.querySelector("#quantidade").value
//     const valorMinimo = document.querySelector("#input-min").value
//     const valorMaximo = document.querySelector("#input-max").value


//     // Validar se os valores são numéricos, inteiros e se maximo >= minimo
//     if (isNaN(quantidadeDeNumeros) || isNaN(valorMinimo) || isNaN(valorMaximo) || valorMaximo < valorMinimo || quantidadeDeNumeros > valorMaximo) {
//         alert("Por favor, insira valores válidos.");
//         return;
//     } else if (quantidadeDeNumeros < 0 || valorMaximo < 0 || valorMinimo < 0 && !Number.isInteger(quantidadeDeNumeros) || !Number.isInteger(valorMaximo) || !Number.isInteger(valorMinimo)) {
//         alert("Por favor, insira números inteiros.");
//         return;
//     }

//     //  Array para armazenar os números sorteados
//     var numerosSorteados = [];

//     // Sortear a quantidade de números desejada
//     while (numerosSorteados.length < quantidadeDeNumeros) {
//         var numeroSorteado = Math.floor(Math.random() * (valorMaximo - valorMinimo + 1)) + valorMinimo;

//         // Verificar se o número já foi sorteado
//         if (numerosSorteados.indexOf(numeroSorteado) === -1) {
//             numerosSorteados.push(numeroSorteado);
//         }
//     }

//     // Ordenar os números do menor para o maior através da posição no array
//     numerosSorteados.sort(function (a, b) {
//         return a - b;
//     });

//     // Exibir os números sorteados no h2 com ID "resultado-numeros"
//     document.getElementById("resultado-numeros").textContent = "Números Sorteados: " + numerosSorteados.join(", ");
// }

function sortear() {

    // Obter valores dos inputs
    const quantidadeDeNumeros = document.querySelector("#quantidade").value
    const valorMinimo = Math.ceil(document.querySelector("#input-min").value)
    const valorMaximo = Math.floor(document.querySelector("#input-max").value)


    // Validar se os valores são numéricos, inteiros e se maximo >= minimo
    if (isNaN(quantidadeDeNumeros) || isNaN(valorMinimo) || isNaN(valorMaximo) || valorMaximo < valorMinimo || quantidadeDeNumeros > valorMaximo) {
        alert("Por favor, insira valores válidos.");
        return;
    } else if (quantidadeDeNumeros < 0 || valorMaximo < 0 || valorMinimo < 0 && !Number.isInteger(quantidadeDeNumeros)) {
        alert("Por favor, insira números inteiros.");
        return;
    }

    //  Array para armazenar os números sorteados
    var numerosSorteados = [];

    // Sortear a quantidade de números desejada
    while (numerosSorteados.length < quantidadeDeNumeros) {
        var numeroSorteado = Math.floor(Math.random() * (valorMaximo - valorMinimo + 1)) + valorMinimo;

        // Verificar se o número já foi sorteado
        if (numerosSorteados.indexOf(numeroSorteado) === -1) {
            numerosSorteados.push(numeroSorteado);
        }
    }

    // Ordenar os números do menor para o maior através da posição no array
    numerosSorteados.sort(function (a, b) {
        return a - b;
    });

    // Exibir os números sorteados no h2 com ID "resultado-numeros"
    document.getElementById("resultado-numeros").textContent = "Números Sorteados: " + numerosSorteados.join(", ");
}


