const mongoose = require('mongoose')

const Question = mongoose.model('Question', {
    title: "String",
    content: "String",
    created_by: "String",
    created_in: "String"
})

module.exports = Question