//Imports
const mongoose = require('mongoose')
const Map = require('../models/Map')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const master_token = process.env.TOKEN
const minor_token = process.env.MINOR_TOKEN

exports.handler = async function (event, context){
    //Connection with MongoDB Atlas
    let connection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.qk8butq.mongodb.net/${db_name}?retryWrites=true&w=majority`)

    //Check if connetion succeeded
    if(connection){
        console.log('Connection successful!')
    }else{
        return{
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                resposta: "Connection failed."
            })
        }
    }

    //Get information from req body
    const eventBody = await JSON.parse(event.body)
    const { curso, turno, dia, disciplina, turma, professor, sala, modulo, inicio, fim, token } = eventBody

    // Check admin
    let checkAdmin = await bcrypt.compare(master_token, token)
    if(!checkAdmin) checkAdmin = await bcrypt.compare(minor_token, token)

    if(!checkAdmin){
        return{
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                msg: "Unauthorized"
            })
        }
    }

    //Finding document
    let table = await Map.findOne({CURSO: curso})

    // Creating new discipline string objetc
    const newDisciplineString = 
    `{
        "${disciplina}": {
            "TURMA": "${turma}",
            "PROFESSOR": "${professor}",
            "SALA": "${sala}",
            "MODULO": "${modulo}",
            "INICIO": "${inicio}",
            "FIM": "${fim}"
        }
    }`

    //Turn discipline string into JSON
    const newDispline = await JSON.parse(newDisciplineString)

    //Turn old object into the new one
    Object.assign(table[turno][dia], newDispline)

    //Confirm the information insert
    let confirmInsert = await Map.updateOne({CURSO: curso}, table)

    //Response
    if(confirmInsert.matchedCount != 0 && confirmInsert.updateOne != 0){
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: "Insert successful."
            })
        }
    }else{
        return{
            statusCode: 412,
            body: JSON.stringify({
                resposta: "Insert failed."
            })
        }
    }
}