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
    let {cpf, dtnascimento} = eventBody

    //Find student
    let studentInfo = await Student.findOne({cpf: cpf, dtnascimento: dtnascimento})

    if(studentInfo){
        return {
            statusCode: 200,
            body: JSON.stringify({
                resposta: studentInfo
            })
        }
    }else{
        return {
            statusCode: 404,
            body: JSON.stringify({
                resposta: 'Usuário não encontrado.'
            })
        }
    }

}