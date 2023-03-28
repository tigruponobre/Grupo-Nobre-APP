//Imports
require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')

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
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                resposta: "Connection failed."
            })
        }
    }

    //Get login and password
    const login = await event.body
    console.log(login)
    //Get user to change
    let user_to_change = await Admin.findOne({login: login})

    //Change parameter to true
    user_to_change['password_changed'] = true

    //Confirm update
    let confirmUpdate = await Admin.updateOne({login: login}, user_to_change)

    //Response
    if(confirmUpdate.matchedCount != 0 && confirmUpdate.updateOne != 0){
        return{
            statusCode: 200,
            body: JSON.stringify({
                msg: "Update successful."
            })
        }
    }else{
        return{
            statusCode: 412,
            body: JSON.stringify({
                msg: "Update failed."
            })
        }
    }
}