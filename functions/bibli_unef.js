//Imports
const axios = require('axios')
require('dotenv').config()

//Environment variables
const secret = process.env.BIBLI_UNEF_SECRET

exports.handler = async function (event, context){
    console.log('🔍 [UNEF] Iniciando handler...');
    console.log('🔍 [UNEF] Method:', event.httpMethod);
    console.log('🔍 [UNEF] Headers:', JSON.stringify(event.headers, null, 2));
    
    // Headers CORS completos
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };

    // Handle preflight requests (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        console.log('🔍 [UNEF] Handling OPTIONS request');
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        console.log('🔍 [UNEF] Parsing request body...');
        //Get student information from body requistion
        let eventBody = JSON.parse(event.body)
        const firstName = eventBody.firstName
        const lastName = eventBody.lastName
        const ra = eventBody.ra

        console.log('🔍 [UNEF] Dados recebidos:', {
            firstName,
            lastName,
            ra,
            secretLoaded: !!secret,
            secretLength: secret ? secret.length : 0
        });

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

        console.log('🔍 [UNEF] XML Request preparado:', xmlRequest);

        //Consume library API - TESTE COM URL NOVA E LOGS DETALHADOS
        console.log('🔍 [UNEF] Fazendo primeira requisição para AuthenticatedUrl...');
        console.log('🔍 [UNEF] URL:', 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl');
        console.log('🔍 [UNEF] Headers que serão enviados:', {
            'Host': 'integracao.dli.minhabiblioteca.com.br',
            'Content-Type': 'application/xml; charset=utf-8',
            'X-DigitalLibraryIntegration-API-Key': secret ? `${secret.substring(0, 8)}...` : 'UNDEFINED'
        });

        let response = await axios('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
            method: 'post',
            headers: {
                'Host': 'integracao.dli.minhabiblioteca.com.br',
                'Content-Type': 'application/xml; charset=utf-8',
                'X-DigitalLibraryIntegration-API-Key': `${secret}` //CHAVE DA UNEF
            },
            data: xmlRequest,
            timeout: 15000
        })
        
        console.log('🔍 [UNEF] Primeira requisição concluída!');
        console.log('🔍 [UNEF] Status da resposta:', response.status);
        console.log('🔍 [UNEF] Headers da resposta:', JSON.stringify(response.headers, null, 2));
        
        //Get response data
        let data = await response.data
        console.log('🔍 [UNEF] Dados da resposta:', data);

        // Parse XML response para verificar Success
        const isSuccess = data.includes && data.includes('<Success>true</Success>');
        const hasError = data.includes && data.includes('<Success>false</Success>');
        console.log('🔍 [UNEF] Análise da resposta:', {
            isSuccess,
            hasError,
            dataType: typeof data,
            dataLength: data ? data.length : 0
        });

        //Success -> Return authenticated URL
        if(data.Success == true || isSuccess){
            console.log('🎉 [UNEF] SUCCESS! Usuário tem acesso!');
            const urlMatch = data.match ? data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/) : null;
            const authenticatedUrl = data.AuthenticatedUrl || (urlMatch && urlMatch[1]);
            
            console.log('🔍 [UNEF] URL extraída:', authenticatedUrl);
            
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: authenticatedUrl
                })
            }
        }
        
        console.log('⚠️ [UNEF] Usuário não tem acesso, tentando criar...');
        
        //Else -> Create user in library database
        console.log('🔍 [UNEF] Fazendo requisição para CreatePreRegisterUser...');
        let createUser = await axios({
            method: 'post',
            url: 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/CreatePreRegisterUser',
            headers: {
                'Host': 'integracao.dli.minhabiblioteca.com.br',
                'Content-Type': 'application/xml; charset=utf-8',
                'X-DigitalLibraryIntegration-API-Key': `${secret}` //UNEF SECRET KEY
            },
            data: (`<?xml version="1.0" encoding="utf-8"?>
            <CreatePreRegisterUserRequest
            xmlns="http://dli.zbra.com.br"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <FirstName>${firstName}</FirstName>
            <LastName>${lastName}</LastName>
            <UserName>${ra}</UserName>
            </CreatePreRegisterUserRequest>
            `),
            timeout: 15000
        })

        console.log('🔍 [UNEF] CreateUser concluído!');
        console.log('🔍 [UNEF] CreateUser Status:', createUser.status);
        console.log('🔍 [UNEF] CreateUser Data:', createUser.data);

        //Error creating user
        const createSuccess = createUser.data.Success == true || (createUser.data.includes && createUser.data.includes('<Success>true</Success>'));
        if(!createSuccess){
            console.log('❌ [UNEF] Erro ao criar usuário!');
            const errorMessage = createUser.data.Message || 'Erro desconhecido ao criar usuário';
            console.log('🔍 [UNEF] Erro detalhado:', errorMessage);
            
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: "Usuário NÃO cadastrado!",
                    erro: errorMessage,
                    debug: {
                        createUserResponse: createUser.data,
                        createUserStatus: createUser.status
                    }
                })
            }
        }

        console.log('✅ [UNEF] Usuário criado com sucesso! Tentando obter URL novamente...');

        //Success creating user -> Return authenticated URL
        response = await axios('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
            method: 'post',
            headers: {
                'Host': 'integracao.dli.minhabiblioteca.com.br',
                'Content-Type': 'application/xml; charset=utf-8',
                'X-DigitalLibraryIntegration-API-Key': `${secret}` //CHAVE DA UNEF
            },
            data: xmlRequest,
            timeout: 15000
        })
        
        console.log('🔍 [UNEF] Segunda tentativa de AuthenticatedUrl concluída!');
        console.log('🔍 [UNEF] Status:', response.status);
        
        //Get response data
        data = await response.data
        console.log('🔍 [UNEF] Nova resposta:', data);

        const finalSuccess = data.Success == true || (data.includes && data.includes('<Success>true</Success>'));
        
        //Success
        if(finalSuccess){
            console.log('🎉 [UNEF] SUCCESS na segunda tentativa!');
            const urlMatch = data.match ? data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/) : null;
            const authenticatedUrl = data.AuthenticatedUrl || (urlMatch && urlMatch[1]);
            
            console.log('🔍 [UNEF] URL final extraída:', authenticatedUrl);
            
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: authenticatedUrl
                })
            }
        }else{
            console.log('❌ [UNEF] ERRO mesmo após criar usuário!');
            console.log('🔍 [UNEF] Dados completos da resposta de erro:', data);
            
            const errorMessage = data.Message || 'Erro desconhecido após criar usuário';
            
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: "Erro de servidor!",
                    erro: errorMessage,
                    debug: {
                        finalResponse: data,
                        finalStatus: response.status,
                        userWasCreated: true
                    }
                })
            }
        }

    } catch (error) {
        console.error('💥 [UNEF] ERRO FATAL:', error);
        console.error('🔍 [UNEF] Stack trace:', error.stack);
        console.error('🔍 [UNEF] Error code:', error.code);
        console.error('🔍 [UNEF] Error message:', error.message);
        
        if (error.response) {
            console.error('🔍 [UNEF] HTTP Error Response:');
            console.error('  - Status:', error.response.status);
            console.error('  - StatusText:', error.response.statusText);
            console.error('  - Headers:', JSON.stringify(error.response.headers, null, 2));
            console.error('  - Data:', error.response.data);
        }
        
        if (error.request) {
            console.error('🔍 [UNEF] Request que falhou:');
            console.error('  - URL:', error.config?.url);
            console.error('  - Method:', error.config?.method);
            console.error('  - Headers:', JSON.stringify(error.config?.headers, null, 2));
        }
        
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                resposta: "Erro interno do servidor",
                erro: error.message,
                debug: {
                    errorCode: error.code,
                    errorStack: error.stack,
                    responseStatus: error.response?.status,
                    responseData: error.response?.data,
                    url: error.config?.url,
                    method: error.config?.method
                }
            })
        }
    }
}
