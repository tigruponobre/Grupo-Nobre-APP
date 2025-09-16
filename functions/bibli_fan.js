// Imports
const axios = require('axios');
require('dotenv').config();

// Environment variables
const secret = process.env.BIBLI_FAN_SECRET;

exports.handler = async function (event, context) {
    console.log('🔍 [UNIFAN] Iniciando handler...');
    console.log('🔍 [UNIFAN] Method:', event.httpMethod);
    console.log('🔍 [UNIFAN] Headers:', JSON.stringify(event.headers, null, 2));
    
    // Headers CORS completos — garantem que o navegador aceite a resposta
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };

    // Handle preflight requests (OPTIONS) — necessário para CORS
    if (event.httpMethod === 'OPTIONS') {
        console.log('🔍 [UNIFAN] Handling OPTIONS request');
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        // Validação do corpo da requisição
        console.log('🔍 [UNIFAN] Parsing request body...');
        if (!event.body) {
            console.error('❌ [UNIFAN] Corpo da requisição ausente');
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ erro: "Corpo da requisição ausente" })
            };
        }

        let eventBody;
        try {
            eventBody = JSON.parse(event.body);
        } catch (e) {
            console.error('❌ [UNIFAN] JSON inválido:', e.message);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ erro: "JSON inválido no corpo da requisição" })
            };
        }

        const { firstName, lastName, ra } = eventBody;

        console.log('🔍 [UNIFAN] Dados recebidos:', {
            firstName,
            lastName,
            ra,
            secretLoaded: !!secret,
            secretLength: secret ? secret.length : 0
        });

        // Validação dos campos obrigatórios
        if (!firstName || !lastName || !ra) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ erro: "Campos obrigatórios ausentes: firstName, lastName, ra" })
            };
        }

        // Monta XML para API da biblioteca
        const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
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
        </CreateAuthenticatedUrlRequest>`;

        console.log('🔍 [UNIFAN] XML Request preparado (trecho):', xmlRequest.substring(0, 200) + '...');

        // ============ PRIMEIRA TENTATIVA: Obter URL autenticada ============
        console.log('🔍 [UNIFAN] Fazendo primeira requisição para AuthenticatedUrl...');
        let response;
        try {
            response = await axios({
                url: 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', // ✅ URL SEM ESPAÇOS!
                method: 'POST',
                headers: {
                    'Host': 'integracao.dli.minhabiblioteca.com.br',
                    'Content-Type': 'application/xml; charset=utf-8',
                    'X-DigitalLibraryIntegration-API-Key': secret || ''
                },
                data: xmlRequest,
                timeout: 15000
            });
        } catch (err) {
            console.error('💥 [UNIFAN] Falha na requisição HTTP para AuthenticatedUrl:', err.message);
            throw new Error(`Erro ao conectar com a biblioteca: ${err.message}`);
        }

        console.log('🔍 [UNIFAN] Primeira requisição concluída! Status:', response.status);
        let data = response.data;
        console.log('🔍 [UNIFAN] Resposta recebida (trecho):', typeof data === 'string' ? data.substring(0, 300) + '...' : data);

        // Verifica se foi bem-sucedido
        const isSuccess = typeof data === 'string' && data.includes('<Success>true</Success>');
        console.log('🔍 [UNIFAN] Sucesso na resposta?', isSuccess);

        if (isSuccess) {
            console.log('🎉 [UNIFAN] SUCCESS! Usuário tem acesso!');
            const urlMatch = data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/);
            const authenticatedUrl = urlMatch ? urlMatch[1] : null;

            if (!authenticatedUrl) {
                console.error('❌ [UNIFAN] URL autenticada não encontrada na resposta XML');
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ erro: "URL autenticada não encontrada na resposta." })
                };
            }

            console.log('🔗 [UNIFAN] URL autenticada extraída:', authenticatedUrl);
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ resposta: authenticatedUrl })
            };
        }

        // ============ USUÁRIO NÃO EXISTE — TENTA CRIAR ============
        console.log('⚠️ [UNIFAN] Usuário não tem acesso, tentando criar...');

        let createUser;
        try {
            createUser = await axios({
                method: 'POST',
                url: 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/CreatePreRegisterUser', // ✅ URL SEM ESPAÇOS!
                headers: {
                    'Host': 'integracao.dli.minhabiblioteca.com.br',
                    'Content-Type': 'application/xml; charset=utf-8',
                    'X-DigitalLibraryIntegration-API-Key': secret || ''
                },
                data: `<?xml version="1.0" encoding="utf-8"?>
                <CreatePreRegisterUserRequest
                xmlns="http://dli.zbra.com.br"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <FirstName>${firstName}</FirstName>
                <LastName>${lastName}</LastName>
                <UserName>${ra}</UserName>
                </CreatePreRegisterUserRequest>`,
                timeout: 15000
            });
        } catch (err) {
            console.error('💥 [UNIFAN] Falha ao criar usuário:', err.message);
            throw new Error(`Erro ao criar usuário na biblioteca: ${err.message}`);
        }

        console.log('🔍 [UNIFAN] CreateUser concluído! Status:', createUser.status);
        const createSuccess = typeof createUser.data === 'string' && createUser.data.includes('<Success>true</Success>');

        if (!createSuccess) {
            console.log('❌ [UNIFAN] Erro ao criar usuário!');
            const errorMessage = typeof createUser.data === 'string' ?
                (createUser.data.match(/<Message>(.*?)<\/Message>/)?.[1] || 'Erro desconhecido ao criar usuário') :
                'Resposta inválida da API';

            console.log('🔍 [UNIFAN] Mensagem de erro:', errorMessage);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: "Usuário NÃO cadastrado!",
                    erro: errorMessage
                })
            };
        }

        console.log('✅ [UNIFAN] Usuário criado com sucesso! Tentando obter URL novamente...');

        // ============ SEGUNDA TENTATIVA: Obter URL após criação ============
        try {
            response = await axios({
                url: 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', // ✅ URL SEM ESPAÇOS!
                method: 'POST',
                headers: {
                    'Host': 'integracao.dli.minhabiblioteca.com.br',
                    'Content-Type': 'application/xml; charset=utf-8',
                    'X-DigitalLibraryIntegration-API-Key': secret || ''
                },
                data: xmlRequest,
                timeout: 15000
            });
        } catch (err) {
            console.error('💥 [UNIFAN] Falha na segunda tentativa:', err.message);
            throw new Error(`Erro ao obter URL após criação: ${err.message}`);
        }

        console.log('🔍 [UNIFAN] Segunda tentativa concluída! Status:', response.status);
        data = response.data;

        const finalSuccess = typeof data === 'string' && data.includes('<Success>true</Success>');
        if (finalSuccess) {
            console.log('🎉 [UNIFAN] SUCCESS na segunda tentativa!');
            const urlMatch = data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/);
            const authenticatedUrl = urlMatch ? urlMatch[1] : null;

            if (!authenticatedUrl) {
                throw new Error("URL autenticada não encontrada após criação do usuário");
            }

            console.log('🔗 [UNIFAN] URL final extraída:', authenticatedUrl);
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ resposta: authenticatedUrl })
            };
        } else {
            console.log('❌ [UNIFAN] ERRO mesmo após criar usuário!');
            const errorMessage = typeof data === 'string' ?
                (data.match(/<Message>(.*?)<\/Message>/)?.[1] || 'Erro desconhecido após criar usuário') :
                'Resposta inválida';

            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: "Erro de servidor!",
                    erro: errorMessage
                })
            };
        }

    } catch (error) {
        console.error('💥 [UNIFAN] ERRO FATAL:', error.message);
        console.error('🔍 [UNIFAN] Stack trace:', error.stack);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                resposta: "Erro interno do servidor",
                erro: error.message
            })
        };
    }
};
