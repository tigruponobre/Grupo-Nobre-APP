//Imports
const axios = require('axios')
require('dotenv').config()

//Environment variables
// Coloque no seu .env:
// BIBLI_UNEF_SECRET=eb417da7-87f4-4dfc-98b6-7a41335ff2af
const secret = process.env.BIBLI_UNEF_SECRET

exports.handler = async function (event, context) {
    //Get student information from body request
    let eventBody = JSON.parse(event.body)
    const firstName = eventBody.firstName
    const lastName = eventBody.lastName
    const ra = eventBody.ra

    //Consume library API (AuthenticatedUrl)
    let response = await axios('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
        method: 'post',
        headers: {
            'Host': 'integracao.dli.minhabiblioteca.com.br',
            'Content-Type': 'application/xml; charset=utf-8',
            'X-DigitalLibraryIntegration-API-Key': `${secret}`
        },
        data: (`<?xml version="1.0" encoding="utf-8"?>
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
        </CreateAuthenticatedUrlRequest>
        `)
    })

    //Get response data
    let data = await response.data

    //Success -> Return authenticated URL
    if (data.Success == true) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                resposta: data.AuthenticatedUrl
            })
        }
    }

    //Else -> Create user in library database
    let createUser = await axios({
        method: 'post',
        url: 'https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/CreatePreRegisterUser',
        headers: {
            'Host': 'integracao.dli.minhabiblioteca.com.br',
            'Content-Type': 'application/xml; charset=utf-8',
            'X-DigitalLibraryIntegration-API-Key': `${secret}`
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
        `)
    })

    //Error creating user
    if (createUser.data.Success == false) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                resposta: "Usuário NÃO cadastrado!"
            })
        }
    }

    //Success creating user -> Return authenticated URL again
    response = await axios('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
        method: 'post',
        headers: {
            'Host': 'integracao.dli.minhabiblioteca.com.br',
            'Content-Type': 'application/xml; charset=utf-8',
            'X-DigitalLibraryIntegration-API-Key': `${secret}`
        },
        data: (`<?xml version="1.0" encoding="utf-8"?>
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
        </CreateAuthenticatedUrlRequest>
        `)
    })

    //Get response data
    data = await response.data

    //Success
    if (data.Success == true) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                resposta: data.AuthenticatedUrl
            })
        }
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({
                resposta: "Erro de servidor!"
            })
        }
    }
}
