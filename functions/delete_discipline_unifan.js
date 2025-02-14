//Imports
const mongoose = require('mongoose')
const Map = require('../models/Unifan_map')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_TI_USER
const db_pass = process.env.DB_TI_PASSWORD
const cluster = process.env.DB_TI_CLUSTER
const db_name = process.env.DB_TI_NAME
const token_master = process.env.TOKEN_MASTER
const token_room_map_unifan = process.env.TOKEN_ROOM_MAP_UNIFAN

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

    const eventBody = await JSON.parse(event.body)
    const { curso, turno, dia, disciplina, token } = await eventBody

    // Check admin
    let checkAdmin = await bcrypt.compare(token_master, token) || await bcrypt.compare(token_room_map_unifan, token)

    if(!checkAdmin){
        return{
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                msg: "Unauthorized"
            })
        }
    }

    //Finding document
    let table = await Map.findOne({CURSO: curso})

    //Delete table
    delete table[turno][dia][disciplina]
    
    //Confirm changes
    let confirmUpdate = await Map.updateOne({CURSO: curso}, table)

    //Response
    if(confirmUpdate.matchedCount != 0 && confirmUpdate.updateOne != 0){
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: "Delete successful."
            })
        }
    }else{
        return{
            statusCode: 412,
            body: JSON.stringify({
                resposta: "Delete failed."
            })
        }
    }
}