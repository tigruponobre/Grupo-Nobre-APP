require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const token = process.env.TOKEN

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

    //Find user
    try {
        //Find User
        let infoUser = await User.findOne({login: login})

        if(infoUser){
            //Check user password
            if(infoUser.password == password){
                return{
                    statusCode: 200,
                    body: JSON.stringify({
                        resposta: 'Login successful!',
                        token: token
                    })
                }
            }else{
                return{
                    statusCode: 400,
                    body: JSON.stringify({
                        resposta: 'Incorrect password.',
                    })
                }
            }
        }
        else{
            return{
                statusCode: 404,
                body: JSON.stringify({
                    resposta: 'User not found.'
                })
            }
        }
    } catch (error) {
        return{
            statusCode: 500,
            body: JSON.stringify({
                resposta: "Server error."
            })
        }
    }
}