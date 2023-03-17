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

    // Destructuring variabels
    const eventBody = await JSON.parse(event.body)
    let { CURSO, MATUTINO, NOTURNO } = eventBody

    // Register map
    if (MATUTINO && NOTURNO){
        let newMap = {
            CURSO,
            MATUTINO,
            NOTURNO
    }
    try {
        await Map.create(newMap)
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: 'Map registered'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                resposta: 'It was not possible to registrate this map'
            })
        }
    }
    }else if (MATUTINO){
        let newMap = {
                CURSO,
                "MATUTINO": MATUTINO
        }
        try {
            await Map.create(newMap)
            return{
                statusCode: 200,
                body: JSON.stringify({
                    resposta: 'Map registered'
                })
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    resposta: 'It was not possible to registrate this map'
                })
            }
        }
    }else if (NOTURNO){
        let newMap = {
            CURSO,
            NOTURNO
    }
    try {
        await Map.create(newMap)
        return{
            statusCode: 200,
            body: JSON.stringify({
                resposta: 'Map registered'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                resposta: 'It was not possible to registrate this map'
                })
            }
        }
    }
}