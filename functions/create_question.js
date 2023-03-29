//Imports
const mongoose = require('mongoose')
const Question = require('../models/Question')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const master_token = process.env.TOKEN
const minor_token = process.env.MINOR_TOKEN

exports.handler = async function(event, context){
    //Connection with MongoDB Atlas
    let connection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.qk8butq.mongodb.net/${db_name}?retryWrites=true&w=majority`)

    //Check if connetion succeeded
    if(connection){
        console.log('Connection with new DB successful!')
    }else{
        return{
            statusCode: 500,
            body: JSON.stringify({
                msg: "Connection failed."
            })
        }
    }

    //Get info variables from req body
    const eventBody = await JSON.parse(event.body)
    const { title, answer, user_name, token } = eventBody

    console.log(answer)
    //Check admin
    const compareToken = await bcrypt.compare(master_token, token) || await bcrypt.compare(minor_token, token)

    if(!compareToken){
        return{
            statusCode: 401,
            body: JSON.stringify({
                msg:"Unauthorized"
            })
        }
    }
    
    //Checking if variables are filled
    if(!title || !answer || !user_name){
        return{
            statusCode: 204,
            body: JSON.stringify({
                msg:"Wrong or empty information"
            })
        }
    }
    
    //Get current date
    let newDate = new Date()
    let currentDate = await `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`
    
    try {
        // Await to create new question object
        const newQuestion = await {
            title,
            answer,
            created_by: user_name,
            created_in : currentDate
        }

        // Create object on DB
        await Question.create(newQuestion)

        return{
            statusCode: 201,
            body: JSON.stringify({
                msg:"Question registered successfully"
            })
        }
    } catch (error) {
        return{
            statusCode: 500,
            body: JSON.stringify({
                msg:"It was not possible to register this question",
                error
            })
        }
    }
}
