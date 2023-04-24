const mongoose = require('mongoose')
const Question = require('../models/Question')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME

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

    const eventBody = await JSON.parse(event.body)
    const { theme } = eventBody

    try {
        const findTheme = await Question.find({ theme: theme})
        if(findTheme){
            return {
                statusCode: 200,
                body: JSON.stringify({
                    content: findTheme
                })
            }
        }else{
            return {
                statusCode: 404,
                body: JSON.stringify({
                    msg: "Theme not found"
                })
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                msg: "Server error"
            })
        }
    }
}