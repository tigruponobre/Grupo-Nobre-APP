require('dotenv').config()
const mongoose = require('mongoose')
const Student = require('../models/Student')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME

exports.handler = async function (event, context){
    //Connection with MongoDB Atlas
    let connection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.qk8butq.mongodb.net/${db_name}?retryWrites=true&w=majority`)

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
    const {cpf, nome, ra, dtnascimento} = await JSON.parse(event.body)

    //MODEL
    const newStudent = {
        cpf,
        nome,
        ra,
        dtnascimento
    }

    //CHECK IF USER DOES'N EXIST
    studentExist = await Student.findOne({cpf: cpf})
    if(!studentExist){
        try {
            await Student.create(newStudent)
            return {
                statusCode: 201,
                body: JSON.stringify({
                    resposta: `${cpf} registered!`
                })
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    resposta: `It was not possible to insert some student.`,
                    error: error
                })
            }
        }
    }else{
        return {
            statusCode: 302,
            body: JSON.stringify({
                resposta: `Student already exists!`
            })
        }
    }

    
}