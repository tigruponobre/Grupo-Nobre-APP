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
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
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

            if(infoAdmin.permissions == 'roomMap') connection.disconnect()

            if(checkPassword){
                return{
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({
                        resposta: 'Login successful!',
                        permissions: infoAdmin.permissions,
                        token: tokenHash
                    })
                }
            }else{
                return{
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({
                        resposta: 'Incorrect password.',
                    })
                }
            }
        }
        else{
            return{
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    resposta: 'Admin not found.'
                })
            }
        }
    } catch (error) {
        return{
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                resposta: "Server error."
            })
        }
    }
}