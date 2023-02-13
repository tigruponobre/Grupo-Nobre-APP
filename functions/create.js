require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

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

    //Encrypt password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)


    //Build user
    const user = {
        login,
        password: passwordHash
    }

    const userExists = await User.findOne({login: login})

    if(userExists){
        return {
            statusCode: 400,
            body: JSON.stringify({
                resposta: "User already exists."
            })
        }
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