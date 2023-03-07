const mongoose = require('mongoose')

const Admin = mongoose.model('Admin', {
    login: "String",
    password: "String"
})

module.exports = Admin