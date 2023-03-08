require('dotenv').config()
const mongoose = require('mongoose')
const Student = require('../models/Student')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const cn_collection = process.env.CNCOLLECTION


exports.handler = async function(event, context){
    //Connection with MongoDB Atlas
    let connection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.se0mehr.mongodb.net/${cn_collection}?retryWrites=true&w=majority`)

    //Check if connetion succeeded
    if(connection){
        console.log('Connection successful!')
    }else{
        return{
            statusCode: 500,
            body: JSON.stringify({
                resposta: "Connection failed."
            })
        }
    }

    //Destructuring body req and posting data
    const eventBody = await JSON.parse(event.body)
    const jsonBody = await JSON.parse(eventBody)
    let newStudents = []

    for (let cpf of Object.keys(jsonBody)){

        //Check if student exists
        let studentExists = await Student.findOne({cpf: cpf})
        
        //Se não existir, cadastrar
        if(!studentExists){
            let newStudent = {
                cpf: cpf,
                nome: jsonBody[cpf]['NOME'],
                ra: jsonBody[cpf]['RA'],
                dtnascimento: jsonBody[cpf]['DTNASCIMENTO']
            }
            newStudents.push(newStudent)
        }
    }

    try {
        await Student.insertMany(newStudents)
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                resposta: `It was not possible to some student.`,
                error: error
            })
        }
    }

    return {
        statusCode: 201,
        body: JSON.stringify({
            resposta: "All possible students have been registered!"
        })
    }

}