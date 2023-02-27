require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const collection = process.env.COLLECTION

exports.handler = async function (event, context){
    //Connection with MongoDB Atlas
    let conection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.se0mehr.mongodb.net/${collection}?retryWrites=true&w=majority`)

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

    //GET ALL USERS
    let allUsers = await User.find()
    let users = []
    for (let index in allUsers){
        let login = allUsers[index]['login']
        let getName = login.split('.')
        let userName = []
        getName.forEach(element => userName.push(element.charAt(0).toUpperCase() + element.slice(1)))
        userName = userName.join(' ')
        users.push(userName)
    }

    // console.log(allUsers)

    if(allUsers){
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: users
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