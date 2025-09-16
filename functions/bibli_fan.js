//Imports
const axios = require('axios')
require('dotenv').config()

//Environment variables
const secret = process.env.BIBLI_FAN_SECRET

exports.handler = async function (event, context){
    console.log('🔍 [UNIFAN] Iniciando handler...');
    console.log('🔍 [UNIFAN] Method:', event.httpMethod);
    console.log('🔍 [UNIFAN] Headers:', JSON.stringify(event.headers, null, 2));
    
    // Headers CORS completos
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };

    // Handle preflight requests (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        console.log('🔍 [UNIFAN] Handling OPTIONS request');
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        console.log('🔍 [UNIFAN] Parsing request body...');
        //Get student information from body requistion
        let eventBody = JSON.parse(event.body)
        const firstName = eventBody.firstName
        const lastName = eventBody.lastName
        const ra = eventBody.ra

        console.log('🔍 [UNIFAN] Dados recebidos:', {
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

        console.log('🔍 [UNIFAN] XML Request preparado:', xmlRequest);

        //Consume library API - NOVA API (MESMA DO UNEF)
        console.log('🔍 [UNIFAN] Fazendo primeira requisição para AuthenticatedUrl...');
        console.log('🔍 [UNIFAN] URL:', 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl');
        console.log('🔍 [UNIFAN] Headers que serão enviados:', {
            'Host': 'integracao.dli.minhabiblioteca.com.br',
            'Content-Type': 'application/xml; charset=utf-8',
            'X-DigitalLibraryIntegration-API-Key': secret ? `${secret.substring(0, 8)}...` : 'UNDEFINED'
        });

        let response = await axios('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
            method: 'post',
            headers: {
                'Host': 'integracao.dli.minhabiblioteca.com.br',
                'Content-Type': 'application/xml; charset=utf-8',
                'X-DigitalLibraryIntegration-API-Key': `${secret}` //UNIFAN SECRET KEY
            },
            data: xmlRequest,
            timeout: 15000
        })
        
        console.log('🔍 [UNIFAN] Primeira requisição concluída!');
        console.log('🔍 [UNIFAN] Status da resposta:', response.status);
        console.log('🔍 [UNIFAN] Headers da resposta:', JSON.stringify(response.headers, null, 2));
        
        //Get response data
        let data = await response.data
        console.log('🔍 [UNIFAN] Dados da resposta:', data);

        // Parse XML response para verificar Success
        const isSuccess = data.includes && data.includes('<Success>true</Success>');
        const hasError = data.includes && data.includes('<Success>false</Success>');
        console.log('🔍 [UNIFAN] Análise da resposta:', {
            isSuccess,
            hasError,
            dataType: typeof data,
            dataLength: data ? data.length : 0
        });

        //Success -> Return authenticated URL
        if(data.Success == true || isSuccess){
            console.log('🎉 [UNIFAN] SUCCESS! Usuário tem acesso!');
            const urlMatch = data.match ? data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/) : null;
            const authenticatedUrl = data.AuthenticatedUrl || (urlMatch && urlMatch[1]);
            
            console.log('🔍 [UNIFAN] URL extraída:', authenticatedUrl);
            
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: authenticatedUrl
                })
            }
        }
        
        console.log('⚠️ [UNIFAN] Usuário não tem acesso, tentando criar...');
        
        //Else -> Create user in library database
        console.log('🔍 [UNIFAN] Fazendo requisição para CreatePreRegisterUser...');
        let createUser = await axios({
            method: 'post',
            url: 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/CreatePreRegisterUser',
            headers: {
                'Host': 'integracao.dli.minhabiblioteca.com.br',
                'Content-Type': 'application/xml; charset=utf-8',
                'X-DigitalLibraryIntegration-API-Key': `${secret}` //UNIFAN SECRET KEY
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

        console.log('🔍 [UNIFAN] CreateUser concluído!');
        console.log('🔍 [UNIFAN] CreateUser Status:', createUser.status);
        console.log('🔍 [UNIFAN] CreateUser Data:', createUser.data);

        //Error creating user
        const createSuccess = createUser.data.Success == true || (createUser.data.includes && createUser.data.includes('<Success>true</Success>'));
        if(!createSuccess){
            console.log('❌ [UNIFAN] Erro ao criar usuário!');
            const errorMessage = createUser.data.Message || 'Erro desconhecido ao criar usuário';
            console.log('🔍 [UNIFAN] Erro detalhado:', errorMessage);
            
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

        console.log('✅ [UNIFAN] Usuário criado com sucesso! Tentando obter URL novamente...');

        //Success creating user -> Return authenticated URL
        response = await axios('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
            method: 'post',
            headers: {
                'Host': 'integracao.dli.minhabiblioteca.com.br',
                'Content-Type': 'application/xml; charset=utf-8',
                'X-DigitalLibraryIntegration-API-Key': `${secret}` //CHAVE DA UNIFAN
            },
            data: xmlRequest,
            timeout: 15000
        })
        
        console.log('🔍 [UNIFAN] Segunda tentativa de AuthenticatedUrl concluída!');
        console.log('🔍 [UNIFAN] Status:', response.status);
        
        //Get response data
        data = await response.data
        console.log('🔍 [UNIFAN] Nova resposta:', data);

        const finalSuccess = data.Success == true || (data.includes && data.includes('<Success>true</Success>'));
        
        //Success
        if(finalSuccess){
            console.log('🎉 [UNIFAN] SUCCESS na segunda tentativa!');
            const urlMatch = data.match ? data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/) : null;
            const authenticatedUrl = data.AuthenticatedUrl || (urlMatch && urlMatch[1]);
            
            console.log('🔍 [UNIFAN] URL final extraída:', authenticatedUrl);
            
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    resposta: authenticatedUrl
                })
            }
        }else{
            console.log('❌ [UNIFAN] ERRO mesmo após criar usuário!');
            console.log('🔍 [UNIFAN] Dados completos da resposta de erro:', data);
            
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
        console.error('💥 [UNIFAN] ERRO FATAL:', error);
        console.error('🔍 [UNIFAN] Stack trace:', error.stack);
        console.error('🔍 [UNIFAN] Error code:', error.code);
        console.error('🔍 [UNIFAN] Error message:', error.message);
        
        if (error.response) {
            console.error('🔍 [UNIFAN] HTTP Error Response:');
            console.error('  - Status:', error.response.status);
            console.error('  - StatusText:', error.response.statusText);
            console.error('  - Headers:', JSON.stringify(error.response.headers, null, 2));
            console.error('  - Data:', error.response.data);
        }
        
        if (error.request) {
            console.error('🔍 [UNIFAN] Request que falhou:');
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
