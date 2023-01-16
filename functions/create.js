require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS

exports.handler = async function (event, context){
    //Connection with MongoDB Atlas
    let conection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@cluster0.se0mehr.mongodb.net/administrators?retryWrites=true&w=majority`)

    //Check if connetion succeeded
    if(conection){
        console.log('Connection successful!')
    }else{
        return{
            statusCode: 500,
            body: JSON.stringify({
                resposta: "Connection failed."
            })
        }
    }

    //Get e-mail and password
    const eventBody = JSON.parse(event.body)
    const {login, password}  = eventBody 

    //Build user
    const user = {
        login,
        password
    }

    //Create user in DB
    try {
        //Create
        await User.create(user)
        return {
            statusCode: 201,
            body: JSON.stringify({
                resposta: "User created successfully"
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                resposta: "It was not possible to create user."
            })
        }
    }

}