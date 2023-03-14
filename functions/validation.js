require('dotenv').config()
const bcrypt = require('bcryptjs')

const token = process.env.TOKEN

exports.handler = async function (event, context){
    const {validationToken} = JSON.parse(event.body)

    let validation = await bcrypt.compare(token, validationToken)
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