//Imports
const mongoose = require('mongoose')
const Map = require('../models/Map')

//Enviroment Variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const cluster = process.env.CLUSTER
const maps_collection = process.env.MAPSCOLLECTION

exports.handler = async function(event, context){
    //Connection with MongoDB Atlas
    let connection = await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@${cluster}.se0mehr.mongodb.net/${maps_collection}?retryWrites=true&w=majority`)

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

    const eventBody = await JSON.parse(event.body)
    const { curso, turno, dia } = eventBody
   
    try {
        let table = await Map.findOne({CURSO: curso})
        let information = table[turno][dia]
        return {
            statusCode: 200,
            body: JSON.stringify({
                information
            })
        }
    } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                resposta: 'Not found.'
            })
        }
    }

   

}
