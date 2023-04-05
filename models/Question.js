const mongoose = require('mongoose')

const Question = mongoose.model('Question', {
    theme: "String",
    title: "String",
    answer_unef: "String",
    answer_unifan: "String",
    answer_unefead: "String",
    answer_unifanead: "String",
    created_by: "String",
    created_in: "String"
})

module.exports = Question