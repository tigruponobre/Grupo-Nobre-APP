require('dotenv').config()
const bcrypt = require('bcryptjs')

const token_master = process.env.TOKEN_MASTER

exports.handler = async function (event, context){
    const eventBody = await JSON.parse(event.body)
    const {token, permissions} = eventBody

    if(permissions != 'admin-master'){
        return {
            statusCode: 401,
            body: JSON.stringify({
                msg: 'Unauthorized'
            })
        }
    }

    let validation = await bcrypt.compare(token_master, token)

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