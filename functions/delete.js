require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const databaseName = process.env.DATABASE

exports.handler = async function (event, context){
    //Connection with MongoDB Atlas
    let conection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.se0mehr.mongodb.net/${databaseName}?retryWrites=true&w=majority`)

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

    //Getting user information from request
    const eventBody = JSON.parse(event.body)
    const {name}  = eventBody

    const login = name.split(' ').join('.').toLowerCase()
    if(login){
        try {
            await User.deleteOne({login: login})
            return {
                statusCode: 200,
                body: JSON.stringify({
                    respota: 'Sucess deleting user'
                })
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    respota: 'Server error',
                    error: error
                })
            }
        }
    }
}