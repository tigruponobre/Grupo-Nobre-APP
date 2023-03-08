require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const adm_collection = process.env.ADMCOLLECTION
const token = process.env.TOKEN

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

    //Get e-mail and password
    const eventBody = JSON.parse(event.body)
    const {login, password} = eventBody 

    //TOKEN
    const salt = await bcrypt.genSalt(12)
    const tokenHash = await bcrypt.hash(token,salt)

    //Find user
    try {
        //Find Admin
        let infoAdmin = await Admin.findOne({login: login})

        if(infoAdmin){
            //Check user password
            const checkPassword = await bcrypt.compare(password, infoAdmin.password)

            if(checkPassword){
                return{
                    statusCode: 200,
                    body: JSON.stringify({
                        resposta: 'Login successful!',
                        token: tokenHash
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
                    resposta: 'Admin not found.'
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