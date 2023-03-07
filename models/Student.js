const mongoose = require('mongoose')

const Student = mongoose.model('Student', {
    cpf: "String",
    nome: "String",
    ra: 'String',
    dtnascimento: "String"
})

module.exports = Student