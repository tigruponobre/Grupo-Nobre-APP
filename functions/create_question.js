//Imports
const mongoose = require('mongoose')
const Question = require('../models/Question')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const token_master = process.env.TOKEN_MASTER
const token_faq = process.env.TOKEN_FAQ

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
    const { theme, title, answer_unef, answer_unifan, answer_unefead, answer_unifanead, user_name, token } = eventBody

    // Check admin
    const compareToken = await bcrypt.compare(token_master, token) || await bcrypt.compare(token_faq, token)

    if(!compareToken){
        return{
            statusCode: 401,
            body: JSON.stringify({
                msg:"Unauthorized"
            })
        }
    }
    
    //Get current date
    let newDate = new Date()
    let currentDate = await `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`
    
    try {
        // Await to create new question object
        const newQuestion = await {
            theme,
            title,
            answer_unef,
            answer_unifan,
            answer_unefead,
            answer_unifanead,
            created_by: user_name,
            created_in : currentDate
        }

        // Create object on DB
        await Question.create(newQuestion)

        return{
            statusCode: 201,
            body: JSON.stringify({
                msg: newQuestion
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
