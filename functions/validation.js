require('dotenv').config()

const token = process.env.TOKEN

exports.handler = async function (event, context){
    const {validationToken} = JSON.parse(event.body)
    if(validationToken == token){
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'Token Validado'
            })
        }
    }

}