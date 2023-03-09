require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const adm_collection = process.env.ADMCOLLECTION
const masterKey = process.env.MASTERKEY

exports.handler = async function (event, context){
    //Connection with MongoDB Atlas
    let conection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.se0mehr.mongodb.net/${adm_collection}?retryWrites=true&w=majority`)

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

    // Get login, password and secretKey
    const eventBody = JSON.parse(event.body)
    const {login, password}  = eventBody

    //Check if admin exists
    const adminExists = await Admin.findOne({login: login})

    if(adminExists){
        return {
            statusCode: 302,
            body: JSON.stringify({
                resposta: "Admin already exists."
            })
        }
    }

    //Encrypt password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    
    //Model
    const user = {
        login,
        password: passwordHash
    }

    //Register admin
    try {
        await Admin.create(user)
        return{
            statusCode: 201,
            body: JSON.stringify({
                resposta: "Admin created successfully"
            })
        }
    } catch (error) {
        return{
            statusCode: 500,
            body: JSON.stringify({
            resposta: "It was not possible to create user."
            })
        }
    }
}