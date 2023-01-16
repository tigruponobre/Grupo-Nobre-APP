const axios = require('axios')
require('dotenv').config()

const secret = process.env.BIBLI_FAN_SECRET

exports.handler = async function (event, context){
    let eventBody = JSON.parse(event.body)
    const firstName = eventBody.firstName
    const lastName = eventBody.lastName
    const ra = eventBody.ra

    let response = await axios('https://digitallibrary.zbra.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
        method: 'post',
        headers: {
            'Content-type': 'text/xml',
            "X-DigitalLibraryIntegration-API-Key": `${secret}` //CHAVE DA UNIFAN,
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
    
    let data = await response.data

    if(data.Success == true){
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
    
    let createUser = await axios({
        method: 'post',
        url: 'https://digitallibrary.zbra.com.br/DigitalLibraryIntegrationService/CreatePreRegisterUser',
        headers: {
            'Content-type': 'text/xml',
            "X-DigitalLibraryIntegration-API-Key": `eb417da7-87f4-4dfc-98b6-7a41335ff2af` //CHAVE DA UNIFAN
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

    if(createUser.data.Success == false){
        return {
            statusCode: 200,
            body: JSON.stringify({
                resposta: "Usuário NÃO cadastrado!"
            })
        }
    }

    response = await axios('https://digitallibrary.zbra.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', {
        method: 'post',
        headers: {
            'Content-type': 'text/xml',
            "X-DigitalLibraryIntegration-API-Key": `eb417da7-87f4-4dfc-98b6-7a41335ff2af` //CHAVE DA UNIFAN
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
    
    data = await response.data

    if(data.Success == true){
        return {
            statusCode: 200,
            body: JSON.stringify({
                resposta: data.AuthenticatedUrl
            })
        }
    }else{
        return {
            statusCode: 500,
            body: JSON.stringify({
                resposta: "Erro de servidor!"
            })
        }
    }
}
