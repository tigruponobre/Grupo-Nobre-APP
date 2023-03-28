const mongoose = require('mongoose')

const Admin = mongoose.model('Admin', {
    login: "String",
    password: "String",
    permissions: "String",
    criador: "String",
    data_de_criacao: "String",
    password_changed: "Boolean"
})

module.exports = Admin