//Imports
const mongoose = require('mongoose')
const Map = require('../models/Map')
const bcrypt = require('bcryptjs')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const maps_collection = process.env.MAPSCOLLECTION
const masterToken = process.env.TOKEN

exports.handler = async function(event, context){
    //Connection with MongoDB Atlas
    let connection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.se0mehr.mongodb.net/${maps_collection}?retryWrites=true&w=majority`)

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
    /*let checkAdmin = await bcrypt.compare(masterToken, token)
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
    }*/

    //Finding document
    let table = await Map.findOne({CURSO: curso})

    delete table[turno][dia][disciplina]
    
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