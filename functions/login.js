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
const token_master = process.env.TOKEN_MASTER
const token_room_map_unef = process.env.TOKEN_ROOM_MAP_UNEF
const token_room_map_unifan = process.env.TOKEN_ROOM_MAP_UNIFAN
const token_faq = process.env.TOKEN_FAQ

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

    //Get login and password
    const eventBody = JSON.parse(event.body)
    const {login, password} = eventBody 

    //TOKEN
    const salt = await bcrypt.genSalt(8)
    let tokenHash = 'aaaaa'

    //Find user
    try {
        //Find Admin
        let infoAdmin = await Admin.findOne({login: login})
        if(!infoAdmin){
            return{
                statusCode: 404,
                body: JSON.stringify({
                    resposta: 'User not finded'
                })
            }
        }
        //User finded
        let checkPassword = await bcrypt.compare(password, infoAdmin.password)
        
        if(checkPassword){
            //Token hash
            if(infoAdmin.permissions == 'admin-master'){
                tokenHash = await bcrypt.hash(token_master, salt)
            }else if(infoAdmin.permissions == 'room-map-unef'){
                tokenHash = await bcrypt.hash(token_room_map_unef, salt)
            }else if(infoAdmin.permissions == 'room-map-unifan'){
                tokenHash = await bcrypt.hash(token_room_map_unifan, salt)
            }else if(infoAdmin.permissions == 'faq'){
                tokenHash = await bcrypt.hash(token_faq, salt)
            }

            //Return
            return {
                statusCode: 200,
                body: JSON.stringify({
                    token: tokenHash,
                    permissions: infoAdmin.permissions
                })
            }   
        }else{
            //Wrong password
            return {
                statusCode: 400,
                body: JSON.stringify({
                    resposta: 'Wrong password'
                })
            }   
        }
    } catch (error) {
        console.log(error)
        return{
            statusCode: 500,
            body: JSON.stringify({
                resposta: error
            })
        }
    }
}