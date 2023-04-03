//Imports
require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

//Enviroments variables
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

    const eventBody = JSON.parse(event.body)
    const { login, oldPassword, newPasswrd} = eventBody

    //Check user
    const findLogin = await Admin.findOne({login: login})
}