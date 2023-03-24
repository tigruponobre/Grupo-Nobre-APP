require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const token = process.env.TOKEN

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

    //GET ALL USERS
    let allAdmins = await Admin.find()
    let users = []
    for (let index in allAdmins){
        let login = allAdmins[index]['login']
        let getName = login.split('.')
        let userName = []
        getName.forEach(element => userName.push(element.charAt(0).toUpperCase() + element.slice(1)))
        userName = userName.join(' ')
        users.push(userName)
    }

    // console.log(allAdmins)

    if(allAdmins){
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: users.sort()
            })
        }
    }else{
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: "Nenhum usuário encontrado"
            })
        }
    }
}