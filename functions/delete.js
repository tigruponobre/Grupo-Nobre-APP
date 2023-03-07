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

    //Getting user information from request
    const eventBody = JSON.parse(event.body)
    const {name, token}  = eventBody

    //Verifying token
    if(!bcrypt.compare(token, masterKey)){
        return {
            statusCode: 401,
            body: JSON.stringify({
                resposta: "Access denied"
            })
        }
    }

    //Transforme user name in user login
    const login = name.split(' ').join('.').toLowerCase()

    //Check if user exists
    const userExists = await Admin.findOne({login: login})
    if(!userExists){
        return {
            statusCode: 404,
            body: JSON.stringify({
                respota: 'Admin not found'
            })
        }
    }

    //Deleting user
    try{
        await Admin.deleteOne({login: login})
        return {
            statusCode: 200,
            body: JSON.stringify({
                respota: 'Sucess deleting user'
            })
        }
    }catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                respota: 'It was not possible to delete this user',
                error: error
            })
        }
    }
}