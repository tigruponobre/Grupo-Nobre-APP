//Imports
require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const axios = require('axios')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const master_token = process.env.TOKEN
const minor_token = process.env.MINOR_TOKEN

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
    const eventBody = JSON.parse(event.body)
    const {login, password} = eventBody 

    //TOKEN
    const salt = await bcrypt.genSalt(12)
    let tokenHash = ''
    const response = await axios.get('http://localhost:8888/.netlify/functions/search_super_admins')
    const data = await response.data.users
    if(data.includes(login)){
        console.log('ok')
        tokenHash = await bcrypt.hash(master_token,salt)
        console.log('ok2')
    }else{
        tokenHash = await bcrypt.hash(minor_token,salt)
    }


    //Find user
    try {
        //Find Admin
        let infoAdmin = await Admin.findOne({login: login})
        //User finded
        if(infoAdmin){
            //Check user password
            const checkPassword = await bcrypt.compare(password, infoAdmin.password)

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
            }
            //User not finded
            else{
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