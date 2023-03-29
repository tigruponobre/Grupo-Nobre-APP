const mongoose = require('mongoose')

const Question = mongoose.model('Question', {
    title: "String",
    answer: "String",
    created_by: "String",
    created_in: "String"
})

module.exports = Question