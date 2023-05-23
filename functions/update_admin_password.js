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
    const { login, oldPassword, newPassword} = eventBody

    //Check user
    const user_to_change = await Admin.findOne({login: login})

    //Check admin old password
    const check_old_password = await bcrypt.compare(oldPassword, user_to_change['password'])
    
    if(check_old_password){
        //Generate new hash
        const salt = await bcrypt.genSalt(12)
        const new_password_hash = await bcrypt.hash(newPassword, salt)

        //Change password
        user_to_change['password'] = new_password_hash

        //Confirm update
        const confirmUpdate = await Admin.updateOne({login: login}, user_to_change)

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
}