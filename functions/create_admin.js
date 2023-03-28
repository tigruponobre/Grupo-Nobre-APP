//Imports
require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const master_token = process.env.TOKEN

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

    // Get login, password and secretKey
    const eventBody = JSON.parse(event.body)
    const {login, password, permissions, creator, currentDate, token}  = eventBody

    //Check master_token
    const authorization = await bcrypt.compare(master_token, token)
    if(!authorization){
        console.log(authorization)
        return {
            statusCode: 401,
            body: JSON.stringify({
                resposta: "User not allowed"
            })
        }
    }

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
        password: passwordHash,
        permissions,
        criador: creator,
        data_de_criacao: currentDate,
        password_changed: false
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