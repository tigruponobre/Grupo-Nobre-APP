require('dotenv').config()
const bcrypt = require('bcryptjs')

const master_token = process.env.TOKEN

exports.handler = async function (event, context){
    const eventBody = await JSON.parse(event.body)
    const {token, permissions} = eventBody

    if(permissions != 'super-admin'){
        return {
            statusCode: 401,
            body: JSON.stringify({
                msg: 'Unauthorized'
            })
        }
    }

    let validation = await bcrypt.compare(master_token, token)

    if(validation){
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'Token Validado'
            })
        }
    }else{
        return {
            statusCode: 401,
            body: JSON.stringify({
                msg: 'Token inválido'
            })
        }
    }

}