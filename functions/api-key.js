// API QUE CONTÊM A CHAVE DA API DO CHATGPT, UTILIZADO NO PROJETO DA INTELIGÊNCIA ARTIFICIAL

require('dotenv').config();

exports.handler = async function (event, context) {
    // Configurando os cabeçalhos CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    try {
        // Obtendo a chave de API da variável de ambiente
        const apiKey = process.env.OPENAI_API_KEY;

        // Retornando uma resposta JSON com a chave de API
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ apiKey }),
        };
    } catch (error) {
        // Em caso de erro, retornar uma resposta de erro
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erro interno do servidor' }),
        };
    }
};