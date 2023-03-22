const mongoose = require('mongoose')

const Map = mongoose.model('Map', {
    CURSO: "String",
    MODALIDADE: "String",
    MATUTINO: "Mixed",
    NOTURNO: "Mixed"
})

module.exports = Map