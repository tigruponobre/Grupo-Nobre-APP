const axios = require('axios')
require('dotenv').config()

const secret = process.env.BIBLI_UNEF_SECRET

exports.handler = async function (event, context) {
    try {
        // Parse e validação dos dados de entrada
        const eventBody = JSON.parse(event.body)
        const firstName = (eventBody.firstName || '').trim()
        const lastName = (eventBody.lastName || '').trim()
        const ra = (eventBody.ra || '').trim()

        if (!firstName || !lastName || !ra) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    resposta: "Dados incompletos: firstName, lastName e ra são obrigatórios."
                })
            }
        }

        // ⚠️ ATENÇÃO: NÃO HÁ ESPAÇOS NO FINAL DA URL!
        const baseUrl = 'https://integracao.dli.minhabiblioteca.com.br/'

        // Função auxiliar para enviar requisições XML
        const makeXmlRequest = async (endpoint, xmlPayload) => {
            return await axios.post(`${baseUrl}${endpoint}`, xmlPayload, {
                headers: {
                    'Host': 'integracao.dli.minhabiblioteca.com.br',
                    'Content-Type': 'application/xml; charset=utf-8',
                    'X-DigitalLibraryIntegration-API-Key': secret
                }
            })
        }

        // XML para criar URL autenticada
        const createAuthenticatedUrlXml = `
<?xml version="1.0" encoding="utf-8"?>
<CreateAuthenticatedUrlRequest
    xmlns="http://dli.zbra.com.br"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <FirstName>${firstName}</FirstName>
    <LastName>${lastName}</LastName>
    <Email>${ra}</Email>
    <CourseId xsi:nil="true"/>
    <Tag xsi:nil="true"/>
    <Isbn xsi:nil="true"/>
</CreateAuthenticatedUrlRequest>`

        // 1. Tentar gerar URL autenticada diretamente
        let response = await makeXmlRequest('AuthenticatedUrl', createAuthenticatedUrlXml)

        if (response.data.Success === true) {
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ resposta: response.data.AuthenticatedUrl })
            }
        }

        // 2. Se falhar, criar usuário pré-cadastro
        const createPreRegisterUserXml = `
<?xml version="1.0" encoding="utf-8"?>
<CreatePreRegisterUserRequest
    xmlns="http://dli.zbra.com.br"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <FirstName>${firstName}</FirstName>
    <LastName>${lastName}</LastName>
    <UserName>${ra}</UserName>
</CreatePreRegisterUserRequest>`

        const createUserResponse = await makeXmlRequest('CreatePreRegisterUser', createPreRegisterUserXml)

        if (!createUserResponse.data.Success) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ resposta: "Usuário NÃO cadastrado!" })
            }
        }

        // 3. Tentar novamente gerar URL autenticada após cadastro
        response = await makeXmlRequest('AuthenticatedUrl', createAuthenticatedUrlXml)

        if (response.data.Success === true) {
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ resposta: response.data.AuthenticatedUrl })
            }
        } else {
            return {
                statusCode: 500,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ resposta: "Erro ao gerar URL autenticada após cadastro." })
            }
        }

    } catch (error) {
        console.error('❌ Erro na função bibli_unef:', error.response?.data || error.message || error)

        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                resposta: "Erro interno ao acessar a biblioteca. Tente novamente mais tarde."
            })
        }
    }
}
